'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [promptpayNumber, setPromptpayNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/profile/api');
        const result = await response.json();

        if (response.ok) {
          setPromptpayNumber(result.promptpay_number || '');
        }
      } catch {
        setMessage({ text: 'Failed to load profile', type: 'error' }); // eslint-disable-line no-useless-catch
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/profile/api', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptpay_number: promptpayNumber.trim() }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error();

      setMessage({ text: 'Profile saved successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to save profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-md animate-fade-in-up">
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-3xl font-extrabold text-blue-600">
            Fair Pay ⚖️
          </h1>
          <p className="text-sm text-slate-500">
            ตั้งค่า PromptPay เพื่อรับชำระเงิน
          </p>
        </div>

        {loading ? (
          <div className="space-y-4" role="status" aria-label="Loading">
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-3/4 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
          </div>
        ) : (
          <>
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

            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  PromptPay Number
                </label>

                <input
                  type="text"
                  value={promptpayNumber}
                  onChange={(e) => setPromptpayNumber(e.target.value)}
                  placeholder="เช่น 0812345678"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-400">
                  เบอร์โทรศัพท์ที่ผูก PromptPay ไว้
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-md shadow-blue-200 transition-all duration-150 hover:bg-blue-700 active:scale-[0.97] disabled:bg-slate-300"
              >
                {saving ? 'Saving...' : 'Save Profile 💾'}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center space-y-3">
          <Link
            href="/badminton"
            className="block text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            กลับไปหน้า Badminton
          </Link>

          <hr className="border-slate-100" />

          <button
            onClick={handleLogout}
            className="text-sm text-rose-500 hover:text-rose-700 font-semibold active:scale-[0.97] transition-all duration-150"
          >
            Logout 🔓
          </button>
        </div>
      </div>
    </main>
  );
}
