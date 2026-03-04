'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-[#fafaff] mb-2">Something went wrong</h2>
        <p className="text-sm text-[#6b6b8a] mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors border-none cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
