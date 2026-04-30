"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { ProgressDots, StepCount } from "../_components/Wizard";
import { PhotoSlot } from "../_components/PhotoSlot";
import { CallKarlLink } from "../_components/CallKarlLink";
import { useAppState } from "../_hooks/useAppState";
import { todayISO, isOnOrAfter } from "../_lib/dates";
import { CONFIG } from "../_lib/config";

// Mattress day flow. Reflects docs/plan.md Section 2 (Thursday) and 3.2.
// Mom does this solo with the Cozy City metal platform frame (no box spring),
// the SafeNest waterproof protector, and 6 black interceptor cups.
type Step = {
  photoId?: string;
  title: string;
  instruction?: string;
  doneWhen?: string;
  // Mutates app state when this step is completed.
  effect?: "encasementOn" | "interceptorsPlaced" | "complete";
};

const STEPS: Step[] = [
  {
    photoId: "mattress-frame-parts",
    title:
      "Lay all the pieces of the bed frame out on the floor in the corner where the bed will live.",
    instruction:
      "Count the screws so you know they're all there. Don't drag the bed across the room later — build it where it'll live.",
    doneWhen: "Every piece is on the floor. Screws are counted.",
  },
  {
    title:
      "Loose-attach all the screws first. Don't tighten them all the way yet.",
    instruction:
      "If you tighten the first one all the way, the last holes won't line up. Get every screw in finger-tight, then come back to tighten.",
    doneWhen: "Every screw is started by hand.",
  },
  {
    title: "Now tighten every screw with the Allen key.",
    doneWhen: "The frame is solid. No wobble.",
  },
  {
    photoId: "mattress-on-frame",
    title: "Put the new mattress on the frame.",
    doneWhen: "The mattress is on the frame, centered.",
  },
  {
    photoId: "safenest-protector",
    title:
      "Slip the SafeNest waterproof cover over the mattress like a fitted sheet.",
    instruction:
      "Stretch the corners over each corner of the mattress. It hugs the top and sides; it doesn't zip.",
    doneWhen: "The cover is on, snug at all four corners.",
    effect: "encasementOn",
  },
  {
    photoId: "interceptors-placed",
    title:
      "Lift one leg of the bed and slide a little black plastic cup under it. Do this for all six legs.",
    instruction:
      "There are six legs. Every single one needs a cup. Take your time. Sit if you need to.",
    doneWhen: "All six legs are sitting in a black cup.",
    effect: "interceptorsPlaced",
  },
  {
    title:
      "Pull the bed at least one hand-span away from any wall.",
    doneWhen: "Nothing about the bed touches a wall.",
  },
  {
    title:
      "Make the bed with the new sheets. Tuck them. Nothing should hang to the floor.",
    doneWhen: "Bed is made. Nothing hangs to the floor.",
  },
  {
    title:
      "You're done with mattress day. Go shower and put on clean clothes from a Ziploc. Sleep here tonight.",
    doneWhen: "You're clean, in fresh clothes, and the living room is your bedroom now.",
    effect: "complete",
  },
];

export default function MattressDay() {
  const router = useRouter();
  const [state, setState] = useAppState();
  const [idx, setIdx] = useState(0);

  const today = todayISO();
  const tooEarly = !isOnOrAfter(CONFIG.MATTRESS_DELIVERY_DATE, today);

  if (tooEarly) {
    return (
      <StepCard
        eyebrow="Not today"
        title="The new mattress isn't here yet."
        instruction={`Mattress day is ${CONFIG.MATTRESS_DELIVERY_DATE}. Come back when the bed and frame arrive.`}
      >
        <BigButton href="/bedbug" variant="ghost">
          Back to home
        </BigButton>
      </StepCard>
    );
  }

  if (state.mattressDayCompleted) {
    return (
      <StepCard
        eyebrow="All done"
        title="You finished mattress day."
        instruction="The new bed is set up. The cups are placed. You're sleeping in the living room now."
      >
        <BigButton href="/bedbug" variant="ghost">
          Back to home
        </BigButton>
      </StepCard>
    );
  }

  const step = STEPS[idx];
  const stepNumber = idx + 1;
  const isLast = idx === STEPS.length - 1;

  function advance() {
    if (step.effect === "encasementOn") {
      setState({ encasementOn: true });
    } else if (step.effect === "interceptorsPlaced") {
      setState({ interceptorsPlaced: true });
    } else if (step.effect === "complete") {
      setState({
        mattressDayCompleted: true,
        cleanZoneSetupDate: todayISO(),
      });
      router.push("/bedbug");
      return;
    }
    if (idx < STEPS.length - 1) {
      setIdx(idx + 1);
    } else {
      router.push("/bedbug");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ProgressDots totalSteps={STEPS.length} currentStep={stepNumber} />
      <StepCount current={stepNumber} total={STEPS.length} />

      <StepCard
        eyebrow={`Mattress day · Step ${stepNumber}`}
        title={step.title}
        instruction={step.instruction}
        doneWhen={step.doneWhen}
      >
        {step.photoId ? (
          <PhotoSlot id={step.photoId} alt={step.title} />
        ) : null}

        <BigButton onClick={advance}>
          {isLast ? "I'm done with mattress day" : "Done — next step"}
        </BigButton>

        {idx > 0 ? (
          <BigButton onClick={() => setIdx(idx - 1)} variant="ghost">
            Go back one step
          </BigButton>
        ) : null}

        <div className="pt-2">
          <CallKarlLink variant="ghost">Stuck — call Ben</CallKarlLink>
        </div>
      </StepCard>
    </div>
  );
}
