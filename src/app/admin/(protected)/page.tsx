"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fetchApi } from "@/lib/api/fetcher";
import {
  ChargingStationEntity,
  FaqEntity,
  HeroSlideEntity,
  LeadEntity,
  ProductEntity,
  TestimonialEntity,
} from "@/lib/zod";

function useResourceCount<T>(url: string, schema: z.ZodType<T>) {
  return useQuery({
    queryKey: ["admin-count", url],
    queryFn: () => fetchApi(url, { schema: z.array(schema) }),
    staleTime: 30_000,
  });
}

export default function AdminDashboard() {
  const products = useResourceCount("/api/admin/products", ProductEntity);
  const hero = useResourceCount("/api/admin/hero", HeroSlideEntity);
  const faqs = useResourceCount("/api/admin/faqs", FaqEntity);
  const testimonials = useResourceCount("/api/admin/testimonials", TestimonialEntity);
  const charging = useResourceCount("/api/admin/charging", ChargingStationEntity);
  const leads = useResourceCount("/api/admin/leads", LeadEntity);

  const cards = [
    { label: "Sản phẩm", q: products, href: "/admin/products" },
    { label: "Hero slides", q: hero, href: "/admin/hero" },
    { label: "FAQ", q: faqs, href: "/admin/faqs" },
    { label: "Testimonials", q: testimonials, href: "/admin/testimonials" },
    { label: "Trạm sạc", q: charging, href: "/admin/charging" },
    { label: "Lead", q: leads, href: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Tổng quan</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Hệ thống CMS VinFast Thái Bình — dữ liệu lấy qua REST API <code>/api/admin/*</code>.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-paper-line bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <p className="text-xs uppercase tracking-wider text-ink-muted">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-brand">
              {c.q.isLoading ? "…" : c.q.error ? "—" : (c.q.data?.length ?? 0)}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
