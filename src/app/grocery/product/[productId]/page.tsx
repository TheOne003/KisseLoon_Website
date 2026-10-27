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

function Product() {
  const params = useParams<{ productId: string }>();
  const search = useSearchParams();
  const query = search.get("q") || "Amul Gold Milk";
  const product = useMemo(() => getDemoGroceryProduct({ id: params.productId }), [params.productId]);
  const comparison = useMemo(() => compareGroceryProduct(product), [product]);
  const [selectedId, setSelectedId] = useState(comparison.selection?.defaultPlatformId || product.selectedPlatformId);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const { addGroceryItem } = useCart();
  const router = useRouter();
  const selection = comparison.selection;
  const selected = selection?.platforms.find((p) => p.id === selectedId) || selection?.platforms[0];

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Grocery comparison"
        title={product.name}
        subtitle="Choose a platform or add this product to the Kisse Loon cart."
      />
      <div className="stack">
        <span className="demo-badge">Demo grocery comparison</span>
        <div className="card" style={{ padding: 16, display: "grid", gridTemplateColumns: "96px 1fr", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt="" style={{ width: 96, height: 96, objectFit: "contain" }} />
          <div>
            <div className="muted">{product.brandLine}</div>
            <h2 style={{ margin: "4px 0" }}>{product.name}</h2>
            <p className="muted">
              {product.packSize} · {product.stockLabel}
            </p>
          </div>
        </div>
        <div className="row space-between">
          <span>Quantity</span>
          <QuantitySelector qty={qty} onDecrement={() => setQty(Math.max(1, qty - 1))} onIncrement={() => setQty(qty + 1)} />
        </div>
        {(selection?.platforms || []).map((platform) => (
          <button
            key={platform.id}
            type="button"
            className="platform-card"
            style={{
              padding: 14,
              width: "100%",
              textAlign: "left",
              border: selectedId === platform.id ? "2px solid var(--gold)" : "2px solid transparent",
            }}
            onClick={() => setSelectedId(platform.id)}
          >
            <div className="row space-between">
              <div className="row">
                <PlatformLogo platform={platform} size={44} />
                <div>
                  <strong>{platform.name}</strong>
                  {platform.best ? (
                    <div className="save">{platform.saveLabel}</div>
                  ) : (
                    <div className="muted">{platform.subtitle}</div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="price" style={{ color: platform.best ? "var(--success)" : undefined }}>
                  ₹{platform.price * qty}
                </div>
                <div className={platform.priceNoteTone === "best" ? "save" : "muted"}>{platform.priceNote}</div>
              </div>
            </div>
          </button>
        ))}
        {message ? <p className="error-text">{message}</p> : null}
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => {
            const platform = product.platforms.find((p) => p.id === selected?.id);
            addGroceryItem({ product, platform, quantity: qty });
            router.push(`/grocery/results?q=${encodeURIComponent(query)}`);
          }}
        >
          Add to Kisse Loon cart
        </button>
        <button
          type="button"
          className="btn btn-navy btn-block"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            const dest = getCheckoutDestination(selected);
            writeSessionJson(storageKeys.checkoutIntent, { id: selected.id, name: selected.name });
            if (dest.available && dest.url) {
              router.push(`/ads/pre-checkout?platform=${selected.id}&name=${encodeURIComponent(selected.name)}`);
              return;
            }
            setMessage(
              `${selected.name} checkout is not configured yet. Your Kisse Loon cart was kept.`,
            );
          }}
        >
          Continue with {selected?.name || "platform"}
        </button>
        <p className="muted">
          Product comparison is separate from full-cart orbit comparison. Mixed baskets are marked incomplete on
          platforms that cannot fulfill every item.
        </p>
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
