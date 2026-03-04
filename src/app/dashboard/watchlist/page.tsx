'use client';

import { WatchlistCard } from '@/components/dashboard/WatchlistCard';

export default function WatchlistPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-[#fafaff] mb-6">Watchlist</h1>
      <WatchlistCard />
    </div>
  );
}
