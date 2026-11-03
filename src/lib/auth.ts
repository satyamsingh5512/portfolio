import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Admin allowlist, read from ALLOWED_ADMIN_EMAILS on every call (not cached at
 * module load), trimmed and lower-cased so "a@x.com, B@x.com" works.
 */
function getAllowedAdminEmails(): string[] {
  return (process.env.ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** Fails closed: an empty or missing allowlist admits nobody. */
function isAllowedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Always show the account chooser instead of silently reusing the
          // Google account that was signed in last time.
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!isAllowedAdmin(user.email)) {
        console.log("Unauthorized email:", user.email);
        return false;
      }

      user.role = "admin";
      return true;
    },
    async jwt({ token }) {
      // Re-check the allowlist on every request, so an existing session cookie
      // loses admin access as soon as its email is removed from the env.
      token.role = isAllowedAdmin(token.email) ? "admin" : undefined;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
