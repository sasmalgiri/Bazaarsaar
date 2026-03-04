'use client';

import { useState, useCallback, useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { Upload, Play, Save, FlaskConical, Trash2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

/* ── Recipe definitions ── */
interface Recipe {
  id: string;
  label: string;
  description: string;
  fn: (rows: DataRow[]) => DataRow[];
}

interface DataRow {
  date: string;
  close: number;
  [key: string]: string | number;
}

function ema(values: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) {
    result.push(values[i] * k + result[i - 1] * (1 - k));
  }
  return result;
}

function rsi(values: number[], period = 14): number[] {
  const result: number[] = new Array(values.length).fill(0);
  let gainSum = 0;
  let lossSum = 0;

  for (let i = 1; i <= period && i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff > 0) gainSum += diff;
    else lossSum += Math.abs(diff);
  }

  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  for (let i = period; i < values.length; i++) {
    if (i > period) {
      const diff = values[i] - values[i - 1];
      avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
      avgLoss = (avgLoss * (period - 1) + (diff < 0 ? Math.abs(diff) : 0)) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result[i] = 100 - 100 / (1 + rs);
  }
  return result;
}

const RECIPES: Recipe[] = [
  {
    id: 'rebase',
    label: 'Rebase to 100',
    description: 'Normalise the series so it starts at 100',
    fn: (rows) => {
      const base = rows[0]?.close || 1;
      return rows.map((r) => ({ ...r, rebased: +(r.close / base * 100).toFixed(2) }));
    },
  },
  {
    id: 'ema20',
    label: 'EMA-20',
    description: 'Add 20-period exponential moving average',
    fn: (rows) => {
      const closes = rows.map((r) => r.close);
      const emaVals = ema(closes, 20);
      return rows.map((r, i) => ({ ...r, ema20: +emaVals[i].toFixed(2) }));
    },
  },
  {
    id: 'rsi14',
    label: 'RSI-14',
    description: 'Add 14-period relative strength index',
    fn: (rows) => {
      const closes = rows.map((r) => r.close);
      const rsiVals = rsi(closes, 14);
      return rows.map((r, i) => ({ ...r, rsi14: +rsiVals[i].toFixed(2) }));
    },
  },
  {
    id: 'drawdown',
    label: 'Drawdown %',
    description: 'Peak-to-trough drawdown percentage',
    fn: (rows) => {
      let peak = -Infinity;
      return rows.map((r) => {
        if (r.close > peak) peak = r.close;
        const dd = ((r.close - peak) / peak) * 100;
        return { ...r, drawdown: +dd.toFixed(2) };
      });
    },
  },
  {
    id: 'rolling_vol',
    label: 'Rolling Volatility (20d)',
    description: '20-day rolling standard deviation of daily returns',
    fn: (rows) => {
      const returns: number[] = [0];
      for (let i = 1; i < rows.length; i++) {
        returns.push((rows[i].close - rows[i - 1].close) / rows[i - 1].close);
      }
      return rows.map((r, i) => {
        if (i < 20) return { ...r, vol20: 0 };
        const slice = returns.slice(i - 19, i + 1);
        const mean = slice.reduce((s, v) => s + v, 0) / slice.length;
        const variance = slice.reduce((s, v) => s + (v - mean) ** 2, 0) / slice.length;
        return { ...r, vol20: +(Math.sqrt(variance) * 100).toFixed(4) };
      });
    },
  },
];

const LINE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];

