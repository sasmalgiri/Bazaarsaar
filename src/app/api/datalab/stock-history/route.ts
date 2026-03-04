import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/datalab/stock-history?symbol=RELIANCE&period=1y&interval=1d
 *
 * Proxies Yahoo Finance historical data for NSE stocks.
 * Adds .NS suffix automatically for Indian stocks.
 */
export async function GET(req: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol')?.trim().toUpperCase();
  const period = searchParams.get('period') || '1y'; // 1m, 3m, 6m, 1y, 2y, 5y
  const interval = searchParams.get('interval') || '1d'; // 1d, 1wk, 1mo

  if (!symbol) {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 });
  }

  // Build Yahoo Finance ticker — add .NS for NSE if no suffix present
  const ticker = symbol.includes('.') ? symbol : `${symbol}.NS`;

  // Calculate period timestamps
  const now = Math.floor(Date.now() / 1000);
  const periodMap: Record<string, number> = {
    '1m': 30 * 86400,
    '3m': 90 * 86400,
    '6m': 180 * 86400,
    '1y': 365 * 86400,
    '2y': 730 * 86400,
    '5y': 1825 * 86400,
  };
  const seconds = periodMap[period] || 365 * 86400;
  const period1 = now - seconds;

  const url = `https://query1.finance.yahoo.com/v7/finance/download/${encodeURIComponent(ticker)}?period1=${period1}&period2=${now}&interval=${interval}&events=history&includeAdjustedClose=true`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BazaarSaar/1.0)',
      },
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 404 || text.includes('No data found')) {
        return NextResponse.json(
          { error: `No data found for "${symbol}". Check the symbol and try again.` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Yahoo Finance returned ${res.status}` },
        { status: res.status }
      );
    }

    const csv = await res.text();
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      return NextResponse.json({ error: 'No data returned' }, { status: 404 });
    }

    // Parse CSV → JSON
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      if (cols.length < headers.length) continue;

      const close = parseFloat(cols[4]); // Close column
      if (isNaN(close) || cols[4] === 'null') continue;

      rows.push({
        date: cols[0],
        open: parseFloat(cols[1]) || 0,
        high: parseFloat(cols[2]) || 0,
        low: parseFloat(cols[3]) || 0,
        close,
        volume: parseInt(cols[6]) || 0,
      });
    }

    return NextResponse.json({
      symbol: ticker,
      interval,
      rows,
      count: rows.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
