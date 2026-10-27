"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddToCartControl } from "@/components/QuantitySelector";
import { PlatformLogo } from "@/components/PlatformLogo";
import { PageHeading, SiteShell } from "@/components/SiteShell";
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

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Grocery results"
        title={payload.title}
        subtitle={`${payload.foundCount} products · ${payload.subtitle}`}
      />
      <div className="stack" style={{ paddingBottom: footerCount ? 96 : 0 }}>
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
        {payload.products.map((product) => {
          const lineId = groceryLineId(product);
          const qty = items.find((item) => item.id === lineId)?.qty || 0;
          const platforms = product.platforms.filter((p) => !p.unavailable);
          return (
            <article
              key={product.id}
              className="product-card"
              style={{ display: "grid", gridTemplateColumns: "88px 1fr auto", gap: 12, padding: 12 }}
            >
              <button
                type="button"
                style={{ border: 0, background: "transparent", padding: 0 }}
                onClick={() =>
                  router.push(
                    `/grocery/race/${product.id}?q=${encodeURIComponent(query)}&play=${Date.now()}`,
                  )
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt="" style={{ width: 88, height: 88, objectFit: "contain" }} />
              </button>
              <button
                type="button"
                style={{ border: 0, background: "transparent", textAlign: "left", padding: 0 }}
                onClick={() =>
                  router.push(
                    `/grocery/race/${product.id}?q=${encodeURIComponent(query)}&play=${Date.now()}`,
                  )
                }
              >
                <div className="muted" style={{ fontSize: 11, letterSpacing: "0.06em" }}>
                  {product.brand}
                </div>
                <strong>{product.name}</strong>
                <p className="muted" style={{ margin: "4px 0" }}>
                  {product.details}
                </p>
                <div className="platform-logos">
                  {platforms.map((platform) => (
                    <PlatformLogo key={platform.id} platform={platform} size={22} />
                  ))}
                </div>
                <div className="row space-between" style={{ marginTop: 8 }}>
                  <span className="muted">Best via {product.bestPlatform}</span>
                  <span className="price">₹{product.bestPrice}</span>
                </div>
              </button>
              <AddToCartControl
                qty={qty}
                label={`Add ${product.name}`}
                onAdd={() => addGroceryItem({ product, quantity: 1 })}
                onIncrement={() => addGroceryItem({ product, quantity: 1 })}
                onDecrement={() => setQty(lineId, qty - 1)}
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
                {footerCount} grocery item{footerCount === 1 ? "" : "s"}
              </strong>
              <div className="muted">Kisse Loon cart</div>
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
