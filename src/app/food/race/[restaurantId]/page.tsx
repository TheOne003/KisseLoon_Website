"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { RaceAnimation } from "@/components/RaceAnimation";
import { StatusState } from "@/components/StatusState";
import { getDemoSearchResult } from "@/lib/data/foodSearch";
import { getDemoRestaurantForCard } from "@/lib/data/restaurants";
import { compareRestaurantMenu } from "@/lib/services/comparisonService";

function Race() {
  const params = useParams<{ restaurantId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const query = search.get("q") || "Chicken Biryani";
  const play = search.get("play") || "1";
  const results = getDemoSearchResult(query);
  const restaurant = useMemo(() => {
    const card = results?.restaurants.find((item) => item.id === params.restaurantId) || {
      id: params.restaurantId,
      name: params.restaurantId,
      cuisine: "Restaurant",
      rating: "4.0",
      time: "30 min",
      platforms: ["swiggy", "zomato", "toing"],
      image: "/assets/search/biryani-by-kilo.jpg",
    };
    return getDemoRestaurantForCard(card);
  }, [results, params.restaurantId]);
  const comparison = useMemo(() => compareRestaurantMenu(restaurant), [restaurant]);
  const navigated = useRef(false);
  const gen = useRef(play);
  gen.current = play;

  useEffect(() => {
    navigated.current = false;
  }, [play, params.restaurantId]);

  const goMenu = () => {
    if (navigated.current) return;
    if (gen.current !== play) return;
    navigated.current = true;
    router.replace(`/food/menu/${restaurant.id}?q=${encodeURIComponent(query)}`);
  };

  if (!comparison.ok || !comparison.race) {
    return (
      <div className="screen">
        <div className="screen-body">
          <StatusState
            title="Comparison unavailable"
            message={comparison.error || "Not enough platform prices for this restaurant."}
            action={
              <button type="button" className="btn btn-primary" onClick={goMenu}>
                Open menu anyway
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <RaceAnimation
      race={comparison.race}
      location={results?.location}
      sessionKey={`${params.restaurantId}-${play}`}
      backHref={`/food/results?q=${encodeURIComponent(query)}`}
      onFinished={goMenu}
    />
  );
}

export default function RestaurantRacePage() {
  return (
    <Suspense>
      <Race />
    </Suspense>
  );
}
