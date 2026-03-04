'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CalendarDays } from 'lucide-react';
import { formatINR } from '@/lib/marketTime';

interface Trade {
  traded_at?: string;
  net_pnl?: number;
  pnl?: number;
}

interface PnlCalendarHeatmapProps {
  trades: Trade[];
}

function getHeatColor(pnl: number): string {
  if (pnl === 0) return 'bg-white/[0.03]';
  if (pnl > 0) {
    if (pnl > 10000) return 'bg-green-500/60';
    if (pnl > 5000) return 'bg-green-500/40';
    if (pnl > 1000) return 'bg-green-500/25';
    return 'bg-green-500/15';
  }
  if (pnl < -10000) return 'bg-red-500/60';
  if (pnl < -5000) return 'bg-red-500/40';
  if (pnl < -1000) return 'bg-red-500/25';
  return 'bg-red-500/15';
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function PnlCalendarHeatmap({ trades }: PnlCalendarHeatmapProps) {
  const { weeks, monthLabels } = useMemo(() => {
    // Build daily P&L map for last 90 days
    const dailyPnl: Record<string, number> = {};
    for (const t of trades) {
      if (!t.traded_at) continue;
      const date = t.traded_at.split('T')[0];
      dailyPnl[date] = (dailyPnl[date] || 0) + (t.net_pnl || t.pnl || 0);
    }

    // Generate 90-day grid (13 weeks)
    const today = new Date();
    const days: { date: string; pnl: number; dayOfWeek: number }[] = [];

    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dow = d.getDay();
      days.push({
        date: dateStr,
        pnl: dailyPnl[dateStr] || 0,
        dayOfWeek: dow === 0 ? 6 : dow - 1, // Monday = 0
      });
    }

    // Group into weeks
    const weekGroups: { date: string; pnl: number; dayOfWeek: number }[][] = [];
    let currentWeek: typeof days = [];

    for (const day of days) {
      if (day.dayOfWeek === 0 && currentWeek.length > 0) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    }
    if (currentWeek.length > 0) weekGroups.push(currentWeek);

    // Month labels
    const labels: { label: string; weekIdx: number }[] = [];
    let lastMonth = '';
    for (let wi = 0; wi < weekGroups.length; wi++) {
      const firstDay = weekGroups[wi][0];
      const month = new Date(firstDay.date).toLocaleDateString('en-US', { month: 'short' });
      if (month !== lastMonth) {
        labels.push({ label: month, weekIdx: wi });
        lastMonth = month;
      }
    }

    return { weeks: weekGroups, monthLabels: labels };
  }, [trades]);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays size={18} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">Daily P&L Heatmap</h3>
        <span className="text-[10px] text-[#4a4a6a] ml-auto">Last 90 days</span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Month labels */}
          <div className="flex ml-8 mb-1">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="text-[10px] text-[#4a4a6a]"
                style={{ marginLeft: i === 0 ? m.weekIdx * 28 : undefined, width: 28, position: i > 0 ? 'absolute' : undefined, left: i > 0 ? 32 + m.weekIdx * 28 : undefined }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAYS.map((day, i) => (
                <div key={i} className="h-[22px] flex items-center">
                  <span className="text-[9px] text-[#4a4a6a] w-6">{i % 2 === 0 ? day : ''}</span>
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week.find((d) => d.dayOfWeek === di);
                  if (!day) return <div key={di} className="w-[22px] h-[22px]" />;

                  return (
                    <div
                      key={di}
                      className={`w-[22px] h-[22px] rounded-sm ${getHeatColor(day.pnl)} transition-colors cursor-default`}
                      title={`${day.date}: ${day.pnl !== 0 ? formatINR(day.pnl) : 'No trades'}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-8">
            <span className="text-[9px] text-[#4a4a6a]">Loss</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-red-500/60" />
              <div className="w-3 h-3 rounded-sm bg-red-500/40" />
              <div className="w-3 h-3 rounded-sm bg-red-500/15" />
              <div className="w-3 h-3 rounded-sm bg-white/[0.03]" />
              <div className="w-3 h-3 rounded-sm bg-green-500/15" />
              <div className="w-3 h-3 rounded-sm bg-green-500/40" />
              <div className="w-3 h-3 rounded-sm bg-green-500/60" />
            </div>
            <span className="text-[9px] text-[#4a4a6a]">Profit</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
