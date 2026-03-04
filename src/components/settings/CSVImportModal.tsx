'use client';

import { useState, useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Upload, X, FileText } from 'lucide-react';

interface CSVImportModalProps {
  onClose: () => void;
}

export function CSVImportModal({ onClose }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/import/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResult({ imported: data.imported, skipped: data.skipped, total: data.total });
      } else {
        setError(data.error || 'Import failed');
      }
    } catch {
      setError('Import failed. Please check your file format.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard className="w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b6b8a] hover:text-[#d4d4e8] bg-transparent border-none cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Upload size={18} className="text-green-500" />
          <h2 className="text-lg font-semibold text-[#d4d4e8]">Import Trades from CSV</h2>
        </div>

        <p className="text-xs text-[#6b6b8a] mb-4">
          Upload a CSV file exported from Zerodha Console or your broker.
          Expected columns: symbol, exchange, side (BUY/SELL), quantity, price, traded_at.
        </p>

        {!result ? (
          <>
            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center cursor-pointer hover:border-green-500/30 transition-colors mb-4"
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText size={18} className="text-green-500" />
                  <span className="text-sm text-[#d4d4e8]">{file.name}</span>
                  <span className="text-xs text-[#6b6b8a]">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <>
                  <Upload size={24} className="mx-auto text-[#4a4a6a] mb-2" />
                  <p className="text-sm text-[#6b6b8a]">Click to select a CSV file</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg mb-4 text-xs bg-red-500/10 text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-[#6b6b8a] bg-transparent border border-white/[0.08] cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Importing...' : 'Import'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">&#9989;</div>
            <p className="text-sm text-[#d4d4e8] mb-1">Import complete!</p>
            <p className="text-xs text-[#6b6b8a] mb-4">
              {result.imported} trades imported, {result.skipped} skipped out of {result.total} total rows.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
