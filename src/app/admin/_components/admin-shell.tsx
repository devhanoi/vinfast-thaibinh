"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/hero", label: "Hero slides" },
  { href: "/admin/faqs", label: "FAQ" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/charging", label: "Trạm sạc" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Cài đặt + SEO" },
];

export function AdminShell({
  user,
  children,
}: {
  user: { email?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-paper-soft">
      <header className="border-b border-paper-line bg-white">
        <div className="container-page flex h-14 items-center justify-between">
          <Link href="/admin" className="font-display text-base font-bold text-ink">
            VinFast Thái Bình · Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink-muted">{user.email}</span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="font-semibold text-brand hover:underline"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <div className="container-page grid gap-6 py-6 md:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-ink text-white"
                      : "text-ink-soft hover:bg-white hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
