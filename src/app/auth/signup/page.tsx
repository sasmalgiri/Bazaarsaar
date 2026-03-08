'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signUp(email, password);
    if (result.error) {
      setError(result.error);
    } else if (result.session) {
      router.push('/dashboard');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="text-4xl mb-4">&#10004;&#65039;</div>
          <h1 className="text-2xl font-bold text-[#fafaff] mb-2">Account created</h1>
          <p className="text-sm text-[#6b6b8a] mb-6">
            Your account has been created successfully.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors no-underline"
          >
            Sign In
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
          className="w-full py-2.5 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-[#b0b0c8] text-sm font-medium hover:border-white/[0.15] transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.003 24.003 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
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
