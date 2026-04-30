"use client";

import { useState } from "react";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { ProgressDots, StepCount } from "../_components/Wizard";
import { PhotoCaptureButton } from "../_components/PhotoCaptureButton";
import { SmsKarlLink } from "../_components/SmsKarlLink";
import { PhotoSlot } from "../_components/PhotoSlot";

// Verbatim from docs/plan.md Section 0 (Mom-facing steps 0-M-1, 0-M-2, 0-M-3).
const TASKS = [
  {
    photoId: "confirm-mattress-seam",
    title:
      "Pull the sheets and pillowcases off the bed. Take close-up photos of the mattress seams (the piped edges), the corners of the box spring, and inside the bed frame joints.",
    instruction:
      "Use good light. Get close. Send the photos to Ben.",
    smsBody:
      "Mom: photos of the mattress seams, box spring corners, and bed frame joints.",
    photoLabel: "Take a photo of the mattress",
  },
  {
    photoId: "confirm-bites",
    title:
      "Take photos of any bites you have — close up, with good light, with a coin or your finger next to one for size.",
    instruction:
      "One photo per bite area is fine. Send them to Ben.",
    smsBody: "Mom: photos of the bites I have right now, with size scale.",
    photoLabel: "Take a photo of a bite",
  },
  {
    photoId: "confirm-sheets-morning",
    title:
      "Tomorrow morning, before getting up: look at the sheets. Any small dark dots? Any tiny bug? Take pictures.",
    instruction:
      "Send the morning photos to Ben. Then come back here and tap DONE.",
    smsBody: "Mom: morning sheet photos before getting up.",
    photoLabel: "Take a sheet photo",
  },
] as const;

const STORAGE_KEY = "bedbug.confirm.taskDone";

type Done = [boolean, boolean, boolean];

function readDone(): Done {
  if (typeof window === "undefined") return [false, false, false];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [false, false, false];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.length === 3) {
      return [Boolean(parsed[0]), Boolean(parsed[1]), Boolean(parsed[2])];
    }
  } catch {
    // ignore
  }
  return [false, false, false];
}

function writeDone(done: Done) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  } catch {
    // ignore
  }
}

export default function ConfirmFlow() {
  const [done, setDoneState] = useState<Done>(() => readDone());
  const [idx, setIdx] = useState<number>(() => {
    const d = readDone();
    const next = d.findIndex((x) => !x);
    return next === -1 ? TASKS.length : next;
  });

  function markDone(i: number) {
    const next: Done = [...done] as Done;
    next[i] = true;
    setDoneState(next);
    writeDone(next);
    setIdx(i + 1);
  }

  if (idx >= TASKS.length) {
    return (
      <div className="flex flex-col gap-4">
        <StepCard
          eyebrow="All three sent"
          title="Ben will look at the photos and tell you what's next."
          instruction="You can rest. Don't throw anything away today."
        >
          <BigButton href="/bedbug" variant="ghost">
            Back to home
          </BigButton>
          <BigButton
            onClick={() => {
              setDoneState([false, false, false]);
              writeDone([false, false, false]);
              setIdx(0);
            }}
            variant="ghost"
          >
            Start over
          </BigButton>
        </StepCard>
      </div>
    );
  }

  const t = TASKS[idx];
  const stepNumber = idx + 1;

  return (
    <div className="flex flex-col gap-4">
      <ProgressDots totalSteps={TASKS.length} currentStep={stepNumber} />
      <StepCount current={stepNumber} total={TASKS.length} />

      <StepCard
        eyebrow={`Photo task ${stepNumber} of ${TASKS.length}`}
        title={t.title}
        instruction={t.instruction}
      >
        <PhotoSlot id={t.photoId} alt={t.title} />
        <PhotoCaptureButton smsBody={t.smsBody} label={t.photoLabel} />
        <SmsKarlLink body={t.smsBody} variant="ghost">
          Text Ben without a photo
        </SmsKarlLink>
        <BigButton onClick={() => markDone(idx)}>
          Done with this one
        </BigButton>
        {idx > 0 ? (
          <BigButton onClick={() => setIdx(idx - 1)} variant="ghost">
            Go back one
          </BigButton>
        ) : null}
      </StepCard>
    </div>
  );
}
