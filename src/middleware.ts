import NextAuth from "next-auth";
import { authConfig } from "@/server/auth/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  const path = req.nextUrl.pathname;
  if (path === "/admin/login") return;

  const needsAuth = path.startsWith("/admin") || path.startsWith("/api/admin");
  if (!needsAuth) return;

  if (!req.auth) {
    if (path.startsWith("/api/admin")) {
      return new Response(
        JSON.stringify({ error: { code: "unauthorized", message: "Cần đăng nhập" } }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", path);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
