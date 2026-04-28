"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { ProgressDots, StepCount } from "../_components/Wizard";
import { DryerTimer } from "../_components/DryerTimer";
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
  "Set dryer: HIGH HEAT, 45 MIN. Press START.",
  "Take both empty bags straight to the outside trash NOW.",
  "When dryer beeps: get a clear Ziploc. Tip hot clothes from dryer into Ziploc. Zip closed. Write today's date on it.",
  "Carry Ziploc to the living room. Put on the “CLEAN” pile.",
];

export default function LaundryFlow() {
  const router = useRouter();
  const { state, patch } = useAppState();
  const [idx, setIdx] = useState(0);

  function advance() {
    if (idx < STEPS.length - 1) {
      setIdx(idx + 1);
    } else {
      patch({ laundryRunsCompleted: state.laundryRunsCompleted + 1 });
      router.push("/bedbug?laundry=done");
    }
  }

  const stepText = STEPS[idx];
  const stepNumber = idx + 1;
  const isDryerStep = stepNumber === 11;
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

        <BigButton onClick={advance}>
          {isLast ? "Done with this load" : "Done — next step"}
        </BigButton>

        {idx > 0 ? (
          <BigButton onClick={() => setIdx(idx - 1)} variant="ghost">
            Go back one step
          </BigButton>
        ) : null}
      </StepCard>

      {isLast ? (
        <p className="text-center text-bedbug-body italic text-bedbug-ink/70">
          Then shower and put on clean clothes.
        </p>
      ) : null}
    </div>
  );
}
