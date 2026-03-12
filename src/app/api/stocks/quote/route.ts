import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { yahooFetch } from '@/lib/yahooFinance';

/**
 * GET /api/stocks/quote?symbols=RELIANCE,TCS,INFY
 *
 * Returns current price and daily change for NSE stocks via Yahoo Finance.
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const symbolsParam = searchParams.get('symbols')?.trim();

  if (!symbolsParam) {
    return NextResponse.json({ error: 'symbols parameter is required' }, { status: 400 });
  }

  const symbols = symbolsParam
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 20); // Max 20 symbols per request

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'No valid symbols provided' }, { status: 400 });
  }

  const tickers = symbols.map((s) => (s.includes('.') ? s : `${s}.NS`));

  try {
    const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${tickers.join(',')}`;

    const res = await yahooFetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Yahoo Finance returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const results = data.quoteResponse?.result || [];

    const quotes: Record<string, { price: number; change: number; changePercent: number; volume: number }> = {};

    for (const q of results) {
      // Strip .NS suffix for the key
      const sym = (q.symbol || '').replace('.NS', '').replace('.BO', '');
      quotes[sym] = {
        price: q.regularMarketPrice ?? 0,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
        volume: q.regularMarketVolume ?? 0,
      };
    }

    return NextResponse.json({ quotes });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
