import Link from "next/link";
import { requireAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { deleteProductAction, saveProductAction } from "@/server/cms/actions";
import { AdminCard, AdminShell, inputClass } from "@/components/admin/admin-shell";
import { formatVND } from "@/lib/utils";
import { ProductSearch } from "@/components/admin/product-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <AdminCard title="Danh sách sản phẩm">
          <div className="mb-4">
            <ProductSearch />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-semibold">
                    <Link href={`/admin/products/${product.id}`} className="hover:text-brand">
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatVND(product.priceFrom)}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "active" ? "default" : "outline"}>{product.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <Button variant="destructive" size="sm">Xóa</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminCard>
        <AdminCard title="Thêm sản phẩm">
          <ProductForm />
        </AdminCard>
      </div>
    </AdminShell>
  );
}

function ProductForm() {
  return (
    <form action={saveProductAction} className="grid gap-3">
      <Label>Slug<Input name="slug" required /></Label>
      <Label>Tên<Input name="name" required /></Label>
      <Label>Loại
        <select name="category" className={inputClass} defaultValue="car">
          <option value="car">Ô tô</option>
          <option value="service_car">Xe dịch vụ</option>
          <option value="bike">Xe máy</option>
        </select>
      </Label>
      <Label>Phân khúc<Input name="segment" /></Label>
      <Label>Tagline<Input name="tagline" /></Label>
      <Label>Giá từ<Input name="priceFrom" type="number" required /></Label>
      <Label>Pin<Input name="battery" /></Label>
      <Label>Range km<Input name="rangeKm" type="number" /></Label>
      <Label>Range text<Input name="rangeText" /></Label>
      <Label>Highlights<Textarea name="highlights" rows={4} /></Label>
      <Label>Trạng thái
        <select name="status" className={inputClass} defaultValue="active">
          <option value="active">active</option>
          <option value="draft">draft</option>
          <option value="archived">archived</option>
        </select>
      </Label>
      <Label>Thứ tự<Input name="sortOrder" type="number" defaultValue={0} /></Label>
      <Button variant="brand" className="mt-2">Lưu</Button>
    </form>
  );
}
