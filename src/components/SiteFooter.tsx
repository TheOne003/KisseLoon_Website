import Link from "next/link";
import { SOCIALS } from "@/lib/site";
import { SocialIcon } from "./SocialIcon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/brand/kisse-loon-wordmark.png" alt="Kisse Loon" className="footer-wordmark" />
          <p>Compare food and grocery prices across apps, then order where it costs less.</p>
          <div className="footer-socials">
            {SOCIALS.map((social) => (
              <a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}>
                <SocialIcon name={social.name} size={18} />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Explore">
          <h2>Explore</h2>
          <ul>
            <li>
              <Link href="/news">News</Link>
            </li>
            <li>
              <Link href="/features">Features</Link>
            </li>
            <li>
              <Link href="/food">Food</Link>
            </li>
            <li>
              <Link href="/grocery">Grocery</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2>Company</h2>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
            <li>
              <Link href="/contact">Contact us</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
          </ul>
        </nav>
        <div className="footer-cta">
          <p className="footer-cta-kicker">Ready?</p>
          <h2>Same order. Different price.</h2>
          <Link href="/food" className="footer-cta-link">
            Compare food
          </Link>
          <Link href="/grocery" className="footer-cta-link">
            Compare grocery
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Kisse Loon</p>
        <p>Demo prices are labeled. Order on the app that wins.</p>
      </div>
    </footer>
  );
}
