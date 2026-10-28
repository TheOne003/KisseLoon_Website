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
import type { CartPlatformOption } from "@/lib/types";

function CheckMark() {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
      <path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" aria-hidden="true">
      <path
        d="M2 5.2h8.2v8.1H2V5.2Zm1.7-1.8A2.4 2.4 0 0 1 6.1 1a2.4 2.4 0 0 1 2.4 2.4"
        stroke="#684000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="9" height="12" viewBox="0 0 9 12" fill="none" aria-hidden="true">
      <path d="M5.2 1 1 7h3.1L3.4 11 8 5.2H4.8L5.2 1Z" fill="#059669" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.4" stroke="#45464D" strokeWidth="1.3" />
      <path d="M6 3.6V6l1.8 1.2" stroke="#45464D" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 6.5h8M7.2 3.2 10.5 6.5 7.2 9.8" stroke="#684000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlatformCard({
  platform,
  selected,
  onSelect,
}: {
  platform: CartPlatformOption;
  selected: boolean;
  onSelect: () => void;
}) {
  if (platform.incomplete) {
    return (
      <article className="pick-card is-incomplete">
        <div className="pick-row">
          <div className="pick-left">
            <span className="pick-icon-muted">
              <PlatformLogo platform={platform} size={40} />
            </span>
            <div>
              <div className="pick-name-row">
                <strong className="is-muted">{platform.name}</strong>
                <span className="pick-pill is-incomplete">{platform.readyLabel}</span>
              </div>
              {platform.subtitle ? <p className="pick-incomplete-copy">{platform.subtitle}</p> : null}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <button type="button" className={`pick-card ${selected ? "is-selected" : ""}`} onClick={onSelect}>
      {platform.best ? <span className="pick-best-tag">★ BEST TOTAL</span> : null}
      <div className="pick-row">
        <div className="pick-left">
          <PlatformLogo platform={platform} size={48} />
          <div>
            <div className="pick-name-row">
              <strong>{platform.name}</strong>
              <span className="pick-pill">{platform.readyLabel}</span>
            </div>
            {platform.eta ? (
              <p className={`pick-eta ${platform.etaTone === "best" ? "is-best" : ""}`}>
                {platform.etaTone === "best" ? <BoltIcon /> : <ClockIcon />}
                {platform.eta}
              </p>
            ) : null}
          </div>
        </div>
        <div className="pick-right">
          <span className="pick-total-label">TOTAL</span>
          <b>₹{platform.total}</b>
          {platform.saveLabel ? <span className="pick-save">{platform.saveLabel}</span> : null}
          {platform.moreLabel ? <span className="pick-more">{platform.moreLabel}</span> : null}
          <span className={`pick-radio ${selected ? "is-on" : ""}`}>{selected ? <CheckMark /> : null}</span>
        </div>
      </div>
    </button>
  );
}

export default function CartPlatformsPage() {
  const { items, fingerprint } = useCart();
  const snapshot = readCartSnapshot();
  const stale = snapshot && snapshot.fingerprint !== fingerprint;
  const basket = stale || !snapshot?.items.length ? items : snapshot.items;
  const result = useMemo(() => compareCart(basket), [basket]);
  const selection = result.selection;
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState(
    selection?.defaultPlatformId || selection?.platforms?.find((p) => p.selectable)?.id || null,
  );
  const router = useRouter();

  const selectedPlatform = useMemo(
    () =>
      selection?.platforms?.find((p) => p.id === selectedId && p.selectable) ||
      selection?.platforms?.find((p) => p.selectable),
    [selection, selectedId],
  );

  const continueOn = (platform: CartPlatformOption) => {
    const dest = getCheckoutDestination(platform);
    writeSessionJson(storageKeys.checkoutIntent, { id: platform.id, name: platform.name });
    router.push(`/ads/pre-checkout?platform=${platform.id}&name=${encodeURIComponent(platform.name)}`);
    if (!dest.available) {
      setMessage(`${platform.name} redirect is not configured yet. Your cart was kept.`);
    }
  };

  if (!result.ok || !selection) {
    return (
      <SiteShell>
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
      <div className="pick-page">
      <PageHeading
        eyebrow="After comparison"
        title="Choose your platform"
        subtitle="Select a complete basket. Demo totals."
      />
        <div className="pick-summary">
          <div className="pick-summary-top">
            <div className="pick-summary-title">
              <BagIcon />
              <p>Your optimized cart</p>
            </div>
            <span className="pick-count">
              {selection.itemCount} item{selection.itemCount === 1 ? "" : "s"}
            </span>
          </div>
          <p className="pick-item-line">{selection.itemLine}</p>
          <div className="pick-rate-banner">
            <span>Best combined rate found:</span>
            <strong>{selection.bestCombinedRate != null ? `₹${selection.bestCombinedRate}` : "—"}</strong>
          </div>
        </div>

        {stale ? <p className="error-text">Cart changed since the last comparison. Totals were refreshed.</p> : null}

        <div className="pick-list">
          {selection.platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              selected={selectedId === platform.id}
              onSelect={() => {
                if (!platform.selectable) return;
                setSelectedId(platform.id);
              }}
            />
          ))}
        </div>

        {!selection.hasCompleteBasket ? (
          <StatusState
            title="No complete platform basket"
            message="No partner can fulfill every item in this mixed cart. Remove incompatible items or split food and grocery."
          />
        ) : (
          <div className="pick-footer">
            <div className="pick-lowest">
              <div>
                <p className="pick-lowest-label">LOWEST VALID TOTAL</p>
                <p className="pick-lowest-price">
                  <strong>
                    {selectedPlatform?.total != null
                      ? `₹${selectedPlatform.total}`
                      : selection.bestCombinedRate != null
                        ? `₹${selection.bestCombinedRate}`
                        : "—"}
                  </strong>
                  <span>via {selectedPlatform?.name || "unavailable"}</span>
                </p>
              </div>
              <span className="pick-lowest-save">
                {selectedPlatform?.best
                  ? `${selectedPlatform.saveLabel} total`
                  : selectedPlatform?.moreLabel || "Compare totals"}
              </span>
            </div>
            <button
              type="button"
              className="pick-cta"
              disabled={!selectedPlatform}
              onClick={() => {
                if (!selectedPlatform) return;
                continueOn(selectedPlatform);
              }}
            >
              {selectedPlatform?.name ? `Continue with ${selectedPlatform.name}` : "No complete platform available"}
              {selectedPlatform ? <ArrowIcon /> : null}
            </button>
          </div>
        )}

        {message ? <p className="error-text">{message}</p> : null}
        <p className="pick-disclaimer">ⓘ Final price may vary at checkout. Demo estimate.</p>
      </div>
    </SiteShell>
  );
}
