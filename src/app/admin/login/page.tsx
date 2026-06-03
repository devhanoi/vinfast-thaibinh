"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-paper-soft text-sm text-ink-muted">Đang nạp…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
      redirect: false,
    });
    setPending(false);
    if (!res || res.error) {
      setError("Email hoặc mật khẩu không đúng");
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper-soft px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-paper-line bg-white p-6 shadow-card"
      >
        <p className="eyebrow">VinFast Thái Bình CMS</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">Đăng nhập admin</h1>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <label className="mt-5 block text-sm font-semibold text-ink-soft">
          Email hoặc tên đăng nhập
          <input
            name="email"
            type="text"
            required
            autoComplete="username"
            spellCheck={false}
            className="mt-1.5 w-full rounded-lg border border-paper-line px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-ink-soft">
          Mật khẩu
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-lg border border-paper-line px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary mt-6 w-full px-5 py-3 disabled:opacity-60"
        >
          {pending ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </main>
  );
}
