"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../_lib/config";
import { BigButton } from "../_components/BigButton";
import { CallKarlLink } from "../_components/CallKarlLink";

export default function StuckPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  // HEAD probe — if the audio file isn't present yet, disable that button so
  // it doesn't 404 in front of Mom.
  useEffect(() => {
    let cancelled = false;
    fetch(CONFIG.REASSURANCE_AUDIO_URL, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setAudioAvailable(r.ok);
      })
      .catch(() => {
        if (!cancelled) setAudioAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleAudio() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      a.currentTime = 0;
      setPlaying(false);
    } else {
      a.play().catch(() => undefined);
      setPlaying(true);
    }
  }

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-8 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          It&apos;s okay. Take a breath.
        </h1>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          You don&apos;t have to figure this out alone. Sit down for a minute. Then
          pick one of the buttons below.
        </p>
      </div>

      <audio
        ref={audioRef}
        src={CONFIG.REASSURANCE_AUDIO_URL}
        onEnded={() => setPlaying(false)}
        preload="none"
      />

      <BigButton
        onClick={toggleAudio}
        disabled={audioAvailable === false}
        ariaLabel={
          audioAvailable === false
            ? "Audio message from Ben — coming soon"
            : playing
              ? "Stop the audio message"
              : "Play the audio message from Ben"
        }
      >
        {audioAvailable === false
          ? "Audio message — coming soon"
          : playing
            ? "Stop the message"
            : "Listen to a message from Ben"}
      </BigButton>

      <CallKarlLink>📞 Call Ben now</CallKarlLink>

      <BigButton href="/bedbug" variant="ghost">
        Go back
      </BigButton>
    </article>
  );
}
