"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AddToCartControl } from "@/components/QuantitySelector";
import { LocationControl } from "@/components/LocationSheet";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { useCart } from "@/context/CartContext";
import { usePlatforms } from "@/context/PlatformContext";
import { groceryLineId } from "@/lib/cart";
import { CATEGORY_BG, GROCERY_CATEGORIES, getCatalogByCategory } from "@/lib/data/groceryCatalog";

export default function GroceryPage() {
  const [query, setQuery] = useState("Amul Gold Milk");
  const [category, setCategory] = useState(GROCERY_CATEGORIES[0]);
  const router = useRouter();
  const { items, addGroceryItem, setQty } = useCart();
  const { canCompare, setConnectOpen } = usePlatforms();
  const products = useMemo(
    () =>
      getCatalogByCategory(category).map((product) => {
        const price = product.bestPrice;
        const mrp = Math.max(price + 8, Math.round(price * 1.15));
        return { ...product, price, mrp, off: mrp - price, imageBg: CATEGORY_BG[category] };
      }),
    [category],
  );

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Grocery"
        title="Compare grocery packs"
        subtitle="Search a product, then the product-level race plays before platform prices. Grocery never uses restaurant screens."
      />
      <div className="stack">
        <LocationControl />
        <form
          className="search-bar"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            if (!canCompare) {
              setConnectOpen(true);
              return;
            }
            router.push(`/grocery/search?q=${encodeURIComponent(query)}`);
          }}
        >
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search milk, snacks, fruit…"
            aria-label="Search grocery"
          />
        </form>
        <div className="chip-row">
          {GROCERY_CATEGORIES.map((item) => (
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
        <div className="grid-2">
          {products.map((product) => {
            const lineId = groceryLineId(product);
            const qty = items.find((item) => item.id === lineId)?.qty || 0;
            return (
              <article
              key={product.id}
              className="product-card"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (!canCompare) {
                  setConnectOpen(true);
                  return;
                }
                router.push(`/grocery/race/${product.id}?q=${encodeURIComponent(product.name)}&play=${Date.now()}`);
              }}
            >
                <div style={{ background: product.imageBg, position: "relative", padding: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt="" style={{ height: 120, objectFit: "contain", margin: "0 auto" }} />
                  <div
                    style={{ position: "absolute", top: 8, right: 8 }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <AddToCartControl
                      qty={qty}
                      label={`Add ${product.name}`}
                      onAdd={() => addGroceryItem({ product, quantity: 1 })}
                      onIncrement={() => addGroceryItem({ product, quantity: 1 })}
                      onDecrement={() => setQty(lineId, qty - 1)}
                    />
                  </div>
                </div>
                <div style={{ padding: 12 }}>
                  <div className="row">
                    <span className="pill" style={{ background: "#fff3d6", color: "var(--gold-text)" }}>
                      ₹{product.price}
                    </span>
                    <span className="mrp">₹{product.mrp}</span>
                  </div>
                  <div className="save">₹{product.off} OFF</div>
                  <strong>{product.name}</strong>
                  <p className="muted" style={{ margin: "4px 0 8px" }}>
                    {product.details}
                  </p>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/grocery/results?q=${encodeURIComponent(category)}`);
                    }}
                  >
                    See All {category}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
