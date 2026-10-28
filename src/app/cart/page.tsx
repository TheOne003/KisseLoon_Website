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
  { id: "food", label: "Food" },
  { id: "grocery", label: "Grocery" },
];

function dishClass(item: CartLine) {
  if (item.tag === "veg") return "is-veg";
  if (item.tag === "in-stock") return "is-stock";
  return "is-nonveg";
}

function CartItemCard({
  item,
  onRemove,
  onChangeQty,
}: {
  item: CartLine;
  onRemove: () => void;
  onChangeQty: (qty: number) => void;
}) {
  return (
    <article className={`resto-card menu-card cart-line ${item.category === "grocery" ? "grocery-card" : ""}`}>
      <div className="resto-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" />
      </div>
      <div className="cart-line-main">
        <h2>{item.name}</h2>
        <p className="resto-cuisine">{item.subtitle}</p>
        <span className={`resto-dish ${dishClass(item)}`}>{item.tagLabel}</span>
        <p className="cart-line-price">
          <strong className="menu-price">₹{item.price}</strong>
          <span className="mrp">₹{item.mrp}</span>
        </p>
        <p className="save">{item.bestOn}</p>
        <button type="button" className="cart-remove" onClick={onRemove}>
          Remove
        </button>
      </div>
      <div className="menu-add">
        <QuantitySelector
          qty={item.qty}
          onDecrement={() => onChangeQty(item.qty - 1)}
          onIncrement={() => onChangeQty(item.qty + 1)}
          label={`${item.name} quantity`}
        />
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
        title="Kisse Loon cart"
        subtitle="Compare the full basket, then pick one platform. Demo estimate."
      />
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
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            <div className="chip-row">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${tab === item.id ? "active" : ""}`}
                  onClick={() => setTab(item.id)}
                >
                  {item.label} ·{" "}
                  {item.id === "all" ? summary.totalCount : item.id === "food" ? summary.foodCount : summary.groceryCount}
                </button>
              ))}
            </div>
            {mixed ? (
              <p className="cart-mix">
                Food and grocery are compared separately. A platform is selectable only if it can fulfill every item.
              </p>
            ) : null}
            {visibleFood.length ? (
              <section className="cart-section">
                <h2>Food · {summary.foodCount}</h2>
                <div className="resto-list menu-list">
                  {visibleFood.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.id)}
                      onChangeQty={(qty) => setQty(item.id, qty)}
                    />
                  ))}
                </div>
              </section>
            ) : null}
            {visibleGrocery.length ? (
              <section className="cart-section">
                <h2>Grocery · {summary.groceryCount}</h2>
                <div className="resto-list menu-list">
                  {visibleGrocery.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.id)}
                      onChangeQty={(qty) => setQty(item.id, qty)}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
          <aside className="cart-summary">
            <h2>Estimate</h2>
            <div className="cart-summary-row">
              <span>Items</span>
              <span>₹{summary.foodSubtotal + summary.grocerySubtotal}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span>₹{summary.deliveryFee}</span>
            </div>
            <div className="cart-summary-row save">
              <span>Estimated savings</span>
              <span>−₹{summary.saveAmount}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>₹{summary.total}</span>
            </div>
            <p className="muted">{summary.optimizedLine} · demo estimate</p>
            <button type="button" className="btn btn-primary item-go" onClick={startCompare}>
              Compare cart
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => router.push("/")}>
              Continue shopping
            </button>
          </aside>
        </div>
      )}
    </SiteShell>
  );
}
