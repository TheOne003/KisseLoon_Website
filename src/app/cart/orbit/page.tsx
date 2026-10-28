"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HomeAd } from "@/components/HomeAd";
import { OrbitAnimation } from "@/components/OrbitAnimation";
import { SiteShell } from "@/components/SiteShell";
import { StatusState } from "@/components/StatusState";
import { ORBIT_AD } from "@/lib/services/adsService";
import { useCart } from "@/context/CartContext";
import { getCartFingerprint } from "@/lib/cart";
import { cartSourceFromItems, createCartSnapshotId, createComparisonContext } from "@/lib/comparison";
import { CART_ORBIT_COPY } from "@/lib/data/orbit";
import { compareCart } from "@/lib/services/comparisonService";
import { readCartSnapshot, saveCartSnapshot } from "@/lib/snapshot";
import type { CartLine } from "@/lib/types";

function Orbit() {
  const search = useSearchParams();
  const play = search.get("play") || "1";
  const router = useRouter();
  const { items } = useCart();
  const [basket, setBasket] = useState<CartLine[]>([]);
  const navigated = useRef(false);

  useEffect(() => {
    navigated.current = false;
    const snapshot = readCartSnapshot();
    if (snapshot?.items?.length) {
      setBasket(snapshot.items);
      return;
    }
    if (items.length) {
      const snapshotId = createCartSnapshotId();
      const record = {
        snapshotId,
        fingerprint: getCartFingerprint(items),
        items: items.map((item) => ({ ...item })),
        context: createComparisonContext({
          mode: "cart" as const,
          source: cartSourceFromItems(items),
          kind: "cart" as const,
          itemIds: items.map((item) => item.id),
          cartSnapshotId: snapshotId,
        }),
        createdAt: Date.now(),
      };
      saveCartSnapshot(record);
      setBasket(record.items);
    }
  }, [play, items]);

  const comparison = useMemo(() => compareCart(basket), [basket]);
  const variant = basket.some((i) => i.category === "food") && !basket.some((i) => i.category === "grocery")
    ? "food"
    : basket.some((i) => i.category === "grocery") && !basket.some((i) => i.category === "food")
      ? "grocery"
      : "mixed";

  const finish = () => {
    if (navigated.current) return;
    navigated.current = true;
    if (!comparison.ok) {
      router.replace("/cart");
      return;
    }
    router.replace("/cart/platforms");
  };

  if (!basket.length) {
    return (
      <SiteShell>
        <HomeAd ad={ORBIT_AD} variant="leaderboard" />
        <StatusState
          title="Nothing to compare"
          message="Add items to the Kisse Loon cart first."
          action={
            <button type="button" className="btn btn-primary" onClick={() => router.push("/cart")}>
              Back to cart
            </button>
          }
        />
      </SiteShell>
    );
  }

  return (
    <OrbitAnimation
      items={basket}
      copy={CART_ORBIT_COPY}
      sessionKey={play}
      variant={variant}
      backHref="/cart"
      onFinished={finish}
    />
  );
}

export default function CartOrbitPage() {
  return (
    <Suspense>
      <Orbit />
    </Suspense>
  );
}
