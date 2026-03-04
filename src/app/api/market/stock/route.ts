import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { enforceDisplayOnly } from '@/lib/apiSecurity';
import { SEBI_DISCLAIMERS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const blocked = enforceDisplayOnly(request, '/api/market/stock');
  if (blocked) return blocked;

  const symbol = request.nextUrl.searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 });
  }

  return NextResponse.json({
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Ltd.`,
    exchange: 'NSE',
    ltp: 0,
    change: 0,
    changePercent: 0,
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    updatedAt: new Date().toISOString(),
    disclaimer: SEBI_DISCLAIMERS.general,
    _note: 'Placeholder data. Connect data pipeline for live data.',
  });
}
