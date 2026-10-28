"use client";

import { Suspense, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AddToCartControl } from "@/components/QuantitySelector";
import { PlatformLogo } from "@/components/PlatformLogo";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { StatusState } from "@/components/StatusState";
import { useCart } from "@/context/CartContext";
import { foodLineId } from "@/lib/cart";
import { getDemoSearchResult } from "@/lib/data/foodSearch";
import { getDemoRestaurantForCard } from "@/lib/data/restaurants";
import { cartSourceFromItems, createCartSnapshotId, createComparisonContext } from "@/lib/comparison";
import { getCartFingerprint } from "@/lib/cart";
import { saveCartSnapshot } from "@/lib/snapshot";

function Menu() {
  const params = useParams<{ restaurantId: string }>();
  const search = useSearchParams();
  const query = search.get("q") || "Chicken Biryani";
  const router = useRouter();
  const { items, addFoodItem, setQty, summary } = useCart();
  const results = getDemoSearchResult(query);
  const card = results?.restaurants.find((item) => item.id === params.restaurantId);
  const restaurant = getDemoRestaurantForCard(
    card || {
      id: params.restaurantId,
      name: "Restaurant",
      cuisine: "Indian",
      rating: "4.0",
      time: "30 min",
      platforms: ["swiggy", "zomato", "toing"],
      image: "/assets/search/biryani-by-kilo.jpg",
    },
  );
  const [category, setCategory] = useState(restaurant.categories[0]);
  const visibleMenu = useMemo(() => {
    if (category === "Popular") return restaurant.menu;
    const words = category.toLowerCase().split(/\s+/).filter(Boolean);
    return restaurant.menu.filter((item) => {
      const hay = `${item.name} ${item.tag}`.toLowerCase();
      return words.every((word) => hay.includes(word));
    });
  }, [category, restaurant.menu]);

  const restaurantLines = useMemo(
    () =>
      items.filter((item) => {
        if (item.category !== "food") return false;
        if (item.restaurantId === restaurant.id) return true;
        const productId = item.productId || String(item.id || "").replace(/^food-/, "");
        return restaurant.menu.some((dish) => dish.id === productId);
      }),
    [items, restaurant],
  );

  const footerCount = restaurantLines.reduce((sum, item) => sum + item.qty, 0);
  const footerSubtotal = restaurantLines.reduce((sum, item) => sum + item.price * item.qty, 0);
  const distinctCount = restaurantLines.length;

  const startCartCompare = () => {
    const snapshotId = createCartSnapshotId();
    saveCartSnapshot({
      snapshotId,
      fingerprint: getCartFingerprint(items),
      items: items.map((item) => ({ ...item })),
      context: createComparisonContext({
        mode: "cart",
        source: cartSourceFromItems(items),
        kind: "cart",
        itemIds: items.map((item) => item.id),
        cartSnapshotId: snapshotId,
      }),
      createdAt: Date.now(),
    });
    router.push(`/cart/orbit?play=${Date.now()}`);
  };

  if (!restaurant) {
    return <StatusState title="Restaurant unavailable" message="This restaurant could not be loaded." />;
  }

  const openItem = (itemId: string) => {
    router.push(`/food/item/${itemId}?restaurant=${restaurant.id}&q=${encodeURIComponent(query)}`);
  };

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Menu"
        title={restaurant.name}
        subtitle={`${restaurant.cuisine} · ★ ${restaurant.rating} · ${restaurant.time} · demo catalog`}
      />
      <div className="stack" style={{ paddingBottom: footerCount ? 96 : 0 }}>
        <section className="hero-banner menu-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={restaurant.heroImage} alt="" />
          <div className="media-scrim" />
          <div className="ad-content" style={{ marginTop: "auto" }}>
            {restaurant.open ? (
              <span className="pill" style={{ background: "#16a34a", color: "#fff" }}>
                OPEN NOW
              </span>
            ) : null}
            <p>
              {restaurant.area} · {restaurant.reviews} reviews
            </p>
          </div>
        </section>
        <div className="chip-row">
          {restaurant.categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${category === item ? "active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="resto-list menu-list">
          {visibleMenu.map((item) => {
            const qty = restaurantLines
              .filter((line) => (line.productId || String(line.id).replace(/^food-/, "")) === item.id)
              .reduce((sum, line) => sum + line.qty, 0);
            const best = item.platforms.find((p) => p.best) || item.platforms[0];
            return (
              <article key={item.id} className="resto-card menu-card">
                <div className="resto-media">
                  <button type="button" className="menu-photo" onClick={() => openItem(item.id)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" />
                  </button>
                  {item.tag ? <span className="resto-badge">{item.tag}</span> : null}
                </div>
                <button type="button" className="menu-main" onClick={() => openItem(item.id)}>
                  <h2>{item.name}</h2>
                  <p className="resto-cuisine">
                    {item.savingsText || (best ? `Best on ${best.label}` : "Tap for details")}
                  </p>
                  <span className={`resto-dish ${item.dietary === "VEG" ? "is-veg" : "is-nonveg"}`}>
                    {item.dietary}
                  </span>
                  <strong className="menu-price">{best ? `₹${best.price}` : "View"}</strong>
                  <div className="resto-cta">
                    <span className="resto-apps" aria-label="Available on">
                      {item.platforms.map((platform) => (
                        <PlatformLogo key={platform.id} platform={platform} size={22} />
                      ))}
                    </span>
                    <span className="resto-go">View</span>
                  </div>
                </button>
                <div className="menu-add">
                  <AddToCartControl
                    qty={qty}
                    label={`Add ${item.name} to cart`}
                    onAdd={() => addFoodItem({ item, restaurant, quantity: 1 })}
                    onIncrement={() => addFoodItem({ item, restaurant, quantity: 1 })}
                    onDecrement={() => setQty(foodLineId(item.id), qty - 1)}
                  />
                </div>
              </article>
            );
          })}
        </div>
        {!visibleMenu.length ? (
          <p className="muted">No dishes in {category} for this demo menu.</p>
        ) : null}
      </div>
      {footerCount > 0 ? (
        <div className="footer-bar">
          <div className="footer-inner">
            <div>
              <strong>
                {footerCount} item{footerCount === 1 ? "" : "s"}
              </strong>
              <div className="muted">₹{footerSubtotal} · Kisse Loon cart</div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (distinctCount >= 2 ? startCartCompare() : router.push("/cart"))}
            >
              {distinctCount >= 2 ? "Compare Cart" : "View Cart"}
            </button>
          </div>
        </div>
      ) : null}
      <span className="sr-only">{summary.totalCount} items in cart</span>
    </SiteShell>
  );
}

export default function RestaurantMenuPage() {
  return (
    <Suspense>
      <Menu />
    </Suspense>
  );
}
