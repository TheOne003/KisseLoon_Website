"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddToCartControl } from "@/components/QuantitySelector";
import { HomeAd } from "@/components/HomeAd";
import { PlatformLogo } from "@/components/PlatformLogo";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { SEARCH_GROCERY_AD } from "@/lib/services/adsService";
import { useCart } from "@/context/CartContext";
import { getCartFingerprint, groceryLineId } from "@/lib/cart";
import { cartSourceFromItems, createCartSnapshotId, createComparisonContext } from "@/lib/comparison";
import { getDemoGroceryResults } from "@/lib/data/groceryCatalog";
import { saveCartSnapshot } from "@/lib/snapshot";

const FILTERS = ["Sort", "Filters", "Price", "Brand", "Under ₹100"];

function Results() {
  const search = useSearchParams();
  const query = search.get("q") || "Amul Gold Milk";
  const payload = useMemo(() => getDemoGroceryResults(query), [query]);
  const [filter, setFilter] = useState("Sort");
  const { items, addGroceryItem, setQty } = useCart();
  const router = useRouter();
  const groceryLines = items.filter((item) => item.category === "grocery");
  const footerCount = groceryLines.reduce((sum, item) => sum + item.qty, 0);
  const footerSubtotal = groceryLines.reduce((sum, item) => sum + item.price * item.qty, 0);
  const distinctCount = groceryLines.length;

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

  const openRace = (productId: string) => {
    router.push(`/grocery/race/${productId}?q=${encodeURIComponent(query)}&play=${Date.now()}`);
  };

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Grocery results"
        title={payload.title}
        subtitle={`${payload.foundCount} products · ${payload.subtitle}`}
      />
      <div className="stack resto-results" style={{ paddingBottom: footerCount ? 96 : 0 }}>
        <div className="chip-row">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${filter === item ? "active" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="resto-list">
          {payload.products.map((product) => {
            const lineId = groceryLineId(product);
            const qty = items.find((item) => item.id === lineId)?.qty || 0;
            const platforms = product.platforms.filter((p) => !p.unavailable);
            return (
              <article key={product.id} className="resto-card menu-card grocery-card">
                <div className="resto-media">
                  <button type="button" className="menu-photo" onClick={() => openRace(product.id)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt="" />
                  </button>
                </div>
                <button type="button" className="menu-main" onClick={() => openRace(product.id)}>
                  <h2>{product.name}</h2>
                  <p className="resto-cuisine">{product.details}</p>
                  <span className="resto-dish">{product.brand}</span>
                  <strong className="menu-price">₹{product.bestPrice}</strong>
                  <div className="resto-cta">
                    <span className="resto-apps" aria-label="Available on">
                      {platforms.map((platform) => (
                        <PlatformLogo key={platform.id} platform={platform} size={22} />
                      ))}
                    </span>
                    <span className="resto-go">Compare</span>
                  </div>
                </button>
                <div className="menu-add">
                  <AddToCartControl
                    qty={qty}
                    label={`Add ${product.name}`}
                    onAdd={() => addGroceryItem({ product, quantity: 1 })}
                    onIncrement={() => addGroceryItem({ product, quantity: 1 })}
                    onDecrement={() => setQty(lineId, qty - 1)}
                  />
                </div>
              </article>
            );
          })}
          <HomeAd ad={SEARCH_GROCERY_AD} variant="square" />
        </div>
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
    </SiteShell>
  );
}

export default function GroceryResultsPage() {
  return (
    <Suspense>
      <Results />
    </Suspense>
  );
}
