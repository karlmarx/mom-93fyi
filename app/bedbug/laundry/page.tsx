"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { ProgressDots, StepCount } from "../_components/Wizard";
import { DryerTimer } from "../_components/DryerTimer";
import { useAppState } from "../_hooks/useAppState";

// Verbatim from docs/plan.md Section 4.2.
const STEPS: { text: string; photoId: string }[] = [
  { text: "Get TWO new black trash bags.", photoId: "laundry-01-bags" },
  { text: "Put on bedroom outfit + booties (door card).", photoId: "laundry-02-outfit" },
  { text: "Open bedroom door, go in, close it.", photoId: "laundry-03-door" },
  { text: "Pick up about a grocery-bag's worth of clothes. Don't fill the trash bag full.", photoId: "laundry-04-pickup" },
  { text: "Put clothes in the FIRST black bag. Tie top tight.", photoId: "laundry-05-firstbag" },
  { text: "Put that bag inside the SECOND black bag. Tie that one too.", photoId: "laundry-06-secondbag" },
  { text: "Take off bedroom outfit → wall bag. Booties → wall bag.", photoId: "laundry-07-takeoff" },
  { text: "Open door. Go out. Close it.", photoId: "laundry-08-out" },
  { text: "Walk straight to dryer. Don't put the bag on furniture along the way.", photoId: "laundry-09-walk" },
  { text: "Open dryer. Open bag at the dryer mouth. Tip clothes in. Don't reach in.", photoId: "laundry-10-load" },
  { text: "Set dryer: HIGH HEAT, 45 MIN. Press START.", photoId: "laundry-11-dryer" },
  { text: "Take both empty bags straight to the outside trash NOW.", photoId: "laundry-12-trash" },
  { text: "When dryer beeps: get a clear Ziploc. Tip hot clothes from dryer into Ziploc. Zip closed. Write today's date on it.", photoId: "laundry-13-ziploc" },
  { text: "Carry Ziploc to the living room. Put on the “CLEAN” pile.", photoId: "laundry-14-clean" },
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

  const step = STEPS[idx];
  const stepNumber = idx + 1;
  const isDryerStep = stepNumber === 11;

  return (
    <div className="flex flex-col gap-4">
      <ProgressDots totalSteps={STEPS.length} currentStep={stepNumber} />
      <StepCount current={stepNumber} total={STEPS.length} />

      <StepCard
        eyebrow={`Step ${stepNumber} of ${STEPS.length}`}
        title={step.text}
        photoSlotId={step.photoId}
        doneWhen={
          stepNumber === STEPS.length
            ? "Sealed bag is on the clean pile and dryer is empty."
            : undefined
        }
      >
        {isDryerStep ? (
          <DryerTimer onDone={() => undefined} />
        ) : null}

        <BigButton onClick={advance}>
          {stepNumber === STEPS.length ? "Done with this load" : "Done — next step"}
        </BigButton>

        {idx > 0 ? (
          <BigButton onClick={() => setIdx(idx - 1)} variant="ghost">
            Go back one step
          </BigButton>
        ) : null}
      </StepCard>

      {stepNumber === STEPS.length ? (
        <p className="text-center text-bedbug-body italic text-bedbug-ink/70">
          Then shower and put on clean clothes.
        </p>
      ) : null}
    </div>
  );
}
