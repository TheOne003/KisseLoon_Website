"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlatformLogo } from "@/components/PlatformLogo";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { StatusState } from "@/components/StatusState";
import { getDemoSearchResult } from "@/lib/data/foodSearch";
import type { RestaurantCard } from "@/lib/types";

const FILTERS = [
  { id: "sort", label: "Sort" },
  { id: "rating", label: "Rating 4.0+" },
  { id: "time", label: "Delivery Time" },
];

function RestaurantCardView({
  restaurant,
  dishLabel,
  onSelect,
}: {
  restaurant: RestaurantCard;
  dishLabel: string;
  onSelect: () => void;
}) {
  return (
    <button type="button" className="resto-card" onClick={onSelect}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={restaurant.image} alt="" />
      <div className="resto-body">
        <strong>{restaurant.name}</strong>
        <p className="muted" style={{ margin: "4px 0" }}>
          {restaurant.cuisine} · ★ {restaurant.rating}
        </p>
        <p className="muted" style={{ margin: "0 0 8px" }}>
          {restaurant.time}
        </p>
        <div className="row">
          <span className="muted" style={{ fontSize: 12 }}>
            Available on
          </span>
          <div className="platform-logos">
            {restaurant.platforms.map((platform) => (
              <PlatformLogo key={platform} platform={platform} size={22} />
            ))}
          </div>
        </div>
        <div className="row space-between" style={{ marginTop: 8 }}>
          <span className="pill" style={{ background: "#e8f8ef", color: "#166534" }}>
            {dishLabel} available
          </span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>View restaurant →</span>
        </div>
      </div>
    </button>
  );
}

function Results() {
  const search = useSearchParams();
  const query = search.get("q") || "Chicken Biryani";
  const result = getDemoSearchResult(query);
  const [filter, setFilter] = useState("time");
  const router = useRouter();

  if (!result) {
    return (
      <SiteShell>
        <PageHeading title={query} subtitle="Restaurant results" />
        <StatusState
          title="No restaurant results"
          message="Food search in this demo only returns restaurants for Chicken Biryani."
          action={
            <button type="button" className="btn btn-primary" onClick={() => router.push("/food")}>
              Back to food search
            </button>
          }
        />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHeading title={result.query} subtitle={`${result.location} · demo restaurant catalog`} />
      <div className="stack">
        <div className="chip-row">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip ${filter === item.id ? "active" : ""}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {result.restaurants.map((restaurant) => (
          <RestaurantCardView
            key={restaurant.id}
            restaurant={restaurant}
            dishLabel={result.query}
            onSelect={() =>
              router.push(
                `/food/race/${restaurant.id}?q=${encodeURIComponent(result.query)}&play=${Date.now()}`,
              )
            }
          />
        ))}
      </div>
    </SiteShell>
  );
}

export default function RestaurantResultsPage() {
  return (
    <Suspense>
      <Results />
    </Suspense>
  );
}
