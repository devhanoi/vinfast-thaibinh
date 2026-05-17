import { FAQS } from "@/content/faq";

export function FaqSection() {
  return (
    <section id="faq" className="section">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="eyebrow">Câu hỏi thường gặp</p>
          <h2 className="mt-3 h-section text-ink">FAQ về VinFast Thái Bình</h2>
          <p className="mt-3 text-base text-ink-muted">
            Tổng hợp các thắc mắc phổ biến từ khách hàng Thái Bình và các tỉnh lân cận khi mua xe
            điện VinFast.
          </p>
        </div>
        <div className="divide-y divide-paper-line overflow-hidden rounded-2xl border border-paper-line bg-white shadow-card">
          {FAQS.map((item, idx) => (
            <details key={item.q} className="group" open={idx === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-display text-base font-semibold text-ink transition hover:bg-paper-soft">
                {item.q}
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-paper-line text-brand transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-sm leading-relaxed text-ink-muted">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
