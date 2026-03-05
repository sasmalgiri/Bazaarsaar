'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { BookOpen, Search, Download, FileSpreadsheet, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { generateTradeExcel, generateTradeCSV } from '@/lib/tradeExport';
import Link from 'next/link';
import type { Trade, TradeSide } from '@/types';

export function TradesList() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [journalStatus, setJournalStatus] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);

  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [sideFilter, setSideFilter] = useState<TradeSide | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [journalFilter, setJournalFilter] = useState<'all' | 'done' | 'missing'>('all');
  const [sortField, setSortField] = useState<'traded_at' | 'symbol' | 'price' | 'quantity'>('traded_at');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    async function fetchTrades() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('trade')
        .select('*')
        .eq('user_id', user.id)
        .order('traded_at', { ascending: false })
        .limit(100);

      if (data) {
        setTrades(data as unknown as Trade[]);

        // Check journal status for each trade
        const { data: journals } = await supabase
          .from('journal_entry')
          .select('trade_id')
          .eq('user_id', user.id)
          .in('trade_id', data.map((t: { id: string }) => t.id));

        const statusMap: Record<string, boolean> = {};
        journals?.forEach((j: { trade_id: string }) => { statusMap[j.trade_id] = true; });
        setJournalStatus(statusMap);
      }
      setLoading(false);
    }
    fetchTrades();
  }, []);

  const filtered = trades
    .filter((t) => {
      if (filter && !t.symbol.toLowerCase().includes(filter.toLowerCase())) return false;
      if (sideFilter && t.side !== sideFilter) return false;
      if (dateFrom && t.traded_at < dateFrom) return false;
      if (dateTo && t.traded_at > dateTo + 'T23:59:59') return false;
      if (journalFilter === 'done' && !journalStatus[t.id]) return false;
      if (journalFilter === 'missing' && journalStatus[t.id]) return false;
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortAsc ? cmp : -cmp;
    });

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-[#6b6b8a]">Loading trades...</p>
      </GlassCard>
    );
  }

  if (trades.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-[#6b6b8a] mb-3">No trades found</p>
        <p className="text-xs text-[#4a4a6a] mb-4">
          Connect your broker or import a CSV from Settings to see trades here.
        </p>
        <Link
          href="/settings"
          className="px-4 py-2 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent hover:bg-green-500/10 transition-all no-underline"
        >
          Go to Settings
        </Link>
      </GlassCard>
    );
  }

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const buffer = await generateTradeExcel(trades);
      const blob = new Blob([buffer.buffer as ArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bazaarsaar-trades-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    const csv = generateTradeCSV(trades);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bazaarsaar-trades-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a6a]" />
          <input
            type="text"
            placeholder="Filter by symbol..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
          />
        </div>

        <button
          type="button"
          onClick={handleExportExcel}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs text-[#d4d4e8] bg-white/[0.06] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <FileSpreadsheet size={14} />
          {exporting ? 'Exporting...' : 'Excel'}
        </button>
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs text-[#d4d4e8] bg-white/[0.06] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-colors whitespace-nowrap"
        >
          <Download size={14} />
          CSV
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs border cursor-pointer transition-colors whitespace-nowrap ${
            showFilters ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-[#d4d4e8] bg-white/[0.06] border-white/[0.08] hover:bg-white/[0.1]'
          }`}
        >
          <Filter size={14} />
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <GlassCard className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-[10px] text-[#6b6b8a] uppercase mb-1">Side</label>
              <select
                value={sideFilter}
                onChange={(e) => setSideFilter(e.target.value as TradeSide | '')}
                aria-label="Filter by side"
                className="px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-xs text-[#d4d4e8] outline-none cursor-pointer"
              >
                <option value="">All</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-[#6b6b8a] uppercase mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                title="Filter from date"
                className="px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-xs text-[#d4d4e8] outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#6b6b8a] uppercase mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                title="Filter to date"
                className="px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-xs text-[#d4d4e8] outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#6b6b8a] uppercase mb-1">Journal</label>
              <select
                value={journalFilter}
                onChange={(e) => setJournalFilter(e.target.value as 'all' | 'done' | 'missing')}
                aria-label="Filter by journal status"
                className="px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-xs text-[#d4d4e8] outline-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="done">Done</option>
                <option value="missing">Missing</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => { setSideFilter(''); setDateFrom(''); setDateTo(''); setJournalFilter('all'); setFilter(''); }}
              className="px-3 py-2 rounded-lg text-xs text-[#6b6b8a] bg-transparent border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors"
            >
              Clear
            </button>
          </div>
          <p className="text-[10px] text-[#4a4a6a] mt-2">{filtered.length} of {trades.length} trades</p>
        </GlassCard>
      )}

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {([
                  { key: 'symbol', label: 'Symbol', align: 'text-left' },
                  { key: '', label: 'Side', align: 'text-left' },
                  { key: 'quantity', label: 'Qty', align: 'text-right' },
                  { key: 'price', label: 'Price', align: 'text-right' },
                  { key: 'traded_at', label: 'Date', align: 'text-left' },
                  { key: '', label: 'Journal', align: 'text-center' },
                ] as const).map((col) => (
                  <th
                    key={col.label}
                    className={`${col.align} px-4 py-3 text-xs font-semibold text-[#6b6b8a] uppercase ${col.key ? 'cursor-pointer hover:text-[#b0b0c8] select-none' : ''}`}
                    onClick={() => {
                      if (!col.key) return;
                      const field = col.key as typeof sortField;
                      if (sortField === field) setSortAsc(!sortAsc);
                      else { setSortField(field); setSortAsc(true); }
                    }}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.key && sortField === col.key && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((trade) => (
                <tr key={trade.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-[#d4d4e8]">{trade.symbol}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      trade.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[#b0b0c8]">{trade.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono text-[#b0b0c8]">{Number(trade.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-[#6b6b8a]">
                    {new Date(trade.traded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/trades/${trade.id}`}
                      className="no-underline"
                    >
                      {journalStatus[trade.id] ? (
                        <span className="text-xs text-green-500 flex items-center justify-center gap-1">
                          <BookOpen size={12} /> Done
                        </span>
                      ) : (
                        <span className="text-xs text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          Missing
                        </span>
                      )}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <SEBIDisclaimer type="journal" />
    </div>
  );
}
