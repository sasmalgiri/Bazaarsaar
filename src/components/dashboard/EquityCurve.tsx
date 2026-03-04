'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface EquityCurveProps {
  trades: { traded_at?: string; net_pnl?: number; pnl?: number }[];
}

export function EquityCurve({ trades }: EquityCurveProps) {
  const data = useMemo(() => {
    const result: { date: string; pnl: number; drawdown: number }[] = [];
    trades.reduce((acc, t) => {
      const pnl = t.net_pnl || t.pnl || 0;
      const cumPnl = acc.cumPnl + pnl;
      const peak = Math.max(acc.peak, cumPnl);
      const dd = peak > 0 ? ((cumPnl - peak) / peak) * 100 : 0;
      result.push({
        date: (t.traded_at || '').split('T')[0],
        pnl: +cumPnl.toFixed(2),
        drawdown: +dd.toFixed(2),
      });
      return { cumPnl, peak };
    }, { cumPnl: 0, peak: 0 });
    return result;
  }, [trades]);

  if (data.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-green-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Equity Curve</h3>
        </div>
        <p className="text-sm text-[#6b6b8a] text-center py-8">No trade data available</p>
      </GlassCard>
    );
  }

  const finalPnl = data[data.length - 1]?.pnl || 0;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-green-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Equity Curve</h3>
        </div>
        <span className={`text-xs font-medium ${finalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {finalPnl >= 0 ? '+' : ''}{finalPnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
        </span>
      </div>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={finalPnl >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                <stop offset="100%" stopColor={finalPnl >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#4a4a6a', fontSize: 10 }}
              tickLine={{ stroke: '#2a2a3a' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#4a4a6a', fontSize: 10 }}
              tickLine={{ stroke: '#2a2a3a' }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#11111a',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8,
                fontSize: 12,
                color: '#d4d4e8',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'P&L']}
            />
            <ReferenceLine y={0} stroke="#4a4a6a" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke={finalPnl >= 0 ? '#22c55e' : '#ef4444'}
              fill="url(#pnlGradient)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
