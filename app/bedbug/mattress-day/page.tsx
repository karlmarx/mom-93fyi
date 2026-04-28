"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { ProgressDots, StepCount } from "../_components/Wizard";
import { useAppState } from "../_hooks/useAppState";
import { CONFIG } from "../_lib/config";
import { todayISO, isOnOrAfter } from "../_lib/dates";

type AppStatePatch = {
  encasementOn?: boolean;
  interceptorsPlaced?: boolean;
  mattressDayCompleted?: boolean;
  cleanZoneSetupDate?: string | null;
};

const STEPS: { text: string; photoId: string; patch?: AppStatePatch }[] = [
  {
    text: "Helper is here. Old mattress wrapped, marked, taken outside.",
    photoId: "mattress-01-helper",
  },
  {
    text: "New mattress is in the living room.",
    photoId: "mattress-02-newmattress",
  },
  {
    text: "Put the white zip-up cover on the new mattress. Zip it all the way closed.",
    photoId: "mattress-03-encasement",
    patch: { encasementOn: true },
  },
  {
    text: "Put the white box spring cover on the box spring. Zip it closed.",
    photoId: "mattress-04-boxspring",
  },
  {
    text: "Helper lifts each leg of the bed; you slide one little white plastic cup under each leg.",
    photoId: "mattress-05-cups",
    patch: { interceptorsPlaced: true },
  },
  {
    text: "Pull the bed at least one hand-span away from any wall.",
    photoId: "mattress-06-pullaway",
  },
  {
    text: "Make the bed with sheets. Tuck them. Nothing should hang to the floor.",
    photoId: "mattress-07-sheets",
  },
  {
    text: "You're done with mattress day. Go shower and put on clean clothes from a Ziploc. Sleep here tonight.",
    photoId: "mattress-08-done",
  },
];

export default function MattressDayFlow() {
  const router = useRouter();
  const { state, patch } = useAppState();
  const today = todayISO();
  const [idx, setIdx] = useState(0);

  const tooEarly = !isOnOrAfter(CONFIG.MATTRESS_DELIVERY_DATE, today);
  const alreadyDone = state.mattressDayCompleted;

  if (tooEarly) {
    return (
      <StepCard
        eyebrow="Not yet"
        title="The new mattress isn't here until Thursday."
        instruction={`Mattress day is ${CONFIG.MATTRESS_DELIVERY_DATE}. Come back then.`}
      >
        <BigButton href="/bedbug" variant="ghost">
          Back to home
        </BigButton>
      </StepCard>
    );
  }

  if (alreadyDone) {
    return (
      <StepCard
        eyebrow="Already done"
        title="Mattress day is finished."
        instruction="Living room is your home base now. Sleep here. Use the daily check-in each morning."
      >
        <BigButton href="/bedbug" variant="ghost">
          Back to home
        </BigButton>
      </StepCard>
    );
  }

  const step = STEPS[idx];
  const stepNumber = idx + 1;
  const isLast = stepNumber === STEPS.length;

  function advance() {
    if (step.patch) patch(step.patch);
    if (isLast) {
      patch({ mattressDayCompleted: true, cleanZoneSetupDate: todayISO() });
      router.push("/bedbug");
      return;
    }
    setIdx(idx + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <ProgressDots totalSteps={STEPS.length} currentStep={stepNumber} />
      <StepCount current={stepNumber} total={STEPS.length} />

      <StepCard
        eyebrow={`Step ${stepNumber} of ${STEPS.length}`}
        title={step.text}
        photoSlotId={step.photoId}
      >
        <BigButton onClick={advance}>{isLast ? "All done with mattress day" : "Done — next step"}</BigButton>
        {idx > 0 ? (
          <BigButton onClick={() => setIdx(idx - 1)} variant="ghost">
            Go back one step
          </BigButton>
        ) : null}
      </StepCard>
    </div>
  );
}
