import type { ReactNode } from "react";
import { CompareLocked } from "./CompareLocked";
import { ConnectPlatformsModal } from "./ConnectPlatformsModal";
import { FloatingCart } from "./FloatingCart";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="site">
      <SiteHeader />
      <main className={wide ? "site-main site-main-wide" : "site-main"}>
        <CompareLocked>{children}</CompareLocked>
      </main>
      <SiteFooter />
      <FloatingCart />
      <ConnectPlatformsModal />
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="page-heading">
      {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {subtitle ? <p className="muted">{subtitle}</p> : null}
    </header>
  );
}
