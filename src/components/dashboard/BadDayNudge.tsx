'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Heart, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface BadDayNudgeProps {
  netPnl: number;
  lossCount: number;
  totalTrades: number;
}

export function BadDayNudge({ netPnl, lossCount, totalTrades }: BadDayNudgeProps) {
  // Show only when user has trades and is in a losing position
  if (totalTrades === 0 || netPnl >= 0) return null;

  const lossRate = totalTrades > 0 ? (lossCount / totalTrades) * 100 : 0;
  const isHeavyLoss = lossRate >= 60 || netPnl < -5000;

  if (!isHeavyLoss) return null;

  return (
    <GlassCard className="p-5 border-l-4 border-amber-500/40">
      <div className="flex items-start gap-3">
        <Heart size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#d4d4e8] mb-1">
            Tough phase. That&apos;s normal.
          </h3>
          <p className="text-xs text-[#6b6b8a] leading-relaxed mb-1">
            93% of traders have losing periods. What separates the 7% who survive is that they
            <strong className="text-[#d4d4e8]"> journal, reflect, and don&apos;t revenge trade</strong>.
            You&apos;re already here — that&apos;s more than most do.
          </p>
          <p className="text-[11px] text-amber-500/60 mb-3" lang="hi">
            मुश्किल दौर सामान्य है। 93% traders को losses होते हैं। जो 7% बचते हैं वो journal करते हैं,
            सोचते हैं, और बदले की trading नहीं करते। आप यहां हैं — ये बहुतों से ज़्यादा है।
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="p-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/10">
              <p className="text-[10px] text-amber-500 font-medium mb-0.5">Don&apos;t revenge trade</p>
              <p className="text-[10px] text-[#4a4a6a]">Take a break. Come back calm.</p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/[0.06] border border-green-500/10">
              <p className="text-[10px] text-green-500 font-medium mb-0.5">Journal this feeling</p>
              <p className="text-[10px] text-[#4a4a6a]">Write what happened. Future you will thank you.</p>
            </div>
          </div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1 mt-3 text-[11px] text-amber-500 no-underline hover:underline"
          >
            <BookOpen size={12} />
            Read: Why traders lose money
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
