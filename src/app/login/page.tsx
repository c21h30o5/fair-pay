'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Message = {
  text: string;
  type: 'success' | 'error';
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  // Redirect if user is already signed in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace('/');
      }
    };

    void checkUser();
  }, [router, supabase]);

  // Sign In
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      setMessage({
        text: 'Sign in successful! Redirecting...',
        type: 'success',
      });

      setTimeout(() => {
        router.replace('/badminton');
        router.refresh();
      }, 1000);
    } catch {
      setMessage({
        text: 'Invalid email or password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-md animate-fade-in-up">
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-3xl font-extrabold text-blue-600">
            Fair Pay ⚖️
          </h1>
          <p className="text-sm text-slate-500">
            Sign in or create an account to start splitting bills
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-xl border p-4 text-sm font-medium ${
              message.type === 'success'
                ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                : 'border-rose-100 bg-rose-50 text-rose-700'
            }`}
          >
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={loading}
              className="w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-md shadow-blue-200 transition-all duration-150 hover:bg-blue-700 active:scale-[0.97] disabled:bg-slate-300"
            >
              {loading ? 'Please wait...' : 'Sign In 🔑'}
            </button>

          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}