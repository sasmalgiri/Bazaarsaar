import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface CSVRow {
  symbol: string;
  exchange: string;
  side: string;
  quantity: string;
  price: string;
  order_type?: string;
  traded_at: string;
  order_id?: string;
}

function parseCSV(text: string): CSVRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    const symbol = row['tradingsymbol'] || row['symbol'] || row['instrument'] || '';
    const exchange = row['exchange'] || 'NSE';
    const side = (row['transaction_type'] || row['side'] || row['buy/sell'] || '').toUpperCase();
    const quantity = row['quantity'] || row['qty'] || '0';
    const price = row['average_price'] || row['price'] || row['rate'] || '0';
    const orderType = row['order_type'] || 'MARKET';
    const tradedAt = row['order_timestamp'] || row['traded_at'] || row['trade_date'] || row['date'] || '';
    const orderId = row['order_id'] || row['order_no'] || '';

    if (symbol && side && tradedAt) {
      rows.push({ symbol, exchange, side, quantity, price, order_type: orderType, traded_at: tradedAt, order_id: orderId });
    }
  }
  return rows;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const csvText = await file.text();
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid rows found in CSV' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Create import job
    const { data: importJob } = await admin.from('import_job').insert({
      user_id: user.id,
      source: 'csv',
      status: 'processing',
      file_name: file.name,
      total_rows: rows.length,
      started_at: new Date().toISOString(),
    }).select().single();

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const tradedAt = new Date(row.traded_at);
      if (isNaN(tradedAt.getTime())) {
        skipped++;
        continue;
      }

      const { error } = await admin.from('trade').upsert({
        user_id: user.id,
        import_job_id: importJob!.id,
        broker_order_id: row.order_id || null,
        symbol: row.symbol.toUpperCase(),
        exchange: row.exchange.toUpperCase(),
        segment: row.exchange === 'NFO' || row.exchange === 'BFO' ? 'FO' : 'EQ',
        side: row.side === 'BUY' || row.side === 'B' ? 'BUY' : 'SELL',
        quantity: parseInt(row.quantity) || 0,
        price: parseFloat(row.price) || 0,
        order_type: row.order_type || 'MARKET',
        status: 'CLOSED',
        traded_at: tradedAt.toISOString(),
        import_source: 'csv',
      }, { onConflict: row.order_id ? 'user_id,broker_order_id' : undefined });

      if (error) skipped++;
      else imported++;
    }

    // Update import job
    await admin.from('import_job').update({
      status: 'done',
      imported_rows: imported,
      skipped_rows: skipped,
      completed_at: new Date().toISOString(),
    }).eq('id', importJob!.id);

    // Log audit
    await admin.from('audit_event').insert({
      user_id: user.id,
      action: 'csv_import',
      detail: { file_name: file.name, imported, skipped, total: rows.length },
    });

    return NextResponse.json({ success: true, imported, skipped, total: rows.length });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
