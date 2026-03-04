'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function ZerodhaCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const requestToken = searchParams.get('request_token');
    const state = searchParams.get('status') === 'success' ? searchParams.get('state') : null;

    if (!requestToken || !state) {
      setError('Invalid callback. Please try connecting again.');
      return;
    }

    async function exchangeToken() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Please sign in first');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/zerodha_exchange_token`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ request_token: requestToken, state }),
        });

        const data = await res.json();
        if (data.success) {
          router.replace('/settings?connected=true');
        } else {
          setError(data.error || 'Token exchange failed');
        }
      } catch {
        setError('Failed to connect. Please try again.');
      }
    }

    exchangeToken();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => router.push('/settings')}
            className="px-4 py-2 rounded-lg text-sm text-green-500 border border-green-500/20 bg-transparent cursor-pointer hover:bg-green-500/10 transition-all"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-sm text-[#6b6b8a] mt-4">Connecting Zerodha...</p>
      </div>
    </div>
  );
}

export default function ZerodhaCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <LoadingSpinner />
      </div>
    }>
      <ZerodhaCallbackInner />
    </Suspense>
  );
}
