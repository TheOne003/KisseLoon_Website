"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export function FloatingCart() {
  const pathname = usePathname();
  const { summary } = useCart();
  const prev = useRef(summary.totalCount);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (summary.totalCount > prev.current) {
      setPop(true);
      const timer = window.setTimeout(() => setPop(false), 700);
      prev.current = summary.totalCount;
      return () => window.clearTimeout(timer);
    }
    prev.current = summary.totalCount;
    return undefined;
  }, [summary.totalCount]);

  if (pathname === "/cart" || pathname.startsWith("/cart/") || summary.totalCount <= 0) {
    return null;
  }

  return (
    <Link href="/cart" className={`float-cart ${pop ? "pop" : ""}`} aria-label={`Cart, ${summary.totalCount} items`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/icons/cart-btn.svg" alt="" />
      <span className="cart-count">{summary.totalCount}</span>
    </Link>
  );
}
