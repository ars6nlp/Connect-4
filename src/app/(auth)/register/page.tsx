'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    console.log("Button clicked");
    setLoading(true);
    setError(null);
    try {
      console.log("Calling supabase.auth.signUp with email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      
      if (error) throw error;
      
      // Auto-login successful or bypassed email confirmation
      router.push('/dashboard');
      router.refresh();
      
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(err.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full text-center">
        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-black mb-3">Check your inbox</h2>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
          We sent a confirmation link to<br />
          <strong className="text-black">{email}</strong>
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-all text-sm text-center"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-black tracking-tight mb-2">
          Create account
        </h1>
        <p className="text-zinc-500 text-sm">
          Join thousands of players. Free forever.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium flex items-start gap-2">
          <span className="text-red-500 mt-0.5">⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="CoolPlayer123"
            required
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition-all text-sm"
          />
        </div>

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
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
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
            : <>Create Account <ArrowRight className="w-4 h-4" /></>
          }
        </button>
      </form>

      <p className="text-center mt-8 text-zinc-400 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-black font-bold hover:underline transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
