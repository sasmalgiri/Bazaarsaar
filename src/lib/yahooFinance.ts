/**
 * Yahoo Finance helper using the yahoo-finance2 package (v3).
 * This package handles crumb/cookie authentication automatically
 * and stays updated with Yahoo's API changes.
 */
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

/**
 * Fetch historical stock data (OHLCV).
 */
export async function getHistoricalData(
  symbol: string,
  period1: Date,
  period2: Date,
  interval: '1d' | '1wk' | '1mo' = '1d'
) {
  const result = await yf.chart(symbol, {
    period1,
    period2,
    interval,
  });

  if (!result.quotes || result.quotes.length === 0) {
    return [];
  }

  return result.quotes
    .filter((q: Record<string, unknown>) => q.close !== null && q.close !== undefined)
    .map((q: Record<string, unknown>) => ({
      date: (q.date as Date).toISOString().split('T')[0],
      open: (q.open as number) ?? 0,
      high: (q.high as number) ?? 0,
      low: (q.low as number) ?? 0,
      close: q.close as number,
      volume: (q.volume as number) ?? 0,
    }));
}

/**
 * Fetch real-time quotes for multiple symbols.
 */
export async function getQuotes(symbols: string[]) {
  const results: Record<
    string,
    { price: number; change: number; changePercent: number; volume: number }
  > = {};

  for (const symbol of symbols) {
    try {
      const q = await yf.quote(symbol);
      const sym = symbol.replace('.NS', '').replace('.BO', '');
      results[sym] = {
        price: (q as Record<string, unknown>).regularMarketPrice as number ?? 0,
        change: (q as Record<string, unknown>).regularMarketChange as number ?? 0,
        changePercent: (q as Record<string, unknown>).regularMarketChangePercent as number ?? 0,
        volume: (q as Record<string, unknown>).regularMarketVolume as number ?? 0,
      };
    } catch {
      const sym = symbol.replace('.NS', '').replace('.BO', '');
      results[sym] = { price: 0, change: 0, changePercent: 0, volume: 0 };
    }
  }

  return results;
}
