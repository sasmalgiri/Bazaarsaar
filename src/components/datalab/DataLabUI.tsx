'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { Upload, Play, Save, FlaskConical, Trash2, Search, BarChart3, FolderOpen, Pencil, Clock } from 'lucide-react';
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

type DataSource = 'stock' | 'trades' | 'csv';

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

const POPULAR_STOCKS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
  'SBIN', 'BHARTIARTL', 'ITC', 'TATAMOTORS', 'LT',
];

const PERIOD_OPTIONS = [
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
  { value: '2y', label: '2Y' },
  { value: '5y', label: '5Y' },
];

interface SavedExperiment {
  id: string;
  title: string;
  inputs: { source: string; rows: DataRow[] };
  params: { recipes: string[] };
  created_at: string;
}

export function DataLabUI() {
  const [rawData, setRawData] = useState<DataRow[]>([]);
  const [activeRecipes, setActiveRecipes] = useState<string[]>([]);
  const [sourceLabel, setSourceLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [activeTab, setActiveTab] = useState<DataSource>('stock');

  // Stock lookup state
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockPeriod, setStockPeriod] = useState('1y');
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState('');

  // Saved experiments state
  const [experiments, setExperiments] = useState<SavedExperiment[]>([]);
  const [experimentsLoading, setExperimentsLoading] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Trades state
  const [tradesLoading, setTradesLoading] = useState(false);
  const [tradesError, setTradesError] = useState('');

  const loadData = useCallback((rows: DataRow[], label: string) => {
    setRawData(rows);
    setSourceLabel(label);
    setActiveRecipes([]);
    setStockError('');
    setTradesError('');
  }, []);

  const clearData = useCallback(() => {
    setRawData([]);
    setSourceLabel('');
    setActiveRecipes([]);
  }, []);

  /* ── Stock Lookup ── */
  const handleStockFetch = useCallback(async (symbol?: string) => {
    const sym = (symbol || stockSymbol).trim().toUpperCase();
    if (!sym) return;
    setStockSymbol(sym);
    setStockLoading(true);
    setStockError('');

    try {
      const res = await fetch(
        `/api/datalab/stock-history?symbol=${encodeURIComponent(sym)}&period=${stockPeriod}&interval=1d`
      );
      const data = await res.json();

      if (!res.ok) {
        setStockError(data.error || 'Failed to fetch data');
        setStockLoading(false);
        return;
      }

      const rows: DataRow[] = data.rows.map((r: { date: string; open: number; high: number; low: number; close: number; volume: number }) => ({
        date: r.date,
        close: r.close,
        open: r.open,
        high: r.high,
        low: r.low,
        volume: r.volume,
      }));

      loadData(rows, `${data.symbol} (${stockPeriod})`);
    } catch {
      setStockError('Network error. Please try again.');
    } finally {
      setStockLoading(false);
    }
  }, [stockSymbol, stockPeriod, loadData]);

  /* ── Your Trades ── */
  const handleLoadTrades = useCallback(async () => {
    setTradesLoading(true);
    setTradesError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTradesError('Please sign in to load trades.');
        setTradesLoading(false);
        return;
      }

      const { data: trades, error } = await supabase
        .from('trade')
        .select('traded_at, exit_price, entry_price, net_pnl, pnl, symbol')
        .eq('user_id', user.id)
        .order('traded_at', { ascending: true });

      if (error) {
        setTradesError(error.message);
        setTradesLoading(false);
        return;
      }

      if (!trades || trades.length === 0) {
        setTradesError('No trades found. Sync your broker or import a CSV first.');
        setTradesLoading(false);
        return;
      }

      // Build cumulative P&L curve
      let cumPnl = 0;
      const rows: DataRow[] = trades.map((t: { traded_at?: string; exit_price?: number; entry_price?: number; net_pnl?: number; pnl?: number; symbol?: string }) => {
        const pnl = t.net_pnl || t.pnl || 0;
        cumPnl += pnl;
        return {
          date: (t.traded_at || '').split('T')[0],
          close: +cumPnl.toFixed(2),
          pnl: +pnl.toFixed(2),
          symbol: t.symbol || '',
        };
      });

      loadData(rows, `Your Trades (${trades.length} trades)`);
    } catch {
      setTradesError('Failed to load trades.');
    } finally {
      setTradesLoading(false);
    }
  }, [loadData]);

  /* ── CSV Upload ── */
  const handleFile = useCallback((file: File) => {
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
        headers.forEach((h, idx) => {
          if (idx === dateIdx || idx === closeIdx) return;
          const val = parseFloat(cols[idx]);
          if (!isNaN(val)) row[h] = val;
        });
        parsed.push(row);
      }
      loadData(parsed, file.name);
    };
    reader.readAsText(file);
  }, [loadData]);

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
    return Object.keys(sample).filter((k) =>
      k !== 'date' && k !== 'symbol' && typeof sample[k] === 'number'
    );
  }, [processedData]);

  const toggleRecipe = (id: string) => {
    setActiveRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  /* ── Saved Experiments CRUD ── */
  const fetchExperiments = useCallback(async () => {
    setExperimentsLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setExperimentsLoading(false); return; }

    const { data } = await supabase
      .from('datalab_experiment')
      .select('id, title, inputs, params, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    setExperiments((data as SavedExperiment[]) || []);
    setExperimentsLoading(false);
  }, []);

  useEffect(() => { fetchExperiments(); }, [fetchExperiments]);

  const handleSaveExperiment = async () => {
    if (rawData.length === 0) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    await supabase.from('datalab_experiment').insert({
      user_id: user.id,
      title: sourceLabel || 'Untitled',
      inputs: { source: sourceLabel, rows: rawData.slice(0, 200) },
      params: { recipes: activeRecipes },
    });

    setSaving(false);
    setSavedMsg('Experiment saved!');
    setTimeout(() => setSavedMsg(''), 2000);
    fetchExperiments();
  };

  const handleLoadExperiment = (exp: SavedExperiment) => {
    const rows = exp.inputs?.rows || [];
    if (rows.length > 0) {
      setRawData(rows);
      setSourceLabel(exp.title);
      setActiveRecipes(exp.params?.recipes || []);
    }
  };

  const handleRenameExperiment = async (id: string) => {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    const supabase = createClient();
    await supabase.from('datalab_experiment').update({ title: renameValue.trim() }).eq('id', id);
    setRenamingId(null);
    fetchExperiments();
  };

  const handleDeleteExperiment = async (id: string) => {
    const supabase = createClient();
    await supabase.from('datalab_experiment').delete().eq('id', id);
    setExperiments((prev) => prev.filter((e) => e.id !== id));
  };

  const tabs: { id: DataSource; label: string; icon: typeof Search }[] = [
    { id: 'stock', label: 'Stock Lookup', icon: Search },
    { id: 'trades', label: 'Your Trades', icon: BarChart3 },
    { id: 'csv', label: 'CSV Upload', icon: Upload },
  ];

  return (
    <div className="space-y-6">
      {/* Data Source */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={18} className="text-amber-500" />
          <h2 className="text-lg font-semibold text-[#d4d4e8]">Data Source</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-[#0d0d14] mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 flex-1 px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-all border-none ${
                activeTab === tab.id
                  ? 'bg-green-500/15 text-green-500'
                  : 'bg-transparent text-[#6b6b8a] hover:text-[#b0b0c8]'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stock Lookup */}
        {activeTab === 'stock' && (
          <div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === 'Enter') handleStockFetch(); }}
                placeholder="NSE symbol (e.g. RELIANCE, TCS, SBIN)"
                aria-label="Stock symbol"
                className="flex-1 px-3 py-2 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-sm text-[#d4d4e8] outline-none focus:border-green-500/50 transition-colors placeholder:text-[#4a4a6a]"
              />
              <select
                value={stockPeriod}
                onChange={(e) => setStockPeriod(e.target.value)}
                aria-label="Time period"
                className="px-3 py-2 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-sm text-[#d4d4e8] outline-none cursor-pointer"
              >
                {PERIOD_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <button
                onClick={() => handleStockFetch()}
                disabled={stockLoading || !stockSymbol.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stockLoading ? 'Loading...' : 'Fetch'}
              </button>
            </div>

            {/* Quick picks */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_STOCKS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStockFetch(s)}
                  disabled={stockLoading}
                  className="px-2.5 py-1 rounded text-[11px] text-[#6b6b8a] bg-white/[0.04] border border-white/[0.06] cursor-pointer hover:bg-white/[0.08] hover:text-[#b0b0c8] transition-all disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-[#4a4a6a]">
              Historical data from Yahoo Finance. NSE suffix (.NS) added automatically.
            </p>

            {stockError && (
              <p className="text-xs text-red-500 mt-2">{stockError}</p>
            )}
          </div>
        )}

        {/* Your Trades */}
        {activeTab === 'trades' && (
          <div>
            <p className="text-sm text-[#6b6b8a] mb-3">
              Load your trade history and visualise cumulative P&L over time.
            </p>
            <button
              onClick={handleLoadTrades}
              disabled={tradesLoading}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tradesLoading ? 'Loading trades...' : 'Load My Trades'}
            </button>

            {tradesError && (
              <p className="text-xs text-red-500 mt-2">{tradesError}</p>
            )}
          </div>
        )}

        {/* CSV Upload */}
        {activeTab === 'csv' && (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.08] rounded-xl p-8 cursor-pointer hover:border-green-500/30 transition-colors">
            <Upload size={28} className="text-[#4a4a6a] mb-2" />
            <span className="text-sm text-[#6b6b8a]">
              Drop a CSV file or click to upload
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
        )}

        {/* Data loaded indicator */}
        {rawData.length > 0 && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06]">
            <span className="text-xs text-green-500 font-medium">
              {sourceLabel}
            </span>
            <span className="text-xs text-[#6b6b8a]">
              {rawData.length} rows
            </span>
            <button
              onClick={clearData}
              className="flex items-center gap-1 text-xs text-red-500/70 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors ml-auto"
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

      {/* Saved Experiments */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen size={18} className="text-blue-500" />
          <h2 className="text-lg font-semibold text-[#d4d4e8]">Saved Experiments</h2>
          <span className="text-xs text-[#4a4a6a] ml-auto">{experiments.length} saved</span>
        </div>

        {experimentsLoading ? (
          <p className="text-sm text-[#6b6b8a] text-center py-6">Loading experiments...</p>
        ) : experiments.length === 0 ? (
          <p className="text-sm text-[#6b6b8a] text-center py-6">
            No saved experiments yet. Load data, apply recipes, and save to build your library.
          </p>
        ) : (
          <div className="space-y-2">
            {experiments.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#11111a] border border-white/[0.06] hover:border-white/[0.1] transition-colors group"
              >
                {renamingId === exp.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameExperiment(exp.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    onBlur={() => handleRenameExperiment(exp.id)}
                    autoFocus
                    aria-label="Rename experiment"
                    className="flex-1 px-2 py-1 rounded bg-[#1a1a24] border border-green-500/30 text-sm text-[#d4d4e8] outline-none"
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#d4d4e8] truncate">{exp.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={10} className="text-[#4a4a6a]" />
                      <span className="text-[10px] text-[#4a4a6a]">
                        {new Date(exp.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                      {exp.params?.recipes?.length > 0 && (
                        <span className="text-[10px] text-[#4a4a6a]">
                          {exp.params.recipes.length} recipe{exp.params.recipes.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {exp.inputs?.rows && (
                        <span className="text-[10px] text-[#4a4a6a]">
                          {exp.inputs.rows.length} rows
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleLoadExperiment(exp)}
                    className="px-2.5 py-1 rounded text-[11px] text-green-500 bg-green-500/10 border border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors"
                    title="Load experiment"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRenamingId(exp.id); setRenameValue(exp.title); }}
                    className="p-1.5 rounded text-[#6b6b8a] bg-transparent border-none cursor-pointer hover:text-[#b0b0c8] hover:bg-white/[0.06] transition-colors"
                    title="Rename"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExperiment(exp.id)}
                    className="p-1.5 rounded text-red-500/60 bg-transparent border-none cursor-pointer hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <SEBIDisclaimer type="journal" />
    </div>
  );
}
