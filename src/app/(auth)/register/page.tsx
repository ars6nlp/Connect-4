'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="w-full text-center">
        <div className="bg-white/5 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-10 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
          <h2 className="text-2xl font-black text-white mb-3">Check your email!</h2>
          <p className="text-slate-400 mb-8">We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account.</p>
          <Link href="/login" className="inline-block w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 shadow-[0_4px_20px_rgba(225,29,72,0.5)] border border-red-400/30 flex items-center justify-center text-white font-black text-2xl">4</div>
        <span className="text-3xl font-black text-white tracking-tight">Connect</span>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
        <h1 className="text-2xl font-black text-white mb-1">Create account</h1>
        <p className="text-slate-400 text-sm mb-8">Join thousands of players worldwide</p>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-rose-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="CoolPlayer123"
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-all pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors p-1">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl transition-all shadow-[0_0_24px_rgba(79,70,229,0.4)] hover:shadow-[0_0_32px_rgba(79,70,229,0.6)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="text-center mt-6 text-slate-500 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
