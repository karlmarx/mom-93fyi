"use client";

import { useState } from "react";
import { StepCard } from "../_components/StepCard";
import { BigButton } from "../_components/BigButton";
import { ProgressDots, StepCount } from "../_components/Wizard";

const STEPS = [
  {
    eyebrow: "Step 1 of 3",
    title: "Photos of the mattress",
    instruction:
      "Pull all the sheets and pillowcases off the bed. With your phone camera, take close-up pictures of the seams (the piped edges), the corners of the box spring, and inside the bed frame joints. Send them to Ben from your Messages app.",
  },
  {
    eyebrow: "Step 2 of 3",
    title: "Photos of any bites",
    instruction:
      "Take close-up photos of any bites you have. Use good light. If you can, place a coin or your finger next to a bite for size. Send them to Ben.",
  },
  {
    eyebrow: "Step 3 of 3",
    title: "Tomorrow morning: check the sheets",
    instruction:
      "When you wake up tomorrow, before getting up, look at the sheets. Any small dark dots? Any tiny bug? Take pictures and send them to Ben.",
  },
];

export default function ConfirmFlow() {
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const [current, setCurrent] = useState(0);
  const allDone = done.every(Boolean);

  if (allDone) {
    return (
      <div className="flex flex-col gap-6">
        <ProgressDots totalSteps={STEPS.length} currentStep={STEPS.length} />
        <StepCard
          eyebrow="All sent"
          title="Ben will look at the photos and tell you what's next."
          instruction="You can rest. Don't throw anything away today."
        >
          <BigButton href="/bedbug" variant="ghost">
            Back to home
          </BigButton>
        </StepCard>
      </div>
    );
  }

  const step = STEPS[current];

  function markDone() {
    setDone((prev) => prev.map((v, i) => (i === current ? true : v)));
    if (current < STEPS.length - 1) setCurrent(current + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <ProgressDots totalSteps={STEPS.length} currentStep={current + 1} />
      <StepCount current={current + 1} total={STEPS.length} />

      <StepCard eyebrow={step.eyebrow} title={step.title} instruction={step.instruction}>
        <BigButton onClick={markDone}>I sent it. Done with this step.</BigButton>
      </StepCard>
    </div>
  );
}
