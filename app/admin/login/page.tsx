"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-border-dark bg-bg-secondary p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-accent-navy-bright">Cyberxperts</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink-primary">Admin Access</h1>
        <p className="mt-2 font-body text-sm text-ink-muted">Enter the admin password to manage site content.</p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full border border-border-dark bg-bg-primary px-4 py-3 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright"
        />

        {error && <p className="mt-3 font-body text-sm text-accent-red-bright">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-sm bg-accent-navy px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-navy-bright disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
