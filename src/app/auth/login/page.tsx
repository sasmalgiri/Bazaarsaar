'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { GlassCard } from '@/components/ui/GlassCard';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authError = searchParams.get('error');
    if (authError === 'auth_failed') {
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#fafaff] mb-1">Welcome back</h1>
        <p className="text-sm text-[#6b6b8a]">Sign in to BazaarSaar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#6b6b8a] mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-[#d4d4e8] text-sm outline-none focus:border-green-500/50 transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-[#6b6b8a] mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-[#d4d4e8] text-sm outline-none focus:border-green-500/50 transition-colors"
            placeholder="Your password"
            required
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50 border-none cursor-pointer"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-[#4a4a6a]">or</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <button
        type="button"
        onClick={() => signInWithGoogle()}
        className="w-full py-2.5 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-[#b0b0c8] text-sm font-medium hover:border-white/[0.15] transition-colors cursor-pointer"
      >
        Continue with Google
      </button>

      <p className="text-center text-xs text-[#4a4a6a] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-green-500 hover:text-green-400 no-underline">
          Sign up
        </Link>
      </p>
    </GlassCard>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse rounded-2xl bg-[#11111a]" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
