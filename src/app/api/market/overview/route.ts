import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { enforceDisplayOnly } from '@/lib/apiSecurity';
import { isMarketOpen } from '@/lib/marketTime';
import { SEBI_DISCLAIMERS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const blocked = enforceDisplayOnly(request, '/api/market/overview');
  if (blocked) return blocked;

  return NextResponse.json({
    indices: [
      { symbol: 'NIFTY 50', name: 'Nifty 50', value: 22450.50, change: 125.30, changePercent: 0.56 },
      { symbol: 'BANK NIFTY', name: 'Nifty Bank', value: 47890.25, change: -98.75, changePercent: -0.21 },
      { symbol: 'NIFTY IT', name: 'Nifty IT', value: 38120.00, change: 245.50, changePercent: 0.65 },
      { symbol: 'NIFTY PHARMA', name: 'Nifty Pharma', value: 17845.75, change: -42.30, changePercent: -0.24 },
    ],
    marketStatus: isMarketOpen() ? 'open' : 'closed',
    timestamp: new Date().toISOString(),
    disclaimer: SEBI_DISCLAIMERS.general,
    _note: 'Placeholder data. Connect data pipeline for live data.',
  });
}
