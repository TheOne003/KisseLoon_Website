"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CompareStage } from "@/components/CompareStage";
import { HomeAd } from "@/components/HomeAd";
import { HowItWorks } from "@/components/HowItWorks";
import { PlatformLogo } from "@/components/PlatformLogo";
import { SiteShell } from "@/components/SiteShell";
import { HOME_HERO_AD, HOME_MID_AD } from "@/lib/services/adsService";
import { usePlatforms } from "@/context/PlatformContext";
import { searchHref, suggestSearchItems, type SearchMode, type SearchSuggestion } from "@/lib/searchRouting";

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
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { canCompare, setConnectOpen } = usePlatforms();
  const suggestions = useMemo(() => suggestSearchItems(query, mode), [query, mode]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [open]);

  const go = (href: string) => {
    if (!canCompare) {
      setConnectOpen(true);
      return;
    }
    setOpen(false);
    router.push(href);
  };

  const pick = (item: SearchSuggestion) => {
    setQuery(item.name);
    go(item.href);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const exact = suggestions.find((item) => item.name.toLowerCase() === query.trim().toLowerCase());
    const match = exact || (suggestions.length === 1 ? suggestions[0] : null);
    if (match) {
      pick(match);
      return;
    }
    if (!canCompare) {
      setConnectOpen(true);
      return;
    }
    const value = query.trim() || (mode === "food" ? "Chicken Biryani" : "Amul Gold Milk");
    setOpen(false);
    router.push(searchHref(value, mode));
  };

  return (
    <SiteShell wide>
      <div className="home-stage">
        <HomeAd ad={HOME_HERO_AD} variant="leader" />
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
              <div className="landing-search-wrap" ref={searchRef}>
                <div className="landing-search-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/icons/search.svg" alt="" className="landing-search-icon" />
                  <label className="sr-only" htmlFor="home-search">
                    Search {mode}
                  </label>
                  <input
                    id="home-search"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="home-suggest"
                    aria-autocomplete="list"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder={mode === "food" ? "Search a dish" : "Search groceries"}
                  />
                  <button type="submit" className="btn btn-primary">
                    Compare
                  </button>
                </div>
                {open ? (
                  <ul className="landing-suggest" id="home-suggest" role="listbox">
                    {suggestions.length ? (
                      suggestions.map((item) => (
                        <li key={item.id} role="option" aria-selected="false">
                          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => pick(item)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt="" />
                            <span>
                              <strong>{item.name}</strong>
                              <em>{item.subtitle}</em>
                            </span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="landing-suggest-empty">No matching items. Try another name.</li>
                    )}
                  </ul>
                ) : null}
              </div>
            </form>
          </div>
          <CompareStage mode={mode} />
        </section>

        <HowItWorks />

        <HomeAd ad={HOME_MID_AD} variant="billboard" />

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
