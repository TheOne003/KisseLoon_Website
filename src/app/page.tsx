"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CompareStage } from "@/components/CompareStage";
import { HowItWorks } from "@/components/HowItWorks";
import { PlatformLogo } from "@/components/PlatformLogo";
import { SiteShell } from "@/components/SiteShell";
import { usePlatforms } from "@/context/PlatformContext";
import { searchHref, type SearchMode } from "@/lib/searchRouting";

const FOOD_PLATFORMS = [
  { id: "swiggy", name: "Swiggy" },
  { id: "zomato", name: "Zomato" },
  { id: "toing", name: "Toing" },
];

const GROCERY_PLATFORMS = [
  { id: "blinkit", name: "Blinkit" },
  { id: "zepto", name: "Zepto" },
  { id: "instamart", name: "Instamart" },
];

export default function HomePage() {
  const [mode, setMode] = useState<SearchMode>("food");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { canCompare, setConnectOpen } = usePlatforms();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canCompare) {
      setConnectOpen(true);
      return;
    }
    const value = query.trim() || (mode === "food" ? "Chicken Biryani" : "Amul Gold Milk");
    router.push(searchHref(value, mode));
  };

  return (
    <SiteShell wide>
      <div className="home-stage">
        <section className="home-hero">
          <div className="landing">
            <p className="landing-kicker">Price comparison</p>
            <h1>
              Same order.
              <span>Different price.</span>
            </h1>
            <p className="landing-line">We race food and grocery prices across delivery apps.</p>

            <form className="landing-search" onSubmit={submit}>
              <div className="landing-toggle" role="tablist" aria-label="Search type">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "food"}
                  className={mode === "food" ? "active" : ""}
                  onClick={() => setMode("food")}
                >
                  Food
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "grocery"}
                  className={mode === "grocery" ? "active" : ""}
                  onClick={() => setMode("grocery")}
                >
                  Grocery
                </button>
              </div>
              <div className="landing-search-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/icons/search.svg" alt="" className="landing-search-icon" />
                <label className="sr-only" htmlFor="home-search">
                  Search {mode}
                </label>
                <input
                  id="home-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={mode === "food" ? "Search a dish" : "Search groceries"}
                />
                <button type="submit" className="btn btn-primary">
                  Compare
                </button>
              </div>
            </form>
          </div>
          <CompareStage mode={mode} />
        </section>

        <HowItWorks />

        <section className="compare-board" aria-label="Platforms we compare">
          <p className="compare-label">We compare on</p>
          <div className="compare-spread">
            <article>
              <h2>Food</h2>
              <div className="logo-orbit">
                {FOOD_PLATFORMS.map((platform) => (
                  <Link key={platform.id} href="/food" className="logo-chip" aria-label={`Compare food on ${platform.name}`}>
                    <PlatformLogo platform={platform.id} size={64} />
                    <span>{platform.name}</span>
                  </Link>
                ))}
              </div>
            </article>
            <article>
              <h2>Grocery</h2>
              <div className="logo-orbit">
                {GROCERY_PLATFORMS.map((platform) => (
                  <Link
                    key={platform.id}
                    href="/grocery"
                    className="logo-chip"
                    aria-label={`Compare groceries on ${platform.name}`}
                  >
                    <PlatformLogo platform={platform.id} size={64} />
                    <span>{platform.name}</span>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
