"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HomeAd } from "@/components/HomeAd";
import { PlatformLogo } from "@/components/PlatformLogo";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { SEARCH_AD } from "@/lib/services/adsService";
import { StatusState } from "@/components/StatusState";
import { getDemoSearchResult } from "@/lib/data/foodSearch";
import type { RestaurantCard } from "@/lib/types";

const FILTERS = [
  { id: "sort", label: "Sort" },
  { id: "rating", label: "Rating 4.0+" },
  { id: "time", label: "Delivery Time" },
];

function timeStart(value: string) {
  const minutes = parseInt(value.replace(/\D/g, " ").trim(), 10);
  return Number.isFinite(minutes) ? minutes : 99;
}

function RestaurantCardView({
  restaurant,
  dishLabel,
  badge,
  onSelect,
}: {
  restaurant: RestaurantCard;
  dishLabel: string;
  badge?: string;
  onSelect: () => void;
}) {
  return (
    <button type="button" className="resto-card" onClick={onSelect}>
      <div className="resto-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={restaurant.image} alt="" />
        {badge ? <span className="resto-badge">{badge}</span> : null}
        <span className="resto-time">{restaurant.time}</span>
      </div>
      <div className="resto-body">
        <div className="resto-top">
          <h2>{restaurant.name}</h2>
          <span className="resto-rating">★ {restaurant.rating}</span>
        </div>
        <p className="resto-cuisine">{restaurant.cuisine}</p>
        <div className="resto-foot">
          <span className="resto-dish">{dishLabel}</span>
          <div className="resto-cta">
            <span className="resto-apps" aria-label="Available on">
              {restaurant.platforms.map((platform) => (
                <PlatformLogo key={platform} platform={platform} size={22} />
              ))}
            </span>
            <span className="resto-go">Compare</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function Results() {
  const search = useSearchParams();
  const query = search.get("q") || "Chicken Biryani";
  const result = getDemoSearchResult(query);
  const [filter, setFilter] = useState("sort");
  const router = useRouter();

  const ranked = useMemo(() => {
    if (!result) return [];
    const list = [...result.restaurants];
    if (filter === "rating") {
      return list.filter((item) => Number(item.rating) >= 4).sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    if (filter === "time") {
      return list.sort((a, b) => timeStart(a.time) - timeStart(b.time));
    }
    return list;
  }, [filter, result]);

  const topRatedId = useMemo(() => {
    if (!result?.restaurants.length) return "";
    return [...result.restaurants].sort((a, b) => Number(b.rating) - Number(a.rating))[0]?.id || "";
  }, [result]);

  const fastestId = useMemo(() => {
    if (!result?.restaurants.length) return "";
    return [...result.restaurants].sort((a, b) => timeStart(a.time) - timeStart(b.time))[0]?.id || "";
  }, [result]);

  if (!result) {
    return (
      <SiteShell>
        <PageHeading title={query} subtitle="Restaurant results" />
        <HomeAd ad={SEARCH_AD} variant="square" />
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
      <PageHeading
        eyebrow="Restaurants"
        title={result.query}
        subtitle={`${result.restaurants.length} places · ${result.location} · demo catalog`}
      />
      <div className="stack resto-results">
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
        <div className="resto-list">
          {ranked.map((restaurant) => (
            <RestaurantCardView
              key={restaurant.id}
              restaurant={restaurant}
              dishLabel={result.query}
              badge={
                restaurant.id === topRatedId
                  ? "Top rated"
                  : restaurant.id === fastestId
                    ? "Fastest"
                    : undefined
              }
              onSelect={() =>
                router.push(
                  `/food/race/${restaurant.id}?q=${encodeURIComponent(result.query)}&play=${Date.now()}`,
                )
              }
            />
          ))}
          <HomeAd ad={SEARCH_AD} variant="square" />
        </div>
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
