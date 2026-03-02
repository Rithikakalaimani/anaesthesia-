"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // Dummy login: accept any non-empty email and password
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem(AUTH_KEY, "dummy");
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div
          className="px-8 py-6 text-center"
          style={{ background: "var(--header-bg)" }}
        >
          <h1 className="text-xl font-bold text-[var(--header-text)]">
            XO Labs
          </h1>
          <p className="mt-1 text-sm text-[var(--accent-muted)]">
            Anaesthesia
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <h2 className="text-lg font-semibold text-slate-700">Sign in</h2>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-[var(--header-text)]"
            >
              Email or username
            </label>
            <input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-[var(--header-text)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Sign in
          </button>
          <p className="text-center text-xs text-[var(--accent-muted)]">
            Dummy login.
          </p>
        </form>
      </div>
    </div>
  );
}
