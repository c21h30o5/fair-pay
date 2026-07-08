'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/', label: 'Home', icon: '⚖️' },
  { href: '/badminton', label: 'Badminton', icon: '🏸' },
  { href: '/badminton/history', label: 'History', icon: '📜' },
];

export default function NavBar() {
  const [user, setUser] = useState<object | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-800">
            ⚖️ Fair Pay
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="ml-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-rose-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="ml-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 animate-fade-in" />
          <div
            className="absolute top-0 right-0 h-full w-64 bg-white shadow-xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100">
              <span className="font-bold text-slate-800">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 p-4 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    🔓 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    🔑 Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    👤 Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
