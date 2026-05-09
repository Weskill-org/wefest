import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | WeFest" },
      { name: "description", content: "Cookie Policy for WeFest. Learn how we use cookies and similar technologies to improve your event discovery experience." },
    ],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <h1 className="font-display text-4xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. What are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device that help us provide a better experience by remembering your preferences and login state.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Essential Cookies</h2>
          <p>
            These are necessary for the platform to function. They handle authentication, security, and basic navigation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Performance and Analytics</h2>
          <p>
            We use analytics cookies to understand how users interact with WeFest, helping us identify which features are popular and which need improvement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Managing Cookies</h2>
          <p>
            You can control or disable cookies through your browser settings. However, disabling essential cookies may limit your ability to use certain features of the platform.
          </p>
        </section>

        <p className="text-sm pt-8">Last updated: May 08, 2026</p>
      </div>
    </div>
  );
}
