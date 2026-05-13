"use client";

import { useEffect, useRef, useState, useTransition } from "react";

type Question = {
  issue_number: number;
  issue_url: string;
  question: string;
  answer: string | null;
  asked_at: string;
  answer_at: string | null;
  state: string;
};

const POLL_MS = 15_000;

export default function ChatClient({
  name,
  role,
  signOutAction,
}: {
  name: string | null;
  role: "mom" | "karl";
  signOutAction: () => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const lastFetchedAt = useRef<number>(0);

  const refresh = async () => {
    try {
      const res = await fetch("/api/ask", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { questions: Question[] };
      setQuestions(data.questions);
      lastFetchedAt.current = Date.now();
    } catch {
      /* swallow; next poll retries */
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    void refresh();
    const id = setInterval(refresh, POLL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const submit = () => {
    const text = draft.trim();
    if (!text || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text }),
        });
        if (!res.ok) {
          const msg = await res.text();
          setError(msg || "Couldn't send your question. Try again?");
          return;
        }
        setDraft("");
        await refresh();
      } catch {
        setError("Network hiccup. Try again?");
      }
    });
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <main className="mx-auto max-w-lg px-5 py-10 text-ink/90">
      <div className="mb-1 flex items-baseline justify-between">
        <h1 className="font-display text-3xl italic">Ask Ben</h1>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-xs text-ink-soft underline hover:text-ink"
          >
            sign out
          </button>
        </form>
      </div>
      <p className="mb-6 text-sm text-ink-soft">
        {role === "mom"
          ? "Type a question. Ben will see it and answer here. You can come back to read it anytime."
          : `Signed in as ${name ?? "Karl"} (admin).`}
      </p>

      <section className="mb-6 space-y-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          rows={3}
          maxLength={2000}
          className="w-full rounded border border-ink/30 bg-white px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose/40"
          placeholder="What do you want to know?"
          disabled={pending}
          aria-label="Your question"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={pending || !draft.trim()}
            className="rounded bg-ink px-4 py-2 text-paper hover:bg-ink-soft disabled:opacity-50"
          >
            {pending ? "Sending…" : "Ask"}
          </button>
          {draft.length > 0 ? (
            <span className="text-xs text-ink-soft">
              {draft.length} / 2000
            </span>
          ) : null}
          {error ? (
            <span className="text-sm text-rose" role="status">
              {error}
            </span>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        {!loaded ? (
          <p className="text-sm text-ink-soft italic">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-ink-soft italic">
            No questions yet. Type one above to get started.
          </p>
        ) : null}
        {questions.map((q) => (
          <article
            key={q.issue_number}
            className="rounded border border-ink/15 bg-paper-aged/30 p-4"
          >
            <p className="text-base font-semibold leading-snug whitespace-pre-wrap">
              {q.question}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {formatRelative(q.asked_at)}
            </p>
            {q.answer ? (
              <div className="mt-3 border-t border-ink/10 pt-3">
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {q.answer}
                </p>
                {q.answer_at ? (
                  <p className="mt-2 text-xs text-ink-soft">
                    Ben · {formatRelative(q.answer_at)}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm italic text-ink-soft">
                Ben is thinking… answer will appear here.
              </p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

function formatRelative(iso: string): string {
  const dt = new Date(iso);
  const now = new Date();
  const secs = Math.floor((now.getTime() - dt.getTime()) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
