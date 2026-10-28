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
  const onHome = pathname === "/";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-left">
          <Link href="/" className={`site-home-btn ${onHome ? "active" : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Home
          </Link>
        </div>
        <div className="site-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/brand/kisse-loon-brand.png" alt="Kisse Loon" />
        </div>
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
