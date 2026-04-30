"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { ProgressDots, StepCount } from "../_components/Wizard";
import { SmsKarlLink } from "../_components/SmsKarlLink";
import { PhotoCaptureButton } from "../_components/PhotoCaptureButton";
import { useAppState } from "../_hooks/useAppState";
import { todayISO } from "../_lib/dates";

// Verbatim from docs/plan.md Section 7.
const QUESTIONS = [
  {
    title: "Did you check the 6 black cups under the bed legs?",
    follow: "Anything in any of the cups?",
    flagBody:
      "Mom: something showed up in one of the cups under the bed. I'll send a photo.",
  },
  {
    title: "Look at your sheets. Any tiny dark dots? Any rusty stains?",
    flagBody:
      "Mom: the sheets have something on them. I'll send a photo.",
  },
  {
    title: "Look at your arms and legs. Any new bites?",
    flagBody:
      "Mom: I have new bites this morning. I'll send a photo.",
  },
] as const;

type Phase = "q1" | "q1-followup" | "q2" | "q3" | "flagged" | "all-clear";

export default function CheckInPage() {
  const router = useRouter();
  const [, setState] = useAppState();
  const [phase, setPhase] = useState<Phase>("q1");
  const [flaggedAt, setFlaggedAt] = useState<number | null>(null);

  function flag(reason: number) {
    setFlaggedAt(reason);
    setPhase("flagged");
    setState({
      lastCheckInDate: todayISO(),
      lastCheckInResult: "flagged",
      // If a cup capture was just reported (reason 0), record the date.
      ...(reason === 0
        ? { lastInterceptorCaptureDate: todayISO() }
        : {}),
    });
  }

  function recordAllClear() {
    setState({
      lastCheckInDate: todayISO(),
      lastCheckInResult: "all_clear",
    });
  }

  if (phase === "flagged") {
    const q = QUESTIONS[flaggedAt ?? 0];
    return (
      <div className="flex flex-col gap-4">
        <StepCard
          eyebrow="Stop here"
          title="Take a photo and text Ben."
          instruction="Don't worry. He'll know what to do. You can rest after."
        >
          <PhotoCaptureButton smsBody={q.flagBody} label="Take a photo" />
          <SmsKarlLink body={q.flagBody}>
            Text Ben without a photo
          </SmsKarlLink>
          <BigButton href="/bedbug" variant="ghost">
            Back to home
          </BigButton>
        </StepCard>
      </div>
    );
  }

  if (phase === "all-clear") {
    return (
      <div className="flex flex-col gap-4">
        <StepCard
          eyebrow="Last step"
          title="Send 'all clear' to Ben."
          instruction="One tap. Then you're done for the morning."
        >
          <SmsKarlLink
            body="Mom: all clear today."
            ariaLabel="Send 'all clear' text to Ben"
            onClick={recordAllClear}
          >
            Send &ldquo;all clear&rdquo; to Ben
          </SmsKarlLink>
          <BigButton
            href="/bedbug"
            variant="ghost"
            onClick={recordAllClear}
            ariaLabel="I'll text Ben separately. Back to home."
          >
            I&apos;ll text him separately — back to home
          </BigButton>
        </StepCard>
      </div>
    );
  }

  const stepNumber =
    phase === "q1" || phase === "q1-followup" ? 1 : phase === "q2" ? 2 : 3;

  return (
    <div className="flex flex-col gap-4">
      <ProgressDots totalSteps={3} currentStep={stepNumber} />
      <StepCount current={stepNumber} total={3} />

      {phase === "q1" ? (
        <StepCard
          eyebrow="Check-in 1 of 3"
          title={QUESTIONS[0].title}
        >
          <BigButton onClick={() => setPhase("q1-followup")}>Yes — I checked</BigButton>
          <BigButton onClick={() => setPhase("q1-followup")} variant="ghost">
            I&apos;ll check now, then yes
          </BigButton>
        </StepCard>
      ) : null}

      {phase === "q1-followup" ? (
        <StepCard
          eyebrow="Check-in 1 of 3"
          title={QUESTIONS[0].follow!}
        >
          <BigButton onClick={() => setPhase("q2")}>No — cups are empty</BigButton>
          <BigButton onClick={() => flag(0)} variant="danger">
            Yes — something is in a cup
          </BigButton>
        </StepCard>
      ) : null}

      {phase === "q2" ? (
        <StepCard
          eyebrow="Check-in 2 of 3"
          title={QUESTIONS[1].title}
        >
          <BigButton onClick={() => setPhase("q3")}>No — sheets look fine</BigButton>
          <BigButton onClick={() => flag(1)} variant="danger">
            Yes — I see something
          </BigButton>
        </StepCard>
      ) : null}

      {phase === "q3" ? (
        <StepCard
          eyebrow="Check-in 3 of 3"
          title={QUESTIONS[2].title}
        >
          <BigButton onClick={() => setPhase("all-clear")}>No — no new bites</BigButton>
          <BigButton onClick={() => flag(2)} variant="danger">
            Yes — I have new bites
          </BigButton>
        </StepCard>
      ) : null}

      <BigButton onClick={() => router.push("/bedbug")} variant="ghost">
        Stop and go back
      </BigButton>
    </div>
  );
}
