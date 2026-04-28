"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../_hooks/useLocalStorage";

const DURATION_MS = 45 * 60 * 1000;
const STORAGE_KEY = "bedbug.dryerTimer.startedAt";

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

type Props = {
  onDone?: () => void;
  durationMs?: number;
};

export function DryerTimer({ onDone, durationMs = DURATION_MS }: Props) {
  const [startedAt, setStartedAt] = useLocalStorage<number | null>(STORAGE_KEY, null);
  const [silenced, setSilenced] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());

  const beepIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const onDoneFiredRef = useRef(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = startedAt ? Math.max(0, startedAt + durationMs - now) : durationMs;
  const elapsed = startedAt ? Math.min(durationMs, now - startedAt) : 0;
  const done = !!startedAt && remaining === 0;

  const playBeep = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 880;
      gain.gain.value = 0.15;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime;
      osc.start(t);
      osc.stop(t + 0.4);
    } catch {
      // no-op
    }
  }, []);

  // Side-effect synchronization: when "done" first becomes true, start the alarm
  // and fire onDone. When silenced or reset, stop the alarm.
  useEffect(() => {
    if (done && !silenced) {
      if (!onDoneFiredRef.current) {
        onDoneFiredRef.current = true;
        onDone?.();
      }
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        if ("Notification" in window && Notification.permission === "granted") {
          try {
            new Notification("Dryer should be done", { body: "Go to Step 13." });
          } catch {
            // some browsers throw
          }
        }
      }
      if (beepIntervalRef.current === null) {
        playBeep();
        beepIntervalRef.current = window.setInterval(playBeep, 1500);
      }
    } else {
      if (beepIntervalRef.current !== null) {
        window.clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
    }
    return () => {
      if (beepIntervalRef.current !== null) {
        window.clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
    };
  }, [done, silenced, onDone, playBeep]);

  function start() {
    onDoneFiredRef.current = false;
    notifiedRef.current = false;
    setSilenced(false);
    setStartedAt(Date.now());
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }

  function silenceAndReset() {
    setSilenced(true);
    setStartedAt(null);
    onDoneFiredRef.current = false;
    notifiedRef.current = false;
  }

  function resetOnly() {
    setStartedAt(null);
    onDoneFiredRef.current = false;
    notifiedRef.current = false;
  }

  if (!startedAt) {
    return (
      <button
        type="button"
        onClick={start}
        className="inline-flex w-full min-h-16 items-center justify-center rounded-lg bg-bedbug-sage px-6 py-4 text-bedbug-button font-semibold text-bedbug-cream active:brightness-90 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
        aria-label="Start the 45-minute dryer timer"
      >
        Start the 45-minute timer
      </button>
    );
  }

  if (done && !silenced) {
    return (
      <div className="flex flex-col gap-4 rounded-lg bg-bedbug-cream-deeper p-6">
        <p className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Dryer should be done.
        </p>
        <p className="text-bedbug-body text-bedbug-ink">Go to Step 13.</p>
        <button
          type="button"
          onClick={silenceAndReset}
          className="inline-flex w-full min-h-16 items-center justify-center rounded-lg bg-bedbug-sage px-6 py-4 text-bedbug-button font-semibold text-bedbug-cream"
          aria-label="Stop the alarm and continue"
        >
          Stop the alarm
        </button>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-bedbug-cream-deeper p-6">
      <p
        className="text-bedbug-title font-semibold leading-tight text-bedbug-ink"
        aria-live="polite"
      >
        {fmt(remaining)}
      </p>
      <p className="text-bedbug-body text-bedbug-ink/80">Time left on the dryer.</p>
      <div className="h-3 w-full overflow-hidden rounded-full bg-bedbug-cream">
        <div className="h-full bg-bedbug-sage" style={{ width: `${pct}%` }} />
      </div>
      <button
        type="button"
        onClick={resetOnly}
        className="inline-flex w-full min-h-12 items-center justify-center rounded-md border border-bedbug-ink/30 px-4 py-2 text-base text-bedbug-ink/70"
        aria-label="Reset the timer"
      >
        Reset timer
      </button>
    </div>
  );
}
