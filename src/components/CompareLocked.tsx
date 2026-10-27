"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { usePlatforms } from "@/context/PlatformContext";
import { isCompareLockedPath, MIN_COMPARE_PLATFORMS } from "@/lib/platforms";

export function CompareLocked({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, canCompare, setConnectOpen } = usePlatforms();
  const locked = isCompareLockedPath(pathname);

  useEffect(() => {
    if (ready && locked && !canCompare) setConnectOpen(true);
  }, [ready, locked, canCompare, setConnectOpen]);

  if (ready && locked && !canCompare) {
    return (
      <div className="prose-card">
        <h2 style={{ marginTop: 0 }}>Connect two apps first</h2>
        <p>Comparison needs at least {MIN_COMPARE_PLATFORMS} connected platforms.</p>
        <button type="button" className="btn btn-primary" onClick={() => setConnectOpen(true)}>
          Connect platforms
        </button>
      </div>
    );
  }

  return children;
}
