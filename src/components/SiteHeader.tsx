"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./ProfileMenu";

const NAV = [
  { href: "/news", label: "News" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo" aria-label="Kisse Loon home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/brand/kisse-loon-brand.png" alt="Kisse Loon" />
        </Link>
        <div className="site-header-right">
          <nav className="site-nav" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className={`site-nav-link ${active ? "active" : ""}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
