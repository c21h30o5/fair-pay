'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { FormErrors } from '@/types/auth';

type Message = {
  text: string;
  type: 'success' | 'error';
};

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (!name.trim()) {
      errs.name = 'Name is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.session) {
        setMessage({
          text: 'Registration successful! Redirecting...',
          type: 'success',
        });

        setTimeout(() => {
          router.replace('/badminton');
          router.refresh();
        }, 1000);
      } else {
        setMessage({
          text:
            'Registration successful! Please check your email inbox to confirm your account.',
          type: 'success',
        });
      }
    } catch {
      setMessage({
        text: 'Registration failed. Please try again.',
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
            Create your account to start splitting bills
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

        <form className="space-y-4" onSubmit={handleSignUp} noValidate>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="John Doe"
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="your.email@example.com"
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="••••••••"
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-md shadow-blue-200 transition-all duration-150 hover:bg-blue-700 active:scale-[0.97] disabled:bg-slate-300"
            >
              {loading ? 'Please wait...' : 'Create Account 👤'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
