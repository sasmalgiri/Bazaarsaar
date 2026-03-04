'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Download, Trash2, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function AccountSettings() {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/user/export');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bazaarsaar-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // silent fail
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/';
      }
    } catch {
      // silent fail
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <User size={18} className="text-[#9090aa]" />
        <h2 className="text-lg font-semibold text-[#d4d4e8]">Account</h2>
      </div>

      <p className="text-xs text-[#6b6b8a] mb-4">
        Signed in as <span className="font-mono text-[#d4d4e8]">{user?.email || '...'}</span>
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-[#d4d4e8] bg-white/[0.06] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-colors disabled:opacity-50"
        >
          <Download size={14} />
          {exporting ? 'Exporting...' : 'Export All Data (DPDP)'}
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-500 bg-red-500/10 border border-red-500/20 cursor-pointer hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500">Are you sure? This cannot be undone.</span>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-lg text-xs text-white bg-red-600 border-none cursor-pointer hover:bg-red-700 transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[#6b6b8a] bg-transparent border border-white/[0.08] cursor-pointer hover:bg-white/[0.04] transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
