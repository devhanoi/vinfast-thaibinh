import type { NextAuthConfig } from "next-auth";

export const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      if (PUBLIC_ADMIN_PATHS.includes(path)) return true;
      if (path.startsWith("/admin")) return !!auth?.user;
      if (path.startsWith("/api/admin")) return !!auth?.user;
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
