import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = new Set(
  [process.env.MOM_EMAIL, process.env.KARL_EMAIL]
    .filter((e): e is string => Boolean(e))
    .map((e) => e.toLowerCase()),
);

function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return allowedEmails.has(email.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/ask/sign-in",
  },
  callbacks: {
    async signIn({ user }) {
      return isAllowed(user.email);
    },
  },
});

export function isKarl(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === (process.env.KARL_EMAIL || "").toLowerCase();
}

export function isMom(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === (process.env.MOM_EMAIL || "").toLowerCase();
}
