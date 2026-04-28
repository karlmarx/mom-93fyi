"use client";

import { useEffect, useRef, useState } from "react";
import { BigButton } from "../_components/BigButton";
import { CallKarlLink } from "../_components/CallKarlLink";
import { CONFIG } from "../_lib/config";

export default function StuckPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(CONFIG.REASSURANCE_AUDIO_URL, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAudioAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAudioAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleAudio() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-red text-sm font-semibold uppercase tracking-wider">
          Hi, Mom
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          It&apos;s okay. Take a breath.
        </h1>
        <p className="text-bedbug-body text-bedbug-ink/80">
          You don&apos;t have to figure this out alone.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {audioAvailable ? (
          <>
            <audio
              ref={audioRef}
              src={CONFIG.REASSURANCE_AUDIO_URL}
              onEnded={() => setPlaying(false)}
              preload="none"
            />
            <BigButton onClick={toggleAudio} variant="primary">
              {playing ? "Stop the message" : "Listen to a message from Karl"}
            </BigButton>
          </>
        ) : (
          <BigButton disabled variant="ghost">
            Karl&apos;s message — coming soon
          </BigButton>
        )}

        <CallKarlLink label={`Call Karl now (${CONFIG.KARL_PHONE})`} />

        <BigButton href="/bedbug" variant="ghost">
          Go back
        </BigButton>
      </div>
    </article>
  );
}
