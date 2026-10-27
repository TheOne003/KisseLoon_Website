import Link from "next/link";
import { HOME_AD } from "@/lib/services/adsService";

export function AdBanner() {
  return (
    <article className="ad-banner" aria-label="Advertisement">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HOME_AD.image} alt="" />
      <div className="media-scrim" />
      <div className="ad-content">
        <span className="pill" style={{ background: "rgba(0,0,0,0.35)", fontSize: 10 }}>
          {HOME_AD.tag}
        </span>
        <p className="muted" style={{ color: "#ffe7b0", margin: "10px 0 4px", fontSize: 11, letterSpacing: "0.08em" }}>
          {HOME_AD.eyebrow}
        </p>
        <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>{HOME_AD.title}</h2>
        <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.86)" }}>{HOME_AD.subtitle}</p>
        <Link href={HOME_AD.href} className="btn btn-primary" style={{ padding: "10px 14px", width: "fit-content" }}>
          {HOME_AD.cta}
        </Link>
      </div>
    </article>
  );
}
