'use client';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-[#fafaff] mb-2">Dashboard Error</h2>
        <p className="text-sm text-[#6b6b8a] mb-6">{error.message || 'Failed to load dashboard data.'}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors border-none cursor-pointer"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
