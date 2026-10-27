"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export function BackButton({ href, onClick }: { href?: string; onClick?: () => void }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label="Go back"
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
        if (href) {
          router.push(href);
          return;
        }
        router.back();
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M10 3L5 8l5 5" stroke="#0b1c30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function CartButton() {
  const { summary } = useCart();
  return (
    <Link href="/cart" className="icon-btn" aria-label={`Cart, ${summary.totalCount} items`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 7h15l-1.5 9h-12L5 4H2"
          stroke="#0b1c30"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.4" fill="#0b1c30" />
        <circle cx="18" cy="20" r="1.4" fill="#0b1c30" />
      </svg>
      {summary.totalCount > 0 ? <span className="cart-count">{summary.totalCount}</span> : null}
    </Link>
  );
}

export function ProfileButton() {
  return (
    <Link href="/profile" className="icon-btn" aria-label="Profile">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" stroke="#0b1c30" strokeWidth="1.8" />
        <path d="M5 19c1.4-3.2 3.8-4.8 7-4.8S17.6 15.8 19 19" stroke="#0b1c30" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </Link>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  backHref,
  onBack,
  showCart = false,
  showProfile = false,
  trailing,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  showCart?: boolean;
  showProfile?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          {(backHref || onBack) && <BackButton href={backHref} onClick={onBack} />}
          <div>
            <h1 className="header-title">{title}</h1>
            {subtitle ? <p className="header-subtitle">{subtitle}</p> : null}
          </div>
        </div>
        <div className="header-actions">
          {trailing}
          {showCart ? <CartButton /> : null}
          {showProfile ? <ProfileButton /> : null}
        </div>
      </div>
    </header>
  );
}
