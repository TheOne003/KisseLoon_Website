import { SiteShell, PageHeading } from "@/components/SiteShell";

export default function CareersPage() {
  return (
    <SiteShell>
      <PageHeading eyebrow="Careers" title="Build the comparison layer for everyday orders." />
      <div className="prose-card">
        <p>
          Kisse Loon is for people who care about a cleaner way to choose food and grocery delivery — less guesswork,
          more honest comparison.
        </p>
        <p>No open roles are listed right now. When we hire, they will appear on this page.</p>
      </div>
    </SiteShell>
  );
}
