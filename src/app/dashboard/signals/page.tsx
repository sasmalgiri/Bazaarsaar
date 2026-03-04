'use client';

import { SignalsCard } from '@/components/dashboard/SignalsCard';

export default function SignalsPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-[#fafaff] mb-6">Signals</h1>
      <SignalsCard />
    </div>
  );
}
