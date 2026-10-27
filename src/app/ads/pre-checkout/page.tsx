"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { getCheckoutDestination } from "@/lib/services/checkoutService";
import { storageKeys, readSessionJson } from "@/lib/storage";

function PreCheckout() {
  const search = useSearchParams();
  const router = useRouter();
  const platformId = search.get("platform") || "";
  const platformName = search.get("name") || "";
  const destination = useMemo(() => {
    const intent = readSessionJson<{ id: string; name: string } | null>(storageKeys.checkoutIntent, null);
    return getCheckoutDestination({
      id: platformId || intent?.id || "",
      name: platformName || intent?.name || "This platform",
    });
  }, [platformId, platformName]);

  useEffect(() => {
    if (destination.available && destination.url) {
      window.location.assign(destination.url);
    }
  }, [destination]);

  if (destination.available && destination.url) {
    return (
      <SiteShell>
        <PageHeading title="Continuing to partner checkout" subtitle="Your Kisse Loon cart is kept." />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHeading title="Checkout unavailable" />
      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>
          {destination.platformName || platformName || "This platform"} redirect is not configured yet
        </h2>
        <p className="muted">
          Kisse Loon does not invent partner checkout links. Your cart was kept. Connect a validated HTTPS destination
          in checkoutService.ts to complete this step.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => router.push("/cart")}>
          Back to Kisse Loon cart
        </button>
      </div>
    </SiteShell>
  );
}

export default function PreCheckoutPage() {
  return (
    <Suspense>
      <PreCheckout />
    </Suspense>
  );
}
