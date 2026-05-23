import { loginAction } from "@/server/cms/actions";

export default function AdminLoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper-soft px-4">
      <form action={loginAction} className="w-full max-w-sm rounded-2xl border border-paper-line bg-white p-6 shadow-card">
        <p className="eyebrow">VinFast Thái Bình CMS</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">Đăng nhập admin</h1>
        {searchParams?.error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Email hoặc mật khẩu không đúng.</p>
        )}
        <label className="mt-5 block text-sm font-semibold text-ink-soft">
          Email
          <input name="email" type="email" required className="mt-1.5 w-full rounded-lg border border-paper-line px-3 py-2 text-sm" />
        </label>
        <label className="mt-4 block text-sm font-semibold text-ink-soft">
          Mật khẩu
          <input name="password" type="password" required className="mt-1.5 w-full rounded-lg border border-paper-line px-3 py-2 text-sm" />
        </label>
        <button className="btn-primary mt-6 w-full px-5 py-3">Đăng nhập</button>
      </form>
    </main>
  );
}
