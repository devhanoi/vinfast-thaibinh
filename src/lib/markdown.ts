import { marked } from "marked";

marked.setOptions({
  gfm: true,
  // breaks:false là chuẩn markdown — \n đơn = space, \n\n (blank line) = paragraph
  // break. Cần thế để '# heading' + dòng kế tiếp được nhận block đúng.
  breaks: false,
});

/**
 * Convert markdown string sang HTML. Sync — dùng được trong server component
 * + render qua dangerouslySetInnerHTML.
 *
 * Note về XSS: chỉ admin được quyền viết description (qua /admin) — nội dung
 * trust. Nếu sau này có user-generated content, wrap thêm dompurify hoặc
 * sanitize-html.
 */
export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return "";
  const html = marked.parse(md, { async: false });
  return typeof html === "string" ? html : "";
}
