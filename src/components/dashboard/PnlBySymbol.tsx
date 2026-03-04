'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PieChart as PieIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

interface Trade {
  symbol: string;
  net_pnl?: number;
  pnl?: number;
}

interface PnlBySymbolProps {
  trades: Trade[];
}

export function PnlBySymbol({ trades }: PnlBySymbolProps) {
  const data = useMemo(() => {
    const bySymbol: Record<string, { pnl: number; count: number }> = {};
    for (const t of trades) {
      const pnl = t.net_pnl || t.pnl || 0;
      if (!bySymbol[t.symbol]) bySymbol[t.symbol] = { pnl: 0, count: 0 };
      bySymbol[t.symbol].pnl += pnl;
      bySymbol[t.symbol].count++;
    }

    return Object.entries(bySymbol)
      .map(([symbol, { pnl, count }]) => ({
        symbol,
        pnl: +pnl.toFixed(2),
        count,
      }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 12);
  }, [trades]);

  if (data.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon size={18} className="text-purple-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">P&L by Symbol</h3>
        </div>
        <p className="text-sm text-[#6b6b8a] text-center py-8">No data available</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon size={18} className="text-purple-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">P&L by Symbol</h3>
      </div>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis
              dataKey="symbol"
              tick={{ fill: '#4a4a6a', fontSize: 10 }}
              tickLine={{ stroke: '#2a2a3a' }}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={50}
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
              formatter={(value: number) => [
                `₹${value.toLocaleString('en-IN')}`,
                'P&L',
              ]}
            />
            <ReferenceLine y={0} stroke="#4a4a6a" strokeDasharray="3 3" />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
