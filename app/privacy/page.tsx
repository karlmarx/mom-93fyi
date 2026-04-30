import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · 93.fyi",
  robots: "noindex",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12 font-[family-name:var(--font-lora)] text-ink/90 leading-relaxed">
      <h1 className="mb-6 text-2xl font-semibold">Privacy Policy</h1>

      <section className="space-y-4 text-sm">
        <p>
          <strong>Effective date:</strong> April 30, 2026
        </p>

        <p>
          This site (<strong>93.fyi</strong> and its subdomains) is a personal,
          family-use project. It is not a commercial service.
        </p>

        <h2 className="pt-2 text-base font-semibold">What we collect</h2>
        <p>
          The web app stores preferences and progress locally on your device
          using browser localStorage. No data is sent to a server, no accounts
          are created, and no cookies are set by the app itself.
        </p>
        <p>
          If you send an SMS to our phone number, your phone number and message
          content are processed by Twilio (our messaging provider) and used
          solely to reply to your question. We do not share your number with
          third parties or use it for marketing.
        </p>

        <h2 className="pt-2 text-base font-semibold">Hosting &amp; analytics</h2>
        <p>
          The site is hosted on Vercel. Vercel may collect standard web-server
          logs (IP address, user agent, timestamps). We do not run any
          additional analytics, trackers, or advertising scripts.
        </p>

        <h2 className="pt-2 text-base font-semibold">Data retention</h2>
        <p>
          LocalStorage data stays on your device until you clear it. SMS
          messages are retained by Twilio per their retention policy and in
          GitHub (as private issues) for the purpose of answering your
          questions. We do not sell or share this data.
        </p>

        <h2 className="pt-2 text-base font-semibold">Contact</h2>
        <p>
          For questions about this policy, contact the site owner directly.
        </p>
      </section>
    </main>
  );
}
