import type { Metadata } from "next";
import { auth, signIn, signOut, isKarl, isMom } from "@/auth";

export const metadata: Metadata = {
  title: "Ask · mom.93.fyi",
  robots: "noindex",
};

const allowedEmails = new Set(
  [process.env.MOM_EMAIL, process.env.KARL_EMAIL]
    .filter((e): e is string => Boolean(e))
    .map((e) => e.toLowerCase()),
);

export default async function AskPage() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();

  if (!email || !allowedEmails.has(email)) {
    return <SignInPrompt />;
  }

  return <Authed email={email} name={session?.user?.name ?? null} />;
}

function SignInPrompt() {
  return (
    <main className="mx-auto max-w-md px-6 py-16 text-ink/90">
      <h1 className="font-display text-3xl italic mb-4">Ask</h1>
      <p className="mb-8 text-base text-ink-soft">
        Sign in with the Google account you use for the family line.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/ask" });
        }}
      >
        <button
          type="submit"
          className="rounded bg-ink px-4 py-2 text-paper hover:bg-ink-soft"
        >
          Sign in with Google
        </button>
      </form>
    </main>
  );
}

function Authed({ email, name }: { email: string; name: string | null }) {
  const role = isKarl(email) ? "karl" : isMom(email) ? "mom" : "unknown";
  return (
    <main className="mx-auto max-w-md px-6 py-16 text-ink/90">
      <h1 className="font-display text-3xl italic mb-2">Ask</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Signed in as {name ?? email} · role: <strong>{role}</strong>
      </p>

      <p className="mb-6 text-base">
        Chat UI lands here next. For now: auth gate verified.
      </p>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/ask" });
        }}
      >
        <button
          type="submit"
          className="text-sm text-ink-soft underline hover:text-ink"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
