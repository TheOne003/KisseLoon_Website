"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuantitySelector } from "@/components/QuantitySelector";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { StatusState } from "@/components/StatusState";
import { useCart } from "@/context/CartContext";
import { getCartFingerprint } from "@/lib/cart";
import { cartSourceFromItems, createCartSnapshotId, createComparisonContext } from "@/lib/comparison";
import { saveCartSnapshot } from "@/lib/snapshot";
import type { CartLine } from "@/lib/types";

const TABS = [
  { id: "all", label: "All" },
  { id: "food", label: "🍕 Food" },
  { id: "grocery", label: "🛒 Grocery" },
];

function CartItemCard({
  item,
  onRemove,
  onChangeQty,
}: {
  item: CartLine;
  onRemove: () => void;
  onChangeQty: (qty: number) => void;
}) {
  const tagClass = item.tag === "veg" ? "tag-veg" : item.tag === "in-stock" ? "tag-stock" : "tag-nonveg";
  return (
    <article className="cart-item" style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 12, padding: 12 }}>
      <div style={{ position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 14 }} />
        <span className={`tag ${tagClass}`} style={{ position: "absolute", left: 6, bottom: 6 }}>
          {item.tagLabel}
        </span>
      </div>
      <div>
        <div className="row space-between">
          <div>
            <strong>{item.name}</strong>
            <p className="muted" style={{ margin: "4px 0" }}>
              {item.subtitle}
            </p>
          </div>
          <button type="button" className="icon-btn" aria-label={`Remove ${item.name}`} onClick={onRemove}>
            ⌫
          </button>
        </div>
        <div className="row space-between">
          <div>
            <span className="price">₹{item.price}</span> <span className="mrp">₹{item.mrp}</span>
            <div className="save">{item.bestOn}</div>
          </div>
          <QuantitySelector qty={item.qty} onDecrement={() => onChangeQty(item.qty - 1)} onIncrement={() => onChangeQty(item.qty + 1)} />
        </div>
      </div>
    </article>
  );
}

export default function CartPage() {
  const { items, summary, setQty, removeItem } = useCart();
  const [tab, setTab] = useState("all");
  const router = useRouter();
  const showFood = tab === "all" || tab === "food";
  const showGrocery = tab === "all" || tab === "grocery";
  const mixed = summary.foodCount > 0 && summary.groceryCount > 0;

  const visibleFood = useMemo(() => (showFood ? summary.foodItems : []), [showFood, summary.foodItems]);
  const visibleGrocery = useMemo(
    () => (showGrocery ? summary.groceryItems : []),
    [showGrocery, summary.groceryItems],
  );

  const startCompare = () => {
    if (!items.length) return;
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
        eyebrow="Cart"
        title="Kisse Loon cart"
        subtitle="This cart belongs to Kisse Loon. Compare the full basket with orbit, then choose one platform."
      />
      <div className="stack">
        <div className="chip-row">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label} ({item.id === "all" ? summary.totalCount : item.id === "food" ? summary.foodCount : summary.groceryCount})
            </button>
          ))}
        </div>
        {mixed ? (
          <div className="card" style={{ padding: 14, background: "#fff7ed" }}>
            <strong>Dual basket</strong>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              Food and grocery items are compared independently. A platform is only selectable if it can fulfill every
              item in this cart.
            </p>
          </div>
        ) : null}
        {!items.length ? (
          <StatusState
            title="Your Kisse Loon cart is empty"
            message="Add dishes from a restaurant menu or grocery products, then compare the full basket."
            action={
              <button type="button" className="btn btn-primary" onClick={() => router.push("/")}>
                Continue shopping
              </button>
            }
          />
        ) : null}
        {visibleFood.length ? <h3 style={{ margin: 0 }}>🍕 Food Cart · {summary.foodCount}</h3> : null}
        {visibleFood.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
            onChangeQty={(qty) => setQty(item.id, qty)}
          />
        ))}
        {visibleGrocery.length ? <h3 style={{ margin: 0 }}>🛒 Grocery Cart · {summary.groceryCount}</h3> : null}
        {visibleGrocery.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
            onChangeQty={(qty) => setQty(item.id, qty)}
          />
        ))}
        {items.length ? (
          <aside className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Estimate</h3>
            <div className="row space-between">
              <span>Items</span>
              <span>₹{summary.foodSubtotal + summary.grocerySubtotal}</span>
            </div>
            <div className="row space-between">
              <span>Delivery</span>
              <span>₹{summary.deliveryFee}</span>
            </div>
            <div className="row space-between save">
              <span>Estimated savings</span>
              <span>−₹{summary.saveAmount}</span>
            </div>
            <div className="row space-between" style={{ marginTop: 8, fontWeight: 800 }}>
              <span>Total</span>
              <span>₹{summary.total}</span>
            </div>
            <p className="muted">{summary.optimizedLine} · demo estimate</p>
            <button type="button" className="btn btn-primary btn-block" onClick={startCompare}>
              Compare Cart Prices
            </button>
            <button type="button" className="btn btn-ghost btn-block" onClick={() => router.push("/")}>
              Continue shopping
            </button>
          </aside>
        ) : null}
      </div>
    </SiteShell>
  );
}
