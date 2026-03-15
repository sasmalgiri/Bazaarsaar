'use client';

import { DataLabUI } from '@/components/datalab/DataLabUI';

export default function DataLabPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#fafaff] mb-1">DataLab</h1>
        <p className="text-sm text-[#6b6b8a]">
          Upload your trade data (Excel or CSV file from your broker), and see charts and patterns.
          Everything runs on your device — we don&apos;t give advice or predict anything.
        </p>
        <p className="text-[11px] text-amber-500/50 mt-1" lang="hi">
          अपने broker से trade data (Excel या CSV file) upload करें और charts व patterns देखें।
          सब कुछ आपके device पर चलता है — हम कोई सलाह या भविष्यवाणी नहीं देते।
        </p>
        <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-[11px] text-[#6b6b8a]">
            <strong className="text-[#d4d4e8]">What is a CSV file?</strong> It&apos;s a simple spreadsheet file. Your broker (Zerodha, Groww, Angel One) lets you download your trade history as a CSV. Just go to your broker app → trade history → download/export.
          </p>
          <p className="text-[10px] text-amber-500/40 mt-1" lang="hi">
            CSV एक spreadsheet file है। अपने broker app (Zerodha, Groww) में जाएं → trade history → download/export करें।
          </p>
        </div>
      </div>
      <DataLabUI />
    </div>
  );
}
