import { BigButton } from "../_components/BigButton";

export default function StoryPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          The Story
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Operation Clean Slate
        </h1>
      </header>

      <section className="flex flex-col gap-4 text-bedbug-body leading-relaxed text-bedbug-ink">
        <p>
          This plan isn&apos;t just about laundry and black cups. It&apos;s a mission called <strong>Operation Clean Slate</strong>.
        </p>
        <p>
          The mission started because we wanted a way to handle this situation that is <strong>rigorous, safe, and effective</strong>, without spending a thousand dollars on an exterminator who doesn&apos;t even do the laundry.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5">
          <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
            The Two-Zone Strategy
          </h2>
          <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
            We split the apartment into two worlds. The <strong>Bedroom</strong> is the Quarantine Zone—a holding cell where biology does the work of starving them out. The <strong>Living Room</strong> is the Clean Zone—your new base of operations where you sleep on the ZenDen mattress, floating safely away from the walls.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5">
          <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
            The Golden Rule
          </h2>
          <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
            Our mantra is simple: <strong>Heat kills, plastic contains, and time finishes the job.</strong> 45 minutes in the dryer on high heat is the &ldquo;kill step&rdquo; that makes everything safe.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5">
          <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
            The Interceptors
          </h2>
          <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
            Those six black cups under the bed legs are like our radar. Every morning, a quick look tells us the status. Empty cups are the best news we can get.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5">
          <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
            Exile
          </h2>
          <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
            Instead of chasing them with chemicals, we just close the door. Without a host, they starve. By closing the door and waiting, we let time do the heavy lifting for us.
          </p>
        </div>
      </section>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic leading-relaxed text-bedbug-ink">
        This is a son-protecting-mom story. It&apos;s told through one load of laundry at a time, 9 AM check-in calls, and keeping everything sealed tight. We&apos;ve got this.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
