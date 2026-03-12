'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Link2, RefreshCw, Upload, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { CSVImportModal } from './CSVImportModal';

type ConnectionInfo = {
  connected: boolean;
  status: 'active' | 'expired' | 'disconnected' | 'revoked' | 'error';
  expires_at?: string;
  last_sync_at?: string;
};

const STATUS_CONFIG = {
  active: { label: 'Connected', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20', Icon: CheckCircle2 },
  expired: { label: 'Token Expired', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', Icon: Clock },
  disconnected: { label: 'Not Connected', color: 'text-[#6b6b8a]', bg: 'bg-white/[0.04] border-white/[0.08]', Icon: XCircle },
  revoked: { label: 'Revoked', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', Icon: XCircle },
  error: { label: 'Error', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', Icon: XCircle },
} as const;

export function BrokerSettings() {
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [connInfo, setConnInfo] = useState<ConnectionInfo | null>(null);

  useEffect(() => {
    fetch('/api/broker/status')
      .then(r => r.json())
      .then(data => { if (data.status) setConnInfo(data); })
      .catch(() => {});
  }, []);

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
        setConnInfo(prev => prev ? { ...prev, last_sync_at: new Date().toISOString() } : prev);
      } else {
        setMessage({ type: 'error', text: data.error || 'Sync failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Sync failed. Please try again.' });
    } finally {
      setSyncing(false);
    }
  };

  const statusKey = connInfo?.status ?? 'disconnected';
  const { label, color, bg, Icon } = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.disconnected;

  return (
    <>
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-green-500" />
            <h2 className="text-lg font-semibold text-[#d4d4e8]">Broker Connection</h2>
          </div>
          {connInfo && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${bg} ${color}`}>
              <Icon size={12} />
              {label}
            </div>
          )}
        </div>

        {connInfo?.status === 'active' && connInfo.expires_at && (
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15 mb-4">
            <p className="text-xs text-green-500/80">
              Token valid until {new Date(connInfo.expires_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              {connInfo.last_sync_at && (
                <span className="text-[#6b6b8a] ml-2">
                  &middot; Last synced {new Date(connInfo.last_sync_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
              )}
            </p>
          </div>
        )}

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
            {connecting ? 'Connecting...' : connInfo?.status === 'active' ? 'Reconnect Zerodha' : 'Connect Zerodha'}
          </button>

          <button
            onClick={handleSync}
            disabled={syncing || statusKey !== 'active'}
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
