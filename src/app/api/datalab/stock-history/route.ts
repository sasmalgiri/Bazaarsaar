import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getHistoricalData } from '@/lib/yahooFinance';

/**
 * GET /api/datalab/stock-history?symbol=RELIANCE&period=1y&interval=1d
 *
 * Returns historical OHLCV data for NSE stocks via Yahoo Finance.
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
  const period = searchParams.get('period') || '1y';
  const interval = (searchParams.get('interval') || '1d') as '1d' | '1wk' | '1mo';

  if (!symbol) {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 });
  }

  // Build Yahoo Finance ticker — add .NS for NSE if no suffix present
  const ticker = symbol.includes('.') ? symbol : `${symbol}.NS`;

  // Calculate period dates
  const now = new Date();
  const periodMap: Record<string, number> = {
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365,
    '2y': 730,
    '5y': 1825,
  };
  const days = periodMap[period] || 365;
  const period1 = new Date(now.getTime() - days * 86400 * 1000);

  try {
    const rows = await getHistoricalData(ticker, period1, now, interval);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: `No data found for "${symbol}". Check the symbol and try again.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      symbol: ticker,
      interval,
      rows,
      count: rows.length,
    });
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes('Not Found') || message.includes('no data')) {
      return NextResponse.json(
        { error: `No data found for "${symbol}". Check the symbol and try again.` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
