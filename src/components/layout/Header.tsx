'use client';

import { useEffect, useState } from 'react';
import { getMarketStatus } from '@/lib/marketTime';
import { useAuth } from '@/lib/auth';
import { LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const [status, setStatus] = useState<string>('closed');
  const { user, signOut } = useAuth();

  useEffect(() => {
    setStatus(getMarketStatus());
    const interval = setInterval(() => setStatus(getMarketStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = status === 'open' ? 'bg-green-500' : status === 'pre-open' ? 'bg-yellow-500' : 'bg-red-500';
  const statusLabel = status === 'open' ? 'Market Open' : status === 'pre-open' ? 'Pre-Open' : status === 'post-close' ? 'Post Close' : 'Market Closed';

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0d0d14]/80 backdrop-blur-sm shrink-0">
      {/* Market Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColor} ${status === 'open' ? 'live-dot' : ''}`} />
          <span className="text-xs font-medium text-[#9090aa]">{statusLabel}</span>
        </div>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-[#4a4a6a] hidden lg:block max-w-[300px] truncate">
          Not investment advice. Subject to market risks.
        </span>
        {user ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#6b6b8a] hover:text-[#b0b0c8] hover:bg-white/[0.04] transition-colors border-none bg-transparent cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#6b6b8a] hover:text-[#b0b0c8] hover:bg-white/[0.04] transition-colors no-underline"
          >
            <LogIn size={14} />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
