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

type BrokerFormat = 'zerodha' | 'groww' | 'angelone' | 'upstox' | 'auto';

function detectBrokerFormat(headers: string[]): BrokerFormat {
  const h = headers.join(',').toLowerCase();
  if (h.includes('tradingsymbol') && h.includes('order_timestamp')) return 'zerodha';
  if (h.includes('stock_name') || h.includes('scrip_name')) return 'groww';
  if (h.includes('script') || (h.includes('trade_no') && h.includes('segment'))) return 'angelone';
  if (h.includes('trading_symbol') && h.includes('exchange_timestamp')) return 'upstox';
  return 'auto';
}

function parseCSV(text: string): { rows: CSVRow[]; detectedBroker: BrokerFormat } {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { rows: [], detectedBroker: 'auto' };

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_').replace(/['"]/g, ''));
  const detectedBroker = detectBrokerFormat(headers);
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle CSV fields that may contain commas within quotes
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    let symbol = '';
    let exchange = '';
    let side = '';
    let quantity = '';
    let price = '';
    let orderType = '';
    let tradedAt = '';
    let orderId = '';

    switch (detectedBroker) {
      case 'groww':
        // Groww CSV: stock_name/scrip_name, exchange, type/transaction_type, quantity/qty, price/avg_price, order_date/trade_date
        symbol = row['stock_name'] || row['scrip_name'] || row['symbol'] || '';
        exchange = row['exchange'] || 'NSE';
        side = (row['type'] || row['transaction_type'] || row['buy/sell'] || '').toUpperCase();
        quantity = row['quantity'] || row['qty'] || row['traded_qty'] || '0';
        price = row['price'] || row['avg_price'] || row['average_price'] || '0';
        orderType = 'MARKET';
        tradedAt = row['order_date'] || row['trade_date'] || row['date'] || '';
        orderId = row['order_id'] || row['order_no'] || '';
        break;

      case 'angelone':
        // Angel One CSV: script/trade_symbol, exchange, buy_sell/type, quantity, price/rate, trade_date/order_date
        symbol = row['script'] || row['trade_symbol'] || row['scrip'] || row['symbol'] || '';
        exchange = row['exchange'] || row['exch'] || 'NSE';
        side = (row['buy_sell'] || row['buy/sell'] || row['type'] || row['transaction_type'] || '').toUpperCase();
        quantity = row['quantity'] || row['qty'] || row['trade_qty'] || '0';
        price = row['price'] || row['rate'] || row['avg_price'] || '0';
        orderType = row['order_type'] || 'MARKET';
        tradedAt = row['trade_date'] || row['order_date'] || row['date'] || '';
        orderId = row['trade_no'] || row['order_no'] || row['order_id'] || '';
        break;

      case 'upstox':
        // Upstox CSV: trading_symbol, exchange, transaction_type, quantity, price, exchange_timestamp
        symbol = row['trading_symbol'] || row['tradingsymbol'] || row['symbol'] || '';
        exchange = row['exchange'] || 'NSE';
        side = (row['transaction_type'] || row['type'] || row['side'] || '').toUpperCase();
        quantity = row['quantity'] || row['qty'] || row['traded_quantity'] || '0';
        price = row['price'] || row['average_price'] || row['avg_price'] || '0';
        orderType = row['order_type'] || row['product'] || 'MARKET';
        tradedAt = row['exchange_timestamp'] || row['order_timestamp'] || row['trade_date'] || '';
        orderId = row['order_id'] || row['order_ref_id'] || '';
        break;

      default:
        // Zerodha or auto-detect: flexible column mapping
        symbol = row['tradingsymbol'] || row['symbol'] || row['instrument'] || '';
        exchange = row['exchange'] || 'NSE';
        side = (row['transaction_type'] || row['side'] || row['buy/sell'] || '').toUpperCase();
        quantity = row['quantity'] || row['qty'] || '0';
        price = row['average_price'] || row['price'] || row['rate'] || '0';
        orderType = row['order_type'] || 'MARKET';
        tradedAt = row['order_timestamp'] || row['traded_at'] || row['trade_date'] || row['date'] || '';
        orderId = row['order_id'] || row['order_no'] || '';
        break;
    }

    // Normalize side values
    if (side === 'B' || side === 'BUY' || side === 'BOUGHT') side = 'BUY';
    else if (side === 'S' || side === 'SELL' || side === 'SOLD') side = 'SELL';

    if (symbol && side && tradedAt) {
      rows.push({ symbol, exchange, side, quantity, price, order_type: orderType, traded_at: tradedAt, order_id: orderId });
    }
  }
  return { rows, detectedBroker };
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
    const { rows, detectedBroker } = parseCSV(csvText);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid rows found in CSV. Supported formats: Zerodha, Groww, Angel One, Upstox.' }, { status: 400 });
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

    // Build batch — validate dates upfront, separate valid from invalid rows
    const validRows: typeof rows extends (infer T)[] ? { row: T; tradedAt: Date }[] : never = [];
    let skipped = 0;

    for (const row of rows) {
      const tradedAt = new Date(row.traded_at);
      if (isNaN(tradedAt.getTime())) {
        skipped++;
      } else {
        validRows.push({ row, tradedAt });
      }
    }

    // Batch upsert in chunks of 500 for efficient DB writes
    const BATCH_SIZE = 500;
    let imported = 0;

    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const chunk = validRows.slice(i, i + BATCH_SIZE);
      const records = chunk.map(({ row, tradedAt }) => ({
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
      }));

      const { error, count } = await admin.from('trade').upsert(records, {
        onConflict: 'user_id,broker_order_id',
        count: 'exact',
      });

      if (error) {
        skipped += chunk.length;
      } else {
        imported += count ?? chunk.length;
      }
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

    return NextResponse.json({ success: true, imported, skipped, total: rows.length, broker: detectedBroker });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
