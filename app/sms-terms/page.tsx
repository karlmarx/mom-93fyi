import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS Terms · 93.fyi",
  robots: "noindex",
};

export default function SmsTermsPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12 font-[family-name:var(--font-lora)] text-ink/90 leading-relaxed">
      <h1 className="mb-6 text-2xl font-semibold">SMS Messaging Terms</h1>

      <section className="space-y-4 text-sm">
        <p>
          This service sends SMS messages to a single, known family member who
          has given verbal consent to receive them. Messages are replies to
          questions the recipient sends first — no automated marketing, no bulk
          messaging, and no unsolicited outreach.
        </p>

        <h2 className="pt-2 text-base font-semibold">Opt-in</h2>
        <p>
          The recipient is personally informed of the phone number by the
          account holder and told they can text it at any time with questions.
          Consent is collected verbally, in person or by phone.
        </p>

        <h2 className="pt-2 text-base font-semibold">Message frequency</h2>
        <p>
          Message frequency varies. The service only replies when the recipient
          sends a question — typically a few messages per week. No recurring
          campaigns.
        </p>

        <h2 className="pt-2 text-base font-semibold">Opt-out</h2>
        <p>
          Reply <strong>STOP</strong> at any time to stop receiving messages.
          Reply <strong>HELP</strong> for assistance. Standard message and data
          rates may apply.
        </p>

        <h2 className="pt-2 text-base font-semibold">Contact</h2>
        <p>
          For questions about this service, contact the account holder directly.
        </p>
      </section>
    </main>
  );
}
