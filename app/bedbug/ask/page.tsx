import type { Metadata } from "next";
import { auth, signIn, signOut, isKarl, isMom } from "@/auth";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "Ask Ben · bedbug.93.fyi",
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
    await signOut({ redirectTo: "/bedbug/ask" });
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
    <div className="mx-auto max-w-md py-8 text-bedbug-ink">
      <h1 className="text-3xl font-semibold mb-4">Ask Ben</h1>
      <p className="mb-6 text-base text-bedbug-ink/80">
        Sign in with the Google account Ben set up for you.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/bedbug/ask" });
        }}
      >
        <button
          type="submit"
          className="rounded-lg bg-bedbug-sage px-5 py-3 text-bedbug-cream font-semibold shadow-sm transition-[filter] hover:brightness-95"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
