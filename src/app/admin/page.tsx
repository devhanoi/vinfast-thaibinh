"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fetchApi } from "@/lib/api/fetcher";
import {
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
  const leads = useResourceCount("/api/admin/leads", LeadEntity);

  const cards = [
    { label: "Sản phẩm", q: products },
    { label: "Hero slides", q: hero },
    { label: "FAQ", q: faqs },
    { label: "Testimonials", q: testimonials },
    { label: "Lead", q: leads },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Tổng quan</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Hệ thống CMS VinFast Thái Bình — dữ liệu lấy qua REST API <code>/api/admin/*</code>.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-paper-line bg-white p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wider text-ink-muted">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-brand">
              {c.q.isLoading ? "…" : c.q.error ? "—" : c.q.data?.length ?? 0}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-paper-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">CRUD chi tiết</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Trang chi tiết quản lý sản phẩm, hero, FAQ, testimonial, trạm sạc, lead, SEO, store
          sẽ build incrementally. Foundation API đã sẵn sàng tại{" "}
          <code className="rounded bg-paper-soft px-1.5 py-0.5 text-xs">/api/admin/*</code>{" "}
          với hooks template ở <code className="rounded bg-paper-soft px-1.5 py-0.5 text-xs">src/lib/api-hooks/</code>.
        </p>
      </section>
    </div>
  );
}