export function DataLabUI() {
  const [rawData, setRawData] = useState<DataRow[]>([]);
  const [activeRecipes, setActiveRecipes] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.trim().split('\n');
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const dateIdx = headers.findIndex((h) => ['date', 'timestamp', 'time'].includes(h));
      const closeIdx = headers.findIndex((h) => ['close', 'price', 'last', 'ltp'].includes(h));

      if (dateIdx === -1 || closeIdx === -1) {
        alert('CSV must have a "date" and "close" (or "price"/"ltp") column.');
        return;
      }

      const parsed: DataRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        const close = parseFloat(cols[closeIdx]);
        if (isNaN(close)) continue;
        const row: DataRow = { date: cols[dateIdx], close };
        // add any extra numeric columns
        headers.forEach((h, idx) => {
          if (idx === dateIdx || idx === closeIdx) return;
          const val = parseFloat(cols[idx]);
          if (!isNaN(val)) row[h] = val;
        });
        parsed.push(row);
      }
      setRawData(parsed);
      setActiveRecipes([]);
    };
    reader.readAsText(file);
  }, []);

  const processedData = useMemo(() => {
    let data = [...rawData];
    for (const id of activeRecipes) {
      const recipe = RECIPES.find((r) => r.id === id);
      if (recipe) data = recipe.fn(data);
    }
    return data;
  }, [rawData, activeRecipes]);

  const chartKeys = useMemo(() => {
    if (processedData.length === 0) return [];
    const sample = processedData[0];
    return Object.keys(sample).filter((k) => k !== 'date' && typeof sample[k] === 'number');
  }, [processedData]);

  const toggleRecipe = (id: string) => {
    setActiveRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSaveExperiment = async () => {
    if (processedData.length === 0) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    await supabase.from('datalab_experiment').insert({
      user_id: user.id,
      title: fileName || 'Untitled',
      source_file: fileName,
      recipe_ids: activeRecipes,
      row_count: processedData.length,
      snapshot: processedData.slice(0, 50), // store first 50 rows as preview
    });

    setSaving(false);
    setSavedMsg('Experiment saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={18} className="text-amber-500" />
          <h2 className="text-lg font-semibold text-[#d4d4e8]">Data Source</h2>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.08] rounded-xl p-8 cursor-pointer hover:border-green-500/30 transition-colors">
          <Upload size={28} className="text-[#4a4a6a] mb-2" />
          <span className="text-sm text-[#6b6b8a]">
            {fileName || 'Drop a CSV file or click to upload'}
          </span>
          <span className="text-[10px] text-[#4a4a6a] mt-1">
            Must contain &quot;date&quot; and &quot;close&quot; columns
          </span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>

        {rawData.length > 0 && (
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-[#6b6b8a]">
              {rawData.length} rows loaded
            </span>
            <button
              onClick={() => { setRawData([]); setFileName(''); setActiveRecipes([]); }}
              className="flex items-center gap-1 text-xs text-red-500/70 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        )}
      </GlassCard>

      {/* Recipes */}
      {rawData.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Play size={18} className="text-green-500" />
            <h2 className="text-lg font-semibold text-[#d4d4e8]">Recipes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RECIPES.map((recipe) => {
              const active = activeRecipes.includes(recipe.id);
              return (
                <button
                  key={recipe.id}
                  onClick={() => toggleRecipe(recipe.id)}
                  className={`text-left p-3 rounded-lg border cursor-pointer transition-all ${
                    active
                      ? 'border-green-500/40 bg-green-500/10'
                      : 'border-white/[0.06] bg-[#11111a] hover:bg-white/[0.04]'
                  }`}
                >
                  <p className={`text-sm font-medium ${active ? 'text-green-500' : 'text-[#d4d4e8]'}`}>
                    {recipe.label}
                  </p>
                  <p className="text-[10px] text-[#4a4a6a] mt-0.5">{recipe.description}</p>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Chart */}
      {processedData.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#d4d4e8]">Chart</h2>
            <div className="flex items-center gap-3">
              {savedMsg && <span className="text-xs text-green-500">{savedMsg}</span>}
              <button
                onClick={handleSaveExperiment}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent cursor-pointer hover:bg-green-500/10 transition-all disabled:opacity-50"
              >
                <Save size={12} />
                {saving ? 'Saving...' : 'Save Experiment'}
              </button>
            </div>
          </div>

          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#11111a',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#d4d4e8',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#6b6b8a' }} />
                {chartKeys.map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={LINE_COLORS[i % LINE_COLORS.length]}
                    dot={false}
                    strokeWidth={key === 'close' ? 2 : 1.5}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      <SEBIDisclaimer type="journal" />
    </div>
  );
}
