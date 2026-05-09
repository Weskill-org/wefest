import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | WeFest" },
      { name: "description", content: "Terms of Service for WeFest - India's college festival ecosystem. Read about our guidelines, ticketing policies, and user responsibilities." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <h1 className="font-display text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using WeFest, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. User Eligibility</h2>
          <p>
            WeFest is primarily intended for college students, faculty, and authorized organizers. Identity verification via college email is required for full access to certain features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Ticketing and Payments</h2>
          <p>
            All tickets purchased on WeFest are subject to the specific event's rules and our Refund Policy. WeFest acts as a platform for organizers to sell tickets; the responsibility for event execution lies solely with the organizers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Prohibited Conduct</h2>
          <p>
            Users are prohibited from:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Using fake identities or unauthorized college email addresses.</li>
              <li>Reselling tickets at inflated prices (scalping).</li>
              <li>Attempting to disrupt the platform's security or integrity.</li>
              <li>Posting offensive or unauthorized content.</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
          <p>
            WeFest Technologies Pvt Ltd is not liable for any losses or damages resulting from event cancellations, personal injury at events, or platform downtime.
          </p>
        </section>

        <p className="text-sm pt-8">Last updated: May 08, 2026</p>
      </div>
    </div>
  );
}
