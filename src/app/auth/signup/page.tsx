'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { GlassCard } from '@/components/ui/GlassCard';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signUp(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="text-4xl mb-4">&#9993;&#65039;</div>
          <h1 className="text-2xl font-bold text-[#fafaff] mb-2">Check your email</h1>
          <p className="text-sm text-[#6b6b8a] mb-6">
            We sent a verification link to <span className="text-[#d4d4e8]">{email}</span>.
            Click the link to verify your account.
          </p>
          <Link
            href="/auth/login"
            className="text-sm text-green-500 hover:text-green-400 no-underline"
          >
            Back to Sign In
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#fafaff] mb-1">Create your account</h1>
          <p className="text-sm text-[#6b6b8a]">Join BazaarSaar for free</p>
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
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50 border-none cursor-pointer"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs text-[#4a4a6a]">or</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <button
          onClick={() => signInWithGoogle()}
          className="w-full py-2.5 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-[#b0b0c8] text-sm font-medium hover:border-white/[0.15] transition-colors cursor-pointer"
        >
          Continue with Google
        </button>

        <p className="text-center text-xs text-[#4a4a6a] mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-green-500 hover:text-green-400 no-underline">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
