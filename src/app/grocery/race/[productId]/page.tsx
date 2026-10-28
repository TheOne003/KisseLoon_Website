"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { RaceAnimation } from "@/components/RaceAnimation";
import { SiteShell } from "@/components/SiteShell";
import { StatusState } from "@/components/StatusState";
import { getDemoGroceryProduct } from "@/lib/data/groceryCatalog";
import { compareGroceryProduct } from "@/lib/services/comparisonService";

function Race() {
  const params = useParams<{ productId: string }>();
  const search = useSearchParams();
  const query = search.get("q") || "Amul Gold Milk";
  const play = search.get("play") || "1";
  const router = useRouter();
  const product = useMemo(() => getDemoGroceryProduct({ id: params.productId }), [params.productId]);
  const comparison = useMemo(() => compareGroceryProduct(product), [product]);
  const navigated = useRef(false);

  useEffect(() => {
    navigated.current = false;
  }, [play, params.productId]);

  const goProduct = () => {
    if (navigated.current) return;
    navigated.current = true;
    router.replace(`/grocery/product/${product.id}?q=${encodeURIComponent(query)}`);
  };

  if (!comparison.ok || !comparison.race) {
    return (
      <SiteShell>
        <StatusState
          title="Comparison unavailable"
          message={comparison.error || "Not enough grocery platform prices."}
          action={
            <button type="button" className="btn btn-primary" onClick={goProduct}>
              Open product
            </button>
          }
        />
      </SiteShell>
    );
  }

  return (
    <RaceAnimation
      race={comparison.race}
      location="Grocery comparison"
      sessionKey={`${params.productId}-${play}`}
      backHref={`/grocery/results?q=${encodeURIComponent(query)}`}
      onFinished={goProduct}
    />
  );
}

export default function GroceryRacePage() {
  return (
    <Suspense>
      <Race />
    </Suspense>
  );
}
