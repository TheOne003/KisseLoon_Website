import Link from "next/link";

export type HomeAdCreative = {
  tag: string;
  title: string;
  subtitle?: string;
  cta: string;
  image: string;
  href: string;
  tone?: "light" | "dark";
};

export function HomeAd({
  ad,
  variant,
}: {
  ad: HomeAdCreative;
  variant: "leader" | "billboard" | "leaderboard" | "mpu" | "square";
}) {
  const tone = ad.tone ?? "dark";

  return (
    <aside className={`home-ad home-ad-${variant}`} aria-label="Advertisement">
      <span className="home-ad-label">{ad.tag}</span>
      <Link href={ad.href} className={`home-ad-frame home-ad-${tone}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.image} alt="" />
        <div className="home-ad-copy">
          <strong>{ad.title}</strong>
          {ad.subtitle ? <em>{ad.subtitle}</em> : null}
          <span>{ad.cta}</span>
        </div>
      </Link>
    </aside>
  );
}
