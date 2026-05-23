import Link from "next/link";
import { logoutAction } from "@/server/cms/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/store", label: "Cửa hàng" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/content", label: "Nội dung" },
  { href: "/admin/leads", label: "Lead" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper-soft text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-paper-line bg-white p-5 md:block">
        <Link href="/admin" className="font-display text-lg font-bold">VinFast CMS</Link>
        <nav className="mt-8 grid gap-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper-soft hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-paper-line bg-white px-4 md:px-8">
          <div className="text-sm font-semibold">Admin dashboard</div>
          <form action={logoutAction}>
            <Button variant="outline" size="sm">
              Đăng xuất
            </Button>
          </form>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";
