"use client";

import { useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { CARS } from "@/content/cars";
import type { CmsProduct } from "@/server/cms/types";

type Status = "idle" | "loading" | "success" | "error";

export function TestDriveForm({ id = "lai-thu", cars }: { id?: string; cars?: CmsProduct[] }) {
  const items = cars ?? CARS.map((car) => ({ id: car.id, name: car.name }));
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gửi đăng ký thất bại, vui lòng thử lại.");
      setStatus("success");
      form.reset();
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    }
  }

  return (
    <section id={id} className="bg-ink section text-white">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow">Đăng ký lái thử miễn phí</p>
          <h2 className="mt-3 h-section">Trải nghiệm VinFast ngay tại địa chỉ của bạn</h2>
          <p className="mt-4 text-base text-white/75">
            Đăng ký để chuyên viên VinFast Thái Bình mang xe đến tận nhà cho quý khách lái thử
            trong bán kính 50km. Thời gian linh hoạt, hoàn toàn miễn phí, không cần đặt cọc.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/80">
            <li>· Hồi đáp trong vòng 5 phút trong giờ hành chính.</li>
            <li>· Hỗ trợ tư vấn tổng chi phí lăn bánh, gói trả góp, ưu đãi tháng.</li>
            <li>· Bảo mật thông tin theo chính sách của VinFast Việt Nam.</li>
          </ul>
        </div>
        <form
          id="bao-gia"
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 text-ink shadow-card md:p-8"
        >
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Họ và tên" name="name" required placeholder="Nguyễn Văn A" />
            <Field label="Số điện thoại" name="phone" required type="tel" inputMode="tel" placeholder="09xx xxx xxx" />
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-ink-soft" htmlFor="model">
                Dòng xe quan tâm <span className="text-brand">*</span>
              </label>
              <select
                id="model"
                name="model"
                required
                defaultValue=""
                className="mt-1.5 block w-full rounded-xl border border-paper-line bg-white px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                <option value="" disabled>Chọn dòng xe...</option>
                {items.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="VinFast khác">Tư vấn dòng phù hợp</option>
              </select>
            </div>
            <Field
              label="Địa chỉ lái thử (huyện/xã)"
              name="address"
              placeholder="Ví dụ: P. Phú Xuân, TP. Thái Bình"
              className="md:col-span-2"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-ink-soft" htmlFor="note">Ghi chú / khung giờ</label>
              <textarea
                id="note"
                name="note"
                rows={3}
                className="mt-1.5 block w-full rounded-xl border border-paper-line bg-white px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Ví dụ: 9h sáng thứ 7 tuần này"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary mt-6 w-full px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Đang gửi...
              </>
            ) : (
              <>Nhận báo giá &amp; lịch lái thử</>
            )}
          </button>
          {status === "success" && (
            <p className="mt-4 flex items-start gap-2 text-sm text-brand">
              <Check size={18} className="mt-0.5 shrink-0" aria-hidden />
              Cảm ơn quý khách! Tư vấn viên VinFast Thái Bình sẽ liên hệ trong vòng 5 phút.
            </p>
          )}
          {status === "error" && error && (
            <p className="mt-4 flex items-start gap-2 text-sm text-red-600">
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  inputMode,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-semibold text-ink-soft">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-xl border border-paper-line bg-white px-4 py-3 text-sm placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </div>
  );
}
