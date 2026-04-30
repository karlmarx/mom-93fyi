"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { ProgressDots, StepCount } from "../_components/Wizard";
import { DryerTimer } from "../_components/DryerTimer";
import { CallKarlLink } from "../_components/CallKarlLink";
import { useAppState } from "../_hooks/useAppState";

// Verbatim from docs/plan.md Section 4.2.
const STEPS: string[] = [
  "Get TWO new black trash bags.",
  "Put on bedroom outfit + booties (door card).",
  "Open bedroom door, go in, close it.",
  "Pick up about a grocery-bag's worth of clothes. Don't fill the trash bag full.",
  "Put clothes in the FIRST black bag. Tie top tight.",
  "Put that bag inside the SECOND black bag. Tie that one too.",
  "Take off bedroom outfit → wall bag. Booties → wall bag.",
  "Open door. Go out. Close it.",
  "Walk straight to dryer. Don't put the bag on furniture along the way.",
  "Open dryer. Open bag at the dryer mouth. Tip clothes in. Don't reach in.",
  "Set dryer: HIGH HEAT, 45 MIN. Press START. (This first dry is what kills the bed bugs.)",
  "Take both empty bags straight to the outside trash NOW.",
  "When dryer beeps: move the clothes from the dryer into the washer. Wash on hot.",
  "When the washer is done: move the clothes back to the dryer. Set: HIGH HEAT, 45 MIN. Press START.",
  "When dryer beeps: get a clear Ziploc. Tip the hot clothes from dryer into Ziploc. Zip closed. Write today's date on it.",
  "Carry Ziploc to the living room. Put on the “CLEAN” pile.",
];

export default function LaundryFlow() {
  const router = useRouter();
  const [, setState] = useAppState();
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  function advance() {
    if (idx < STEPS.length - 1) {
      setIdx(idx + 1);
    } else {
      // Increment loads done, then redirect home with a toast in sessionStorage
      // so the home page can show it once.
      setState((prev) => ({
        laundryRunsCompleted: prev.laundryRunsCompleted + 1,
      }));
      try {
        sessionStorage.setItem(
          "bedbug.toast",
          "Load done. Go shower and put on clean clothes.",
        );
      } catch {
        // ignore
      }
      setToast("Load done.");
      // Brief pause so Mom can read the toast, then home.
      setTimeout(() => router.push("/bedbug"), 1200);
    }
  }

  const stepText = STEPS[idx];
  const stepNumber = idx + 1;
  const isDryerStep = stepNumber === 11 || stepNumber === 14;
  const isLast = stepNumber === STEPS.length;

  return (
    <div className="flex flex-col gap-4">
      <ProgressDots totalSteps={STEPS.length} currentStep={stepNumber} />
      <StepCount current={stepNumber} total={STEPS.length} />

      <StepCard
        eyebrow={`Step ${stepNumber} of ${STEPS.length}`}
        title={stepText}
        doneWhen={isLast ? "Sealed bag is on the clean pile and dryer is empty." : undefined}
      >
        {isDryerStep ? <DryerTimer /> : null}

        <BigButton onClick={advance} disabled={toast !== null}>
          {isLast ? "Done with this load" : "Done — next step"}
        </BigButton>

        {idx > 0 && !toast ? (
          <BigButton onClick={() => setIdx(idx - 1)} variant="ghost">
            Go back one step
          </BigButton>
        ) : null}

        <div className="pt-2">
          <CallKarlLink variant="ghost">Stuck — call Ben</CallKarlLink>
        </div>
      </StepCard>

      {isLast ? (
        <p className="text-center text-bedbug-body italic text-bedbug-ink/70">
          Then shower and put on clean clothes.
        </p>
      ) : null}

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg bg-bedbug-sage p-4 text-center text-bedbug-cream text-bedbug-body"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
