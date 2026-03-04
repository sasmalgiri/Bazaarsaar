'use client';

import { useParams } from 'next/navigation';
import { TradeDetail } from '@/components/trades/TradeDetail';

export default function TradeDetailPage() {
  const params = useParams();
  const tradeId = params.id as string;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <TradeDetail tradeId={tradeId} />
    </div>
  );
}
