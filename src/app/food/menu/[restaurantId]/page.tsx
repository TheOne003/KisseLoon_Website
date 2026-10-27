"use client";

import { Suspense, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AddToCartControl } from "@/components/QuantitySelector";
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

  return (
    <SiteShell>
      <PageHeading title={restaurant.name} subtitle={`${restaurant.area} · add multiple dishes before comparing the cart`} />
      <div className="stack" style={{ paddingBottom: footerCount ? 96 : 0 }}>
        <section className="hero-banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={restaurant.heroImage} alt="" />
          <div className="media-scrim" />
          <div className="ad-content" style={{ marginTop: "auto" }}>
            {restaurant.open ? (
              <span className="pill" style={{ background: "#16a34a", color: "#fff" }}>
                OPEN NOW
              </span>
            ) : null}
            <h2 style={{ margin: "10px 0 4px" }}>{restaurant.name}</h2>
            <p>
              {restaurant.cuisine} • ★ {restaurant.rating} ({restaurant.reviews}) • {restaurant.time}
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
        {restaurant.menu.map((item) => {
          const qty = restaurantLines
            .filter((line) => (line.productId || String(line.id).replace(/^food-/, "")) === item.id)
            .reduce((sum, line) => sum + line.qty, 0);
          const best = item.platforms.find((p) => p.best) || item.platforms[0];
          return (
            <article key={item.id} className="menu-card" style={{ display: "grid", gridTemplateColumns: "88px 1fr auto", gap: 12, padding: 12 }}>
              <button
                type="button"
                style={{ border: 0, background: "transparent", padding: 0 }}
                onClick={() => router.push(`/food/item/${item.id}?restaurant=${restaurant.id}&q=${encodeURIComponent(query)}`)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 14 }} />
              </button>
              <button
                type="button"
                style={{ border: 0, background: "transparent", textAlign: "left", padding: 0 }}
                onClick={() => router.push(`/food/item/${item.id}?restaurant=${restaurant.id}&q=${encodeURIComponent(query)}`)}
              >
                <span className={`tag ${item.dietary === "VEG" ? "tag-veg" : "tag-nonveg"}`}>{item.tag}</span>
                <h3 style={{ margin: "6px 0 4px", fontSize: 16 }}>{item.name}</h3>
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                  {best ? `₹${best.price} best on ${best.label}` : "Tap for details"}
                </p>
              </button>
              <AddToCartControl
                qty={qty}
                label={`Add ${item.name} to cart`}
                onAdd={() => addFoodItem({ item, restaurant, quantity: 1 })}
                onIncrement={() => addFoodItem({ item, restaurant, quantity: 1 })}
                onDecrement={() => setQty(foodLineId(item.id), qty - 1)}
              />
            </article>
          );
        })}
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
