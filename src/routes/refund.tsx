import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy | WeFest" },
      { name: "description", content: "Refund Policy for WeFest. Understand the rules for ticket cancellations, event postponements, and refund processes." },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <h1 className="font-display text-4xl font-bold mb-8">Refund Policy</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. General Policy</h2>
          <p>
            Tickets purchased on WeFest are generally non-refundable unless the event is cancelled or significantly rescheduled by the organizer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Event Cancellation</h2>
          <p>
            If an event is cancelled by the organizer, a full refund (minus any non-refundable convenience fees) will be automatically processed to the original payment method within 7-10 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Rescheduling</h2>
          <p>
            In the case of significant rescheduling (e.g., change of city or date by more than 48 hours), you may be eligible to request a refund within a specified window after the announcement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. User No-Show</h2>
          <p>
            Refunds will not be provided if a user fails to attend the event for any personal reason.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Dispute Resolution</h2>
          <p>
            For any ticketing disputes, please contact our support team at support@wefest.com with your transaction ID and a description of the issue.
          </p>
        </section>

        <p className="text-sm pt-8">Last updated: May 08, 2026</p>
      </div>
    </div>
  );
}
