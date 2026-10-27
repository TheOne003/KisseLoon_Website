"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LocationControl } from "@/components/LocationSheet";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { StatusState } from "@/components/StatusState";
import { usePlatforms } from "@/context/PlatformContext";
import { useSession } from "@/context/SessionContext";
import { POPULAR_DISHES, getDemoSearchResult } from "@/lib/data/foodSearch";

function FoodBrowse() {
  const search = useSearchParams();
  const initial = search.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [empty, setEmpty] = useState(initial && !getDemoSearchResult(initial) ? initial : "");
  const router = useRouter();
  const { location } = useSession();
  const { canCompare, setConnectOpen } = usePlatforms();
  const displayLocation = location === "Ghaziabad" ? "Koramangala, Bengaluru" : location;

  const submit = (value = query) => {
    if (!canCompare) {
      setConnectOpen(true);
      return;
    }
    const result = getDemoSearchResult(value);
    if (result) {
      router.push(`/food/results?q=${encodeURIComponent(result.query)}`);
      return;
    }
    setEmpty(value.trim() || "that dish");
  };

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Food"
        title="Compare restaurant prices"
        subtitle="Search a dish, choose a restaurant, then the restaurant-level race plays before the menu."
      />
      <div className="stack">
        <LocationControl />
        <form
          className="search-bar"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            submit();
          }}
        >
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setEmpty("");
            }}
            placeholder="Search a dish, e.g. Chicken Biryani"
            aria-label="Search food"
          />
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 14px" }}>
            Search
          </button>
        </form>
        {empty ? (
          <StatusState
            title={`No restaurants for “${empty}”`}
            message="This demo food catalog currently includes Chicken Biryani. Grocery search lives in Grocery."
          />
        ) : null}
        <section className="hero-banner" style={{ minHeight: 180 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/food/explore-banner.jpg" alt="" />
          <div className="media-scrim" />
          <div className="ad-content">
            <p style={{ margin: 0, letterSpacing: "0.08em", fontSize: 11 }}>NEAR {displayLocation.toUpperCase()}</p>
            <h2 style={{ margin: "6px 0 0" }}>Popular dishes from the demo catalog</h2>
          </div>
        </section>
        <div className="preview-grid">
          {POPULAR_DISHES.map((dish) => (
            <button key={dish.id} type="button" className="preview-card" onClick={() => submit(dish.name)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dish.image} alt="" />
              <div>
                <strong>{dish.name}</strong>
                <p>
                  {dish.platforms} · {dish.price}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

export default function FoodPage() {
  return (
    <Suspense>
      <FoodBrowse />
    </Suspense>
  );
}
