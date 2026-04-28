"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { SmsKarlLink } from "../_components/SmsKarlLink";
import { PhotoCaptureButton } from "../_components/PhotoCaptureButton";
import { useAppState } from "../_hooks/useAppState";
import { todayISO } from "../_lib/dates";

type StepKey = "cups" | "sheets" | "skin";

const QUESTIONS: Record<StepKey, { title: string; instruction: string; flagBody: string }> = {
  cups: {
    title: "Did you check the 4 little white plastic cups under the bed legs?",
    instruction:
      "Look under each leg of your bed. Is anything inside any of the 4 cups?",
    flagBody: "Mom: I see something in one of the cups under the bed.",
  },
  sheets: {
    title: "Look at your sheets. Any tiny dark dots or rusty stains?",
    instruction: "Pull the covers back. Check the sheets and pillowcase.",
    flagBody: "Mom: I see dark dots or rusty stains on the sheets.",
  },
  skin: {
    title: "Look at your arms and legs. Any new bites?",
    instruction: "Check your skin. Any new red spots or bumps that weren't there yesterday?",
    flagBody: "Mom: I see new bites on my skin.",
  },
};

const ORDER: StepKey[] = ["cups", "sheets", "skin"];

export default function CheckInFlow() {
  const router = useRouter();
  const { patch } = useAppState();
  const [stepIdx, setStepIdx] = useState(0);
  const [flagged, setFlagged] = useState<StepKey | null>(null);

  if (flagged) {
    const q = QUESTIONS[flagged];
    return (
      <div className="flex flex-col gap-4">
        <StepCard
          eyebrow="Send Karl a photo"
          title="Take a photo and text Karl. Don't worry — he'll know what to do."
          instruction={q.instruction}
        >
          <PhotoCaptureButton smsBody={q.flagBody} />
          <SmsKarlLink body={q.flagBody} label="Open Messages to Karl" variant="neutral" />
          <BigButton
            onClick={() => {
              patch({ lastCheckInDate: todayISO(), lastCheckInResult: "flagged" });
              router.push("/bedbug");
            }}
            variant="ghost"
          >
            Done. Back to home.
          </BigButton>
        </StepCard>
      </div>
    );
  }

  if (stepIdx >= ORDER.length) {
    const body = "Mom: all clear today.";
    return (
      <div className="flex flex-col gap-4">
        <StepCard
          eyebrow="All clear"
          title="Send Karl your 'all clear' message."
          instruction="Three things checked. Nothing strange. Tap below to text Karl."
        >
          <SmsKarlLink
            body={body}
            label="Send 'all clear' to Karl"
            onClick={() => {
              patch({ lastCheckInDate: todayISO(), lastCheckInResult: "all_clear" });
            }}
          />
          <BigButton href="/bedbug" variant="ghost">
            Back to home
          </BigButton>
        </StepCard>
      </div>
    );
  }

  const key = ORDER[stepIdx];
  const q = QUESTIONS[key];
  // Two-screen pattern per step: confirm checked → answer found-anything?
  return (
    <CheckQuestion
      key={key}
      title={q.title}
      instruction={q.instruction}
      onYes={() => setFlagged(key)}
      onNo={() => setStepIdx(stepIdx + 1)}
    />
  );
}

function CheckQuestion({
  title,
  instruction,
  onYes,
  onNo,
}: {
  title: string;
  instruction: string;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <StepCard title={title} instruction={instruction}>
      <BigButton onClick={onNo} variant="primary">
        No — nothing
      </BigButton>
      <BigButton onClick={onYes} variant="danger">
        Yes — I see something
      </BigButton>
    </StepCard>
  );
}
