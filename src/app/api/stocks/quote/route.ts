import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getQuotes } from '@/lib/yahooFinance';

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
    .slice(0, 20);

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'No valid symbols provided' }, { status: 400 });
  }

  const tickers = symbols.map((s) => (s.includes('.') ? s : `${s}.NS`));

  try {
    const quotes = await getQuotes(tickers);
    return NextResponse.json({ quotes });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
