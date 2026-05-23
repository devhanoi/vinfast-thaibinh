import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { deleteProductImageAction, saveProductAction, saveProductImageAction } from "@/server/cms/actions";
import { AdminCard, AdminShell, inputClass } from "@/components/admin/admin-shell";

export default async function AdminProductDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: { orderBy: { sortOrder: "asc" } } } });
  if (!product) notFound();
  const highlights = Array.isArray(product.highlightsJson) ? product.highlightsJson.join("\n") : "";
  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <AdminCard title={`Sửa ${product.name}`}>
          <form action={saveProductAction} className="grid gap-3 md:grid-cols-2">
            <input type="hidden" name="id" value={product.id} />
            <label className="text-sm font-semibold">Slug<input name="slug" defaultValue={product.slug} required className={inputClass} /></label>
            <label className="text-sm font-semibold">Tên<input name="name" defaultValue={product.name} required className={inputClass} /></label>
            <label className="text-sm font-semibold">Loại
              <select name="category" className={inputClass} defaultValue={product.category}>
                <option value="car">Ô tô</option><option value="service_car">Xe dịch vụ</option><option value="bike">Xe máy</option>
              </select>
            </label>
            <label className="text-sm font-semibold">Trạng thái
              <select name="status" className={inputClass} defaultValue={product.status}>
                <option value="active">active</option><option value="draft">draft</option><option value="archived">archived</option>
              </select>
            </label>
            <label className="text-sm font-semibold">Phân khúc<input name="segment" defaultValue={product.segment ?? ""} className={inputClass} /></label>
            <label className="text-sm font-semibold">Tagline<input name="tagline" defaultValue={product.tagline ?? ""} className={inputClass} /></label>
            <label className="text-sm font-semibold">Giá từ<input name="priceFrom" type="number" defaultValue={product.priceFrom} required className={inputClass} /></label>
            <label className="text-sm font-semibold">Thứ tự<input name="sortOrder" type="number" defaultValue={product.sortOrder} className={inputClass} /></label>
            <label className="text-sm font-semibold">Pin<input name="battery" defaultValue={product.battery ?? ""} className={inputClass} /></label>
            <label className="text-sm font-semibold">Range km<input name="rangeKm" type="number" defaultValue={product.rangeKm ?? ""} className={inputClass} /></label>
            <label className="text-sm font-semibold md:col-span-2">Range text<input name="rangeText" defaultValue={product.rangeText ?? ""} className={inputClass} /></label>
            <label className="text-sm font-semibold md:col-span-2">Highlights<textarea name="highlights" rows={5} defaultValue={highlights} className={inputClass} /></label>
            <button className="btn-primary px-5 py-3 md:col-span-2">Lưu sản phẩm</button>
          </form>
        </AdminCard>
        <AdminCard title="Ảnh sản phẩm">
          <div className="grid gap-3">
            {product.images.map((image) => (
              <form key={image.id} action={deleteProductImageAction} className="rounded-lg border border-paper-line p-3 text-sm">
                <input type="hidden" name="id" value={image.id} />
                <input type="hidden" name="productId" value={product.id} />
                <p className="break-all font-medium">{image.url}</p>
                <p className="text-xs text-ink-muted">{image.alt}</p>
                <button className="mt-2 text-xs font-semibold text-red-600">Xóa ảnh</button>
              </form>
            ))}
          </div>
          <form action={saveProductImageAction} className="mt-5 grid gap-3">
            <input type="hidden" name="productId" value={product.id} />
            <label className="text-sm font-semibold">URL ảnh<input name="url" required className={inputClass} /></label>
            <label className="text-sm font-semibold">Alt<input name="alt" required className={inputClass} /></label>
            <label className="text-sm font-semibold">Màu<input name="color" className={inputClass} /></label>
            <label className="text-sm font-semibold">Góc<input name="angle" className={inputClass} /></label>
            <label className="flex items-center gap-2 text-sm font-semibold"><input name="isPrimary" type="checkbox" /> Ảnh chính</label>
            <button className="btn-dark px-4 py-2 text-sm">Thêm ảnh</button>
          </form>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
