'use client';

import { useEffect, useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatINR } from '@/lib/marketTime';
import { LineChart, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface TradePriceChartProps {
  symbol: string;
  side: string;
  price: number;
  tradedAt: string;
}

interface ChartPoint {
  date: string;
  close: number;
}

export function TradePriceChart({ symbol, side, price, tradedAt }: TradePriceChartProps) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchChart() {
      try {
        const res = await fetch(`/api/datalab/stock-history?symbol=${encodeURIComponent(symbol)}&period=1m&interval=1d`);
        const json = await res.json();
        if (json.rows) {
          setData(json.rows.map((r: { date: string; close: number }) => ({ date: r.date, close: r.close })));
        } else {
          setError(json.error || 'No data');
        }
      } catch {
        setError('Failed to load chart');
      } finally {
        setLoading(false);
      }
    }
    fetchChart();
  }, [symbol]);

  const { minPrice, maxPrice, tradeX, tradeY, points, width, height } = useMemo(() => {
    const w = 600;
    const h = 200;
    const padding = 40;

    if (data.length < 2) return { minPrice: 0, maxPrice: 0, tradeX: 0, tradeY: 0, points: '', width: w, height: h };

    const closes = data.map((d) => d.close);
    const min = Math.min(...closes, price) * 0.998;
    const max = Math.max(...closes, price) * 1.002;
    const range = max - min || 1;

    const pts = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (w - padding * 2);
      const y = h - padding - ((d.close - min) / range) * (h - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    // Find where the trade date falls
    const tradeDate = tradedAt.split('T')[0];
    let tIdx = data.findIndex((d) => d.date === tradeDate);
    if (tIdx === -1) tIdx = Math.floor(data.length / 2);

    const tx = padding + (tIdx / (data.length - 1)) * (w - padding * 2);
    const ty = h - padding - ((price - min) / range) * (h - padding * 2);

    return { minPrice: min, maxPrice: max, tradeX: tx, tradeY: ty, points: pts, width: w, height: h };
  }, [data, price, tradedAt]);

  if (loading) {
    return (
      <GlassCard className="p-5">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-[#4a4a6a]" />
        </div>
      </GlassCard>
    );
  }

  if (error || data.length < 2) {
    return null;
  }

  const lastClose = data[data.length - 1]?.close || 0;
  const firstClose = data[0]?.close || 0;
  const trendUp = lastClose >= firstClose;

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <LineChart size={16} className="text-cyan-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">Price Chart — {symbol}</h3>
        <span className="text-[10px] text-[#4a4a6a] ml-auto">Last 30 days</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minWidth: 400 }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct) => {
            const y = 40 + pct * (height - 80);
            const priceVal = maxPrice - pct * (maxPrice - minPrice);
            return (
              <g key={pct}>
                <line x1={40} y1={y} x2={width - 40} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <text x={36} y={y + 3} textAnchor="end" fill="#4a4a6a" fontSize={9} fontFamily="monospace">
                  {formatINR(priceVal)}
                </text>
              </g>
            );
          })}

          {/* Price line */}
          <polyline
            fill="none"
            stroke={trendUp ? '#22c55e' : '#ef4444'}
            strokeWidth={2}
            points={points}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Area fill */}
          <polygon
            fill={trendUp ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}
            points={`${40},${height - 40} ${points} ${width - 40},${height - 40}`}
          />

          {/* Trade entry marker */}
          <circle
            cx={tradeX}
            cy={tradeY}
            r={6}
            fill={side === 'BUY' ? '#22c55e' : '#ef4444'}
            stroke="#0a0a0f"
            strokeWidth={2}
          />
          <line
            x1={tradeX}
            y1={tradeY + 8}
            x2={tradeX}
            y2={height - 40}
            stroke={side === 'BUY' ? '#22c55e' : '#ef4444'}
            strokeWidth={1}
            strokeDasharray="3,3"
            opacity={0.4}
          />

          {/* Trade label */}
          <rect
            x={tradeX - 35}
            y={tradeY - 24}
            width={70}
            height={18}
            rx={4}
            fill={side === 'BUY' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}
            stroke={side === 'BUY' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}
            strokeWidth={1}
          />
          <text
            x={tradeX}
            y={tradeY - 12}
            textAnchor="middle"
            fill={side === 'BUY' ? '#22c55e' : '#ef4444'}
            fontSize={9}
            fontWeight={600}
            fontFamily="monospace"
          >
            {side} @ {formatINR(price)}
          </text>

          {/* Date labels */}
          {data.filter((_, i) => i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)).map((d, i) => {
            const idx = i === 0 ? 0 : i === 1 ? Math.floor(data.length / 2) : data.length - 1;
            const x = 40 + (idx / (data.length - 1)) * (width - 80);
            return (
              <text key={d.date} x={x} y={height - 10} textAnchor="middle" fill="#4a4a6a" fontSize={9}>
                {new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${side === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-[10px] text-[#6b6b8a]">Your {side} entry</span>
        </div>
        <div className="flex items-center gap-1">
          {trendUp ? <TrendingUp size={10} className="text-green-500" /> : <TrendingDown size={10} className="text-red-500" />}
          <span className="text-[10px] text-[#4a4a6a]">
            {trendUp ? '+' : ''}{((lastClose - firstClose) / firstClose * 100).toFixed(1)}% in 30 days
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
