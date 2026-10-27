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
      router.push(`/ads/pre-checkout?platform=${platform.id}&name=${encodeURIComponent(platform.label || platform.name || "")}`);
      return;
    }
    setMessage(
      `${platform.label || platform.name} checkout is not configured yet. Your Kisse Loon cart was kept.`,
    );
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
      <PageHeading title={item.name} subtitle={`${restaurant.name} · quantity and add to cart only — no extra race`} />
      <div className="stack">
        <section className="hero-banner" style={{ minHeight: 220 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.detailImage} alt="" />
          <div className="media-scrim" />
        </section>
        <div>
          <span className={`tag ${item.dietary === "VEG" ? "tag-veg" : "tag-nonveg"}`}>{item.dietary}</span>
          <h2 style={{ margin: "8px 0 6px" }}>{item.name}</h2>
          <p className="muted">{item.description}</p>
          <p className="save">{item.bestPriceText}</p>
        </div>
        <div className="row space-between">
          <span>Quantity</span>
          <QuantitySelector qty={qty} onDecrement={() => setQty(Math.max(1, qty - 1))} onIncrement={() => setQty(qty + 1)} />
        </div>
        <h3 style={{ margin: 0 }}>Platform prices</h3>
        {platforms.map((platform) => {
          const fees = breakdown(platform, qty);
          const open = expanded === platform.id;
          return (
            <article key={platform.id} className="platform-card" style={{ padding: 12, position: "relative" }}>
              {platform.best ? (
                <div className="swipe-hint" style={{ background: platform.color || "#059669" }}>
                  Order on {platform.label}
                </div>
              ) : null}
              <div className="row space-between">
                <div className="row">
                  <PlatformLogo platform={platform} size={40} />
                  <div>
                    <strong>{platform.label}</strong>
                    <div className="muted">{platform.note}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="price" style={{ color: platform.best ? "var(--success)" : undefined }}>
                    ₹{(platform.price || 0) * qty}
                  </div>
                  {platform.best ? <div className="save">Best</div> : null}
                </div>
              </div>
              <div className="row space-between" style={{ marginTop: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setExpanded(open ? null : platform.id)}>
                  {open ? "Hide fees" : "Fee breakdown"}
                </button>
                <button type="button" className="btn btn-navy" onClick={() => openPlatform(platform)}>
                  Continue on {platform.label}
                </button>
              </div>
              {open ? (
                <div style={{ marginTop: 8 }}>
                  {fees.lines.map((line) => (
                    <div key={line.label} className="row space-between">
                      <span className="muted">{line.label}</span>
                      <span>₹{line.value}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
        {message ? <p className="error-text">{message}</p> : null}
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
        <p className="muted">This is Kisse Loon’s cart — not a partner platform cart. Adding a dish does not start another race.</p>
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
