'use client';

import { DataLabUI } from '@/components/datalab/DataLabUI';

export default function DataLabPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#fafaff] mb-1">DataLab</h1>
        <p className="text-sm text-[#6b6b8a]">
          Upload CSV data, apply transforms, and visualise patterns. All computation is local — no advice, no predictions.
        </p>
      </div>
      <DataLabUI />
    </div>
  );
}
