"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PlatformLogo } from "@/components/PlatformLogo";
import { QuantitySelector } from "@/components/QuantitySelector";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { StatusState } from "@/components/StatusState";
import { useCart } from "@/context/CartContext";
import { getDemoSearchResult } from "@/lib/data/foodSearch";
import { getDemoRestaurantForCard } from "@/lib/data/restaurants";
import { getCheckoutDestination } from "@/lib/services/checkoutService";
import { storageKeys, writeSessionJson } from "@/lib/storage";
import type { PlatformPrice } from "@/lib/types";

function breakdown(platform: PlatformPrice, quantity: number) {
  const unit = Number(platform.price) || 0;
  const qty = Math.max(1, quantity);
  const freeDelivery = /free delivery/i.test(platform.note || "");
  const deliveryUnit = freeDelivery ? 0 : Math.min(29, Math.round(unit * 0.08));
  const packagingUnit = Math.min(18, Math.max(5, Math.round(unit * 0.04)));
  const taxesUnit = Math.max(0, Math.round(unit * 0.05));
  const itemUnit = Math.max(0, unit - packagingUnit - taxesUnit - deliveryUnit);
  return {
    lines: [
      { label: "Item", value: itemUnit * qty },
      { label: "Packaging", value: packagingUnit * qty },
      { label: "Delivery", value: deliveryUnit * qty },
      { label: "Taxes", value: taxesUnit * qty },
    ],
    payable: unit * qty,
  };
}

function ItemDetail() {
  const params = useParams<{ itemId: string }>();
  const search = useSearchParams();
  const restaurantId = search.get("restaurant") || "biryani-by-kilo";
  const query = search.get("q") || "Chicken Biryani";
  const results = getDemoSearchResult(query);
  const card = results?.restaurants.find((item) => item.id === restaurantId);
  const restaurant = getDemoRestaurantForCard(
    card || {
      id: restaurantId,
      name: "Restaurant",
      cuisine: "Indian",
      rating: "4.0",
      time: "30 min",
      platforms: ["swiggy", "zomato", "toing"],
      image: "/assets/search/biryani-by-kilo.jpg",
    },
  );
  const item = restaurant.menu.find((entry) => entry.id === params.itemId);
  const { addFoodItem } = useCart();
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const platforms = item?.platforms || [];

  const openPlatform = (platform: PlatformPrice) => {
    const dest = getCheckoutDestination({
      id: platform.id,
      name: platform.label || platform.name || platform.id,
      checkoutUrl: platform.checkoutUrl,
    });
    writeSessionJson(storageKeys.checkoutIntent, {
      id: platform.id,
      name: platform.label || platform.name,
    });
    if (dest.available && dest.url) {
      router.push(
        `/ads/pre-checkout?platform=${platform.id}&name=${encodeURIComponent(platform.label || platform.name || "")}`,
      );
      return;
    }
    setMessage(`${platform.label || platform.name} checkout is not configured yet. Your Kisse Loon cart was kept.`);
  };

  if (!item) {
    return (
      <SiteShell>
        <PageHeading title="Item" />
        <StatusState title="Item unavailable" message="This dish is not in the demo menu." />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHeading eyebrow="Dish" title={item.name} subtitle={`${restaurant.name} · demo prices`} />
      <div className="item-layout">
        <section className="item-panel">
          <div className="item-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.detailImage || item.image} alt="" />
            {item.tag ? <span className="resto-badge">{item.tag}</span> : null}
          </div>
          <span className={`tag ${item.dietary === "VEG" ? "tag-veg" : "tag-nonveg"}`}>{item.dietary}</span>
          <p className="item-restaurant">{restaurant.name}</p>
          <p className="item-copy">{item.description}</p>
          {item.bestPriceText ? <p className="save">{item.bestPriceText}</p> : null}
          <div className="item-qty">
            <span>Quantity</span>
            <QuantitySelector
              qty={qty}
              onDecrement={() => setQty(Math.max(1, qty - 1))}
              onIncrement={() => setQty(qty + 1)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => {
              addFoodItem({ item, restaurant, quantity: qty });
              router.push(`/food/menu/${restaurant.id}?q=${encodeURIComponent(query)}`);
            }}
          >
            Add to Cart
          </button>
          <p className="muted item-note">
            This is Kisse Loon’s cart — not a partner platform cart. Adding a dish does not start another race.
          </p>
        </section>

        <section className="item-platforms" aria-label="Platform prices">
          <div className="item-platforms-head">
            <h2>Compare platforms</h2>
            <span className="demo-badge">Demo prices</span>
          </div>
          {platforms.map((platform) => {
            const fees = breakdown(platform, qty);
            const open = expanded === platform.id;
            const label = platform.label || platform.name || platform.id;
            return (
              <article key={platform.id} className={`item-platform ${platform.best ? "best" : ""}`}>
                <div className="item-platform-top">
                  <div className="item-platform-brand">
                    <PlatformLogo platform={platform} size={44} />
                    <div>
                      <strong>{label}</strong>
                      <p>{platform.note}</p>
                    </div>
                  </div>
                  <div className="item-platform-price">
                    <b>₹{fees.payable}</b>
                    {platform.best ? <span>Best</span> : null}
                  </div>
                </div>
                {open ? (
                  <ul className="item-fees">
                    {fees.lines.map((line) => (
                      <li key={line.label}>
                        <span>{line.label}</span>
                        <strong>₹{line.value}</strong>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="item-platform-actions">
                  <button type="button" className="item-fee-btn" onClick={() => setExpanded(open ? null : platform.id)}>
                    {open ? "Hide fees" : "Fee breakdown"}
                  </button>
                  <button
                    type="button"
                    className={`btn item-go ${platform.best ? "btn-primary" : "btn-navy"}`}
                    onClick={() => openPlatform(platform)}
                  >
                    Continue on {label}
                  </button>
                </div>
              </article>
            );
          })}
          {message ? <p className="error-text">{message}</p> : null}
        </section>
      </div>
    </SiteShell>
  );
}

export default function FoodItemPage() {
  return (
    <Suspense>
      <ItemDetail />
    </Suspense>
  );
}
