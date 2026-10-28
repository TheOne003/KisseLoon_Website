"use client";

import { Suspense, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PlatformLogo } from "@/components/PlatformLogo";
import { QuantitySelector } from "@/components/QuantitySelector";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { useCart } from "@/context/CartContext";
import { getDemoGroceryProduct } from "@/lib/data/groceryCatalog";
import { compareGroceryProduct } from "@/lib/services/comparisonService";
import { getCheckoutDestination } from "@/lib/services/checkoutService";
import { storageKeys, writeSessionJson } from "@/lib/storage";
import type { GroceryPlatformOption } from "@/lib/types";

function Product() {
  const params = useParams<{ productId: string }>();
  const search = useSearchParams();
  const query = search.get("q") || "Amul Gold Milk";
  const product = useMemo(() => getDemoGroceryProduct({ id: params.productId }), [params.productId]);
  const comparison = useMemo(() => compareGroceryProduct(product), [product]);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const { addGroceryItem } = useCart();
  const router = useRouter();
  const selection = comparison.selection;
  const platforms = selection?.platforms || [];

  const openPlatform = (platform: GroceryPlatformOption) => {
    const dest = getCheckoutDestination(platform);
    writeSessionJson(storageKeys.checkoutIntent, { id: platform.id, name: platform.name });
    if (dest.available && dest.url) {
      router.push(`/ads/pre-checkout?platform=${platform.id}&name=${encodeURIComponent(platform.name)}`);
      return;
    }
    setMessage(`${platform.name} checkout is not configured yet. Your Kisse Loon cart was kept.`);
  };

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Grocery comparison"
        title={product.name}
        subtitle="Choose a platform or add this product to the Kisse Loon cart."
      />
      <div className="item-layout">
        <section className="item-panel">
          <div className="item-photo is-grocery">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt="" />
          </div>
          <p className="item-restaurant">{product.brandLine}</p>
          <p className="item-copy">
            {product.packSize} · {product.stockLabel}
          </p>
          {product.description ? <p className="item-copy">{product.description}</p> : null}
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
              const best = product.platforms.find((p) => p.best) || product.platforms[0];
              addGroceryItem({ product, platform: best, quantity: qty });
              router.push(`/grocery/results?q=${encodeURIComponent(query)}`);
            }}
          >
            Add to Cart
          </button>
          <p className="muted item-note">
            This is Kisse Loon’s cart — not a partner platform cart. Adding a pack does not start another race.
          </p>
        </section>

        <section className="item-platforms" aria-label="Platform prices">
          <div className="item-platforms-head">
            <h2>Compare platforms</h2>
            <span className="demo-badge">Demo prices</span>
          </div>
          {platforms.map((platform) => (
            <article key={platform.id} className={`item-platform ${platform.best ? "best" : ""}`}>
              <div className="item-platform-top">
                <div className="item-platform-brand">
                  <PlatformLogo platform={platform} size={44} />
                  <div>
                    <strong>{platform.name}</strong>
                    <p>{platform.best ? platform.saveLabel : platform.subtitle}</p>
                  </div>
                </div>
                <div className="item-platform-price">
                  <b>₹{platform.price * qty}</b>
                  {platform.best ? <span>Best</span> : null}
                </div>
              </div>
              <div className="item-platform-actions">
                <span className={platform.priceNoteTone === "best" ? "save" : "muted"}>{platform.priceNote}</span>
                <button
                  type="button"
                  className={`btn item-go ${platform.best ? "btn-primary" : "btn-navy"}`}
                  onClick={() => openPlatform(platform)}
                >
                  Continue on {platform.name}
                </button>
              </div>
            </article>
          ))}
          {message ? <p className="error-text">{message}</p> : null}
        </section>
      </div>
    </SiteShell>
  );
}

export default function GroceryProductPage() {
  return (
    <Suspense>
      <Product />
    </Suspense>
  );
}
