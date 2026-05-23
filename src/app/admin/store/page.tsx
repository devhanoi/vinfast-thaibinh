import { requireAdmin } from "@/server/auth/session";
import { getStoreSettings } from "@/server/cms/data";
import { updateStoreSettingsAction } from "@/server/cms/actions";
import { AdminCard, AdminShell } from "@/components/admin/admin-shell";

export default async function AdminStorePage() {
  await requireAdmin();
  const site = await getStoreSettings();
  return (
    <AdminShell>
      <AdminCard title="Thông tin cửa hàng">
        <p className="mb-4 text-sm text-ink-muted">Chỉnh JSON để cấu hình NAP, hotline, social, giờ mở cửa. Giữ đúng cấu trúc hiện tại.</p>
        <form action={updateStoreSettingsAction}>
          <textarea
            name="valueJson"
            rows={24}
            defaultValue={JSON.stringify(site, null, 2)}
            className="w-full rounded-xl border border-paper-line bg-ink p-4 font-mono text-xs text-white"
          />
          <button className="btn-primary mt-4 px-5 py-3">Lưu cấu hình</button>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
