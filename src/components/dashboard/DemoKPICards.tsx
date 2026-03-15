'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { BarChart3, Target, TrendingUp, Scale, Flame } from 'lucide-react';
import Link from 'next/link';

const DEMO_KPIS = [
  { label: 'Total Trades', value: '47', icon: BarChart3, color: 'text-cyan-500' },
  { label: 'Win Rate', value: '55.3%', sub: '26W / 21L', icon: Target, color: 'text-green-500' },
  { label: 'Net P&L', value: '+₹12,450', icon: TrendingUp, color: 'text-green-500' },
  { label: 'Avg Win / Loss', value: '1.85R', icon: Scale, color: 'text-green-500' },
  { label: 'Streak', value: '3W', icon: Flame, color: 'text-green-500' },
];

export function DemoKPICards() {
  return (
    <div className="relative">
      {/* Demo overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#0a0a0f]/60 backdrop-blur-[2px]">
        <div className="text-center p-4">
          <p className="text-sm font-medium text-[#d4d4e8] mb-1">
            Your dashboard will look like this
          </p>
          <p className="text-[11px] text-amber-500/60 mb-3" lang="hi">
            आपका dashboard ऐसा दिखेगा
          </p>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium text-green-500 border border-green-500/20 bg-green-500/10 no-underline hover:bg-green-500/20 transition-colors"
          >
            Import your trades to see real data
          </Link>
        </div>
      </div>

      {/* Blurred demo cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 opacity-60">
        {DEMO_KPIS.map((kpi) => (
          <GlassCard key={kpi.label} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon size={14} className={kpi.color} />
              <span className="text-[10px] text-[#6b6b8a] uppercase tracking-wider">{kpi.label}</span>
            </div>
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            {kpi.sub && <p className="text-[10px] text-[#4a4a6a] mt-0.5">{kpi.sub}</p>}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
