import { SiteShell, PageHeading } from "@/components/SiteShell";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <PageHeading eyebrow="Policy" title="Privacy" />
      <div className="prose-card">
        <p>
          This website stores your cart and optional profile on this device using browser storage. We do not sell that
          information.
        </p>
        <p>
          Signing in is optional. If you use the demo sign-in, the phone number you enter stays in local storage on
          this browser.
        </p>
        <p>
          Food and grocery catalogs shown here are demo comparison data. They are not live partner prices, and we do
          not collect payment details on Kisse Loon.
        </p>
        <p>If you continue on a delivery app, that app’s own privacy policy applies to the order.</p>
      </div>
    </SiteShell>
  );
}
