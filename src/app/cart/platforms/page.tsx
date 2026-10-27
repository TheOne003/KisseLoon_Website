"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlatformLogo } from "@/components/PlatformLogo";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { StatusState } from "@/components/StatusState";
import { useCart } from "@/context/CartContext";
import { compareCart } from "@/lib/services/comparisonService";
import { getCheckoutDestination } from "@/lib/services/checkoutService";
import { readCartSnapshot } from "@/lib/snapshot";
import { storageKeys, writeSessionJson } from "@/lib/storage";

export default function CartPlatformsPage() {
  const { items, fingerprint } = useCart();
  const snapshot = readCartSnapshot();
  const stale = snapshot && snapshot.fingerprint !== fingerprint;
  const basket = stale || !snapshot?.items.length ? items : snapshot.items;
  const result = useMemo(() => compareCart(basket), [basket]);
  const selection = result.selection;
  const [selectedId, setSelectedId] = useState(selection?.defaultPlatformId || null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const selected = selection?.platforms.find((p) => p.id === selectedId && p.selectable) ||
    selection?.platforms.find((p) => p.selectable);

  if (!result.ok || !selection) {
    return (
      <SiteShell>
        <PageHeading title="Cart comparison" />
        <StatusState
          title="Comparison unavailable"
          message={result.error || "Could not compare this cart. Your items were kept."}
          action={
            <button type="button" className="btn btn-primary" onClick={() => router.push("/cart")}>
              Back to cart
            </button>
          }
        />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHeading
        eyebrow="After orbit"
        title="Choose a platform"
        subtitle="One cart platform-selection step. Incomplete platforms cannot fulfill every item."
      />
      <div className="stack">
        <span className="demo-badge">Demo basket totals</span>
        <div className="card" style={{ padding: 14 }}>
          <strong>
            {selection.itemCount} item{selection.itemCount === 1 ? "" : "s"}
          </strong>
          <p className="muted">{selection.itemLine}</p>
          {stale ? (
            <p className="error-text">Cart changed since the last comparison. Totals were refreshed.</p>
          ) : null}
        </div>
        {selection.platforms.map((platform) => {
          if (platform.incomplete) {
            return (
              <article key={platform.id} className="platform-card" style={{ padding: 14, opacity: 0.7 }}>
                <div className="row">
                  <PlatformLogo platform={platform} size={40} />
                  <div>
                    <strong>{platform.name}</strong>
                    <div className="pill" style={{ background: "#fee2e2", color: "#991b1b", marginTop: 4 }}>
                      {platform.readyLabel}
                    </div>
                    <p className="muted">{platform.subtitle}</p>
                  </div>
                </div>
              </article>
            );
          }
          const active = selected?.id === platform.id;
          return (
            <button
              key={platform.id}
              type="button"
              className="platform-card"
              style={{
                padding: 14,
                width: "100%",
                textAlign: "left",
                border: active ? "2px solid var(--gold)" : "2px solid transparent",
              }}
              onClick={() => setSelectedId(platform.id)}
            >
              {platform.best ? (
                <div className="pill" style={{ background: "#e8f8ef", color: "#166534", marginBottom: 8 }}>
                  ★ BEST TOTAL
                </div>
              ) : null}
              <div className="row space-between">
                <div className="row">
                  <PlatformLogo platform={platform} size={48} />
                  <div>
                    <strong>{platform.name}</strong>
                    <div className="muted">{platform.readyLabel}</div>
                    <div className={platform.etaTone === "best" ? "save" : "muted"}>{platform.eta}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="muted">TOTAL</div>
                  <div className="price">₹{platform.total}</div>
                  {platform.saveLabel ? <div className="save">{platform.saveLabel}</div> : null}
                  {platform.moreLabel ? <div className="muted">{platform.moreLabel}</div> : null}
                </div>
              </div>
            </button>
          );
        })}
        {!selection.hasCompleteBasket ? (
          <StatusState
            title="No complete platform basket"
            message="No partner can fulfill every item in this mixed cart. Remove incompatible items or split food and grocery."
          />
        ) : null}
        {message ? <p className="error-text">{message}</p> : null}
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            const dest = getCheckoutDestination(selected);
            writeSessionJson(storageKeys.checkoutIntent, { id: selected.id, name: selected.name });
            router.push(
              `/ads/pre-checkout?platform=${selected.id}&name=${encodeURIComponent(selected.name)}`,
            );
            if (!dest.available) {
              setMessage(`${selected.name} redirect is not configured yet. Your cart was kept.`);
            }
          }}
        >
          Continue with {selected?.name || "platform"}
        </button>
        <p className="muted">
          External partner checkout is separate from the Kisse Loon cart. The cart is never cleared if redirect fails.
        </p>
      </div>
    </SiteShell>
  );
}
