'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Link2, RefreshCw, Upload, AlertTriangle } from 'lucide-react';
import { CSVImportModal } from './CSVImportModal';

export function BrokerSettings() {
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleConnect = async () => {
    setConnecting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/broker/auth-url');
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to generate auth URL' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to connect. Please try again.' });
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch('/api/broker/sync', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: `Synced ${data.imported} trades (${data.skipped} skipped)` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Sync failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Sync failed. Please try again.' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Link2 size={18} className="text-green-500" />
          <h2 className="text-lg font-semibold text-[#d4d4e8]">Broker Connection</h2>
        </div>

        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-500/90">
              Zerodha tokens expire daily at 6:00 AM IST. You will need to reconnect each morning to sync new trades.
            </p>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-4 text-xs ${
            message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Link2 size={14} />
            {connecting ? 'Connecting...' : 'Connect Zerodha'}
          </button>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#d4d4e8] bg-white/[0.06] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Trades'}
          </button>

          <button
            onClick={() => setShowCSV(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#d4d4e8] bg-white/[0.06] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-colors"
          >
            <Upload size={14} />
            Import CSV
          </button>
        </div>
      </GlassCard>

      {showCSV && <CSVImportModal onClose={() => setShowCSV(false)} />}
    </>
  );
}
