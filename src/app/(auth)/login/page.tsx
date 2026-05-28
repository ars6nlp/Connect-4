'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login clicked, email:", email);
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log("Login success, session:", data.session?.user?.email);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Login Error:', err);
      alert('Login Error: ' + (err.message || 'Unknown error'));
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    router.push('/dashboard');
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-black tracking-tight mb-2">
          Sign in
        </h1>
        <p className="text-zinc-500 text-sm">
          Welcome back. Enter your credentials to continue.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium flex items-start gap-2">
          <span className="text-red-500 mt-0.5">⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition-all text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Password
            </label>
            <button type="button" className="text-xs text-zinc-400 hover:text-black transition-colors font-medium">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition-all pr-12 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors p-1"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <>Sign In <ArrowRight className="w-4 h-4" /></>
          }
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-zinc-100" />
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-zinc-100" />
      </div>

      <button
        onClick={handleGuest}
        className="w-full py-3 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-black font-bold rounded-xl transition-all active:scale-[0.98] text-sm"
      >
        Continue as Guest
      </button>

      <p className="text-center mt-8 text-zinc-400 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-black font-bold hover:underline transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
}
