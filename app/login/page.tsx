"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SESSION_USER_KEY, type AnaesthesiaUser } from "@/lib/anaesthesiaAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/anaesthesia-users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Invalid username or password.",
        );
        return;
      }
      const u = data as AnaesthesiaUser;
      if (!u?.id || !u?.username || !u?.name || !u?.anaesthesiaId) {
        setError("Unexpected response from server.");
        return;
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(u));
      }
      router.push("/dashboard");
    } catch {
      setError("Cannot reach server. Is the backend running?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-[var(--background)] p-4'>
      <div className='w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl'>
        <div
          className='px-8 py-6 text-center'
          style={{ background: "var(--header-bg)" }}
        >
          <h1 className='text-xl font-bold text-[var(--header-text)]'>
            XO Labs
          </h1>
          <p className='mt-1 text-sm text-[var(--accent-muted)]'>Anaesthesia</p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5 p-8'>
          <h2 className='text-lg font-semibold text-slate-700'>Sign in</h2>
          {error && (
            <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor='username'
              className='mb-1.5 block text-sm font-medium text-[var(--header-text)]'
            >
              Username
            </label>
            <input
              id='username'
              type='text'
              autoComplete='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username'
              className='w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='mb-1.5 block text-sm font-medium text-[var(--header-text)]'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50'
            />
          </div>
          <button
            type='submit'
            disabled={submitting}
            className='w-full rounded-xl bg-slate-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-60'
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <p className='text-center text-xs text-[var(--accent-muted)]'>
            © {new Date().getFullYear()} XO Labs. All rights reserved.
          </p>
        </form>
      </div>
    </div>
  );
}
