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
    <div className="text-bedbug-ink">
      <div className="mb-1 flex items-baseline justify-between">
        <h1 className="text-3xl font-semibold">Ask Ben</h1>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-xs text-bedbug-ink/60 underline hover:text-bedbug-ink"
          >
            sign out
          </button>
        </form>
      </div>
      <p className="mb-6 text-sm text-bedbug-ink/70">
        {role === "mom"
          ? "Type a question — about anything in the plan, or about Ben's life, or just to say hi. Ben will see it and so will you, right here. Come back anytime to re-read."
          : `Signed in as ${name ?? "Karl"} (admin).`}
      </p>

      <section className="mb-6 space-y-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          rows={3}
          maxLength={2000}
          className="w-full rounded-lg border border-bedbug-ink/20 bg-white px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-bedbug-sage/40"
          placeholder="What do you want to know?"
          disabled={pending}
          aria-label="Your question"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={pending || !draft.trim()}
            className="rounded-lg bg-bedbug-sage px-5 py-3 font-semibold text-bedbug-cream shadow-sm transition-[filter] hover:brightness-95 disabled:opacity-50"
          >
            {pending ? "Sending…" : "Ask"}
          </button>
          {draft.length > 0 ? (
            <span className="text-xs text-bedbug-ink/50">
              {draft.length} / 2000
            </span>
          ) : null}
          {error ? (
            <span className="text-sm text-bedbug-red" role="status">
              {error}
            </span>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        {!loaded ? (
          <p className="text-sm italic text-bedbug-ink/60">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="text-sm italic text-bedbug-ink/60">
            No questions yet. Type one above to get started.
          </p>
        ) : null}
        {questions.map((q) => (
          <article
            key={q.issue_number}
            className="rounded-lg border border-bedbug-ink/15 bg-bedbug-cream-deeper/50 p-4"
          >
            <p className="whitespace-pre-wrap text-base font-semibold leading-snug">
              {q.question}
            </p>
            <p className="mt-1 text-xs text-bedbug-ink/55">
              {formatRelative(q.asked_at)}
            </p>
            {q.answer ? (
              <div className="mt-3 border-t border-bedbug-ink/10 pt-3">
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {q.answer}
                </p>
                {q.answer_at ? (
                  <p className="mt-2 text-xs text-bedbug-ink/55">
                    Ben · {formatRelative(q.answer_at)}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm italic text-bedbug-ink/60">
                Ben is thinking… answer will appear here.
              </p>
            )}
          </article>
        ))}
      </section>
    </div>
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
