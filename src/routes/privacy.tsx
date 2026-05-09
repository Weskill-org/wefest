import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | WeFest" },
      { name: "description", content: "Privacy Policy for WeFest. Learn how we handle student data, identity protection, and our commitment to user privacy." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <h1 className="font-display text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Data Collection</h2>
          <p>
            We collect information that you provide directly to us, including your name, college email address, profile picture, and payment information. We also collect usage data to improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Use of Information</h2>
          <p>
            Your data is used to:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Verify your college student identity.</li>
              <li>Process ticket purchases and registrations.</li>
              <li>Personalize event recommendations.</li>
              <li>Communicate important updates about events you are attending.</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Data Sharing</h2>
          <p>
            We share your name and email with organizers of events for which you have purchased tickets for check-in purposes. We do not sell your personal data to third-party advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Security</h2>
          <p>
            We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You can manage most of your data through your profile settings.
          </p>
        </section>

        <p className="text-sm pt-8">Last updated: May 08, 2026</p>
      </div>
    </div>
  );
}
