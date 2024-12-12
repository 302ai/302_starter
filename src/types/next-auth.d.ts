import type { AuthUser } from "@/types/auth";

declare module "next-auth" {
  interface Session {
    user: AuthUser;
  }
  interface User extends AuthUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AuthUser;
  }
}
