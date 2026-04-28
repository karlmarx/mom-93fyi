"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { useAppState } from "../_hooks/useAppState";
import { todayISO } from "../_lib/dates";

type StepKey = "cups" | "sheets" | "skin";

const QUESTIONS: Record<StepKey, { title: string; instruction: string }> = {
  cups: {
    title: "Anything inside the 4 little white plastic cups under the bed legs?",
    instruction: "Look under each leg of your bed. Anything in any of the 4 cups?",
  },
  sheets: {
    title: "Look at your sheets. Any tiny dark dots or rusty stains?",
    instruction: "Pull the covers back. Check the sheets and pillowcase.",
  },
  skin: {
    title: "Look at your arms and legs. Any new bites?",
    instruction: "Check your skin. Any new red spots or bumps that weren't there yesterday?",
  },
};

const ORDER: StepKey[] = ["cups", "sheets", "skin"];

export default function CheckInFlow() {
  const router = useRouter();
  const { patch } = useAppState();
  const [stepIdx, setStepIdx] = useState(0);
  const [flagged, setFlagged] = useState<StepKey | null>(null);

  if (flagged) {
    return (
      <StepCard
        eyebrow="Make a note"
        title="Mention this to Ben next time you talk."
        instruction="You don't have to do anything else right now. The plan is still working."
      >
        <BigButton
          onClick={() => {
            patch({ lastCheckInDate: todayISO(), lastCheckInResult: "flagged" });
            router.push("/bedbug");
          }}
        >
          Got it. Back to home.
        </BigButton>
      </StepCard>
    );
  }

  if (stepIdx >= ORDER.length) {
    return (
      <StepCard
        eyebrow="All clear"
        title="Three things checked. Nothing strange."
        instruction="That's today's check-in done."
      >
        <BigButton
          onClick={() => {
            patch({ lastCheckInDate: todayISO(), lastCheckInResult: "all_clear" });
            router.push("/bedbug");
          }}
        >
          Mark today &ldquo;all clear&rdquo;
        </BigButton>
        <BigButton href="/bedbug" variant="ghost">
          Back to home without saving
        </BigButton>
      </StepCard>
    );
  }

  const key = ORDER[stepIdx];
  const q = QUESTIONS[key];
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
