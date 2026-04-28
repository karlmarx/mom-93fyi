"use client";

type Props = {
  totalSteps: number;
  currentStep: number;
};

export function ProgressDots({ totalSteps, currentStep }: Props) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
      className="mx-auto flex w-full max-w-xl items-center justify-center gap-2 py-3"
    >
      {Array.from({ length: totalSteps }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= currentStep;
        return (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition-colors ${
              filled ? "bg-bedbug-sage" : "bg-bedbug-ink/15"
            }`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export function StepCount({ current, total }: { current: number; total: number }) {
  return (
    <p className="text-center text-bedbug-ink/60 text-base">
      Step {current} of {total}
    </p>
  );
}
