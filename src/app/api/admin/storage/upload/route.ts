import { handle } from "@/app/api/_lib/handle";
import { requireAdmin } from "@/server/auth/guard";
import { getStorage } from "@/server/storage";
import { ValidationError } from "@/server/errors";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "misc"
  );
}

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");
    const resource = slugify(String(form.get("resource") ?? "misc"));
    const slug = slugify(String(form.get("slug") ?? "misc"));

    if (!(file instanceof File)) {
      throw new ValidationError("Thiếu file ảnh trong form data");
    }
    if (file.size === 0) {
      throw new ValidationError("File rỗng");
    }
    if (file.size > MAX_BYTES) {
      throw new ValidationError(`File ${(file.size / 1024 / 1024).toFixed(1)}MB > 10MB cho phép`);
    }
    const ext = EXT_BY_TYPE[file.type];
    if (!ext) {
      throw new ValidationError(`Content-Type không hỗ trợ: ${file.type}`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${resource}/${slug}/${randomUUID()}.${ext}`;

    const storage = getStorage();
    const result = await storage.putObject({ key, body: buffer, contentType: file.type });

    return result;
  });
}
