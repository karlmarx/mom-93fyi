import type { Metadata } from "next";
import { auth, signIn, signOut, isKarl, isMom } from "@/auth";
import ChatClient from "./ChatClient";

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

  const role: "mom" | "karl" = isMom(email) ? "mom" : isKarl(email) ? "karl" : "mom";
  const signOutAction = async () => {
    "use server";
    await signOut({ redirectTo: "/ask" });
  };

  return (
    <ChatClient
      name={session?.user?.name ?? null}
      role={role}
      signOutAction={signOutAction}
    />
  );
}

function SignInPrompt() {
  return (
    <main className="mx-auto max-w-md px-6 py-16 text-ink/90">
      <h1 className="font-display text-3xl italic mb-4">Ask Ben</h1>
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
