"use client";

import { useState } from "react";
import Link from "next/link";
import { PlatformLogo } from "@/components/PlatformLogo";
import { SiteShell } from "@/components/SiteShell";
import { usePlatforms } from "@/context/PlatformContext";
import { CONNECTABLE_PLATFORMS } from "@/lib/platforms";
import { FOOD_COMPARE_DEMO, GROCERY_COMPARE_DEMO } from "@/lib/site";

const FEATURES = [
  {
    id: "connect",
    n: "01",
    title: "Connect delivery apps",
    text: "Pick an app, enter a mobile number, verify with demo OTP 123456. Not real partner login.",
  },
  {
    id: "unlock",
    n: "02",
    title: "Two apps unlock compare",
    text: "Search and race stay locked until two platforms are connected.",
  },
  {
    id: "food",
    n: "03",
    title: "Food price race",
    text: "Same restaurant across Swiggy, Zomato, and Toing. Demo totals. Cheapest finishes first.",
  },
  {
    id: "grocery",
    n: "04",
    title: "Grocery pack compare",
    text: "Everyday packs across Blinkit, Zepto, and Instamart. Demo catalog, labeled as such.",
  },
  {
    id: "cart",
    n: "05",
    title: "Floating cart",
    text: "Cart stays off the header. Add an item and it pops at the bottom right.",
  },
  {
    id: "handoff",
    n: "06",
    title: "You order on their app",
    text: "Kisse Loon stops at comparison. No fake checkout. You open the app that won.",
  },
] as const;

export default function FeaturesPage() {
  const [active, setActive] = useState<(typeof FEATURES)[number]["id"]>("connect");
  const feature = FEATURES.find((item) => item.id === active) || FEATURES[0];
  const { connected, canCompare, setConnectOpen, isConnected } = usePlatforms();

  return (
    <SiteShell wide>
      <section className="feat-page">
        <header className="story-head">
          <p className="page-eyebrow">Features</p>
          <h1>What the platform actually does</h1>
          <p className="muted">Connect apps, race prices, pop the cart, then order on the winner.</p>
        </header>

        <div className="feat-layout">
          <div className="feat-rail" role="tablist" aria-label="Platform features">
            {FEATURES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active === item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => setActive(item.id)}
              >
                <span>{item.n}</span>
                {item.title}
              </button>
            ))}
          </div>

          <article className="feat-stage">
            <p className="feat-kicker">Feature {feature.n}</p>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>

            {active === "connect" ? (
              <div className="feat-apps">
                {CONNECTABLE_PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    className={`feat-app ${isConnected(platform.id) ? "on" : ""}`}
                    onClick={() => setConnectOpen(true)}
                  >
                    <PlatformLogo platform={platform.id} size={40} />
                    <strong>{platform.name}</strong>
                    <span>{isConnected(platform.id) ? "Connected" : platform.kind}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {active === "unlock" ? (
              <div className="feat-unlock">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/icons/lock.svg" alt="" />
                  <strong>{connected.length} of 6 connected</strong>
                  <span>{canCompare ? "Compare is open." : "Need two apps."}</span>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setConnectOpen(true)}>
                  {canCompare ? "Manage platforms" : "Connect platforms"}
                </button>
              </div>
            ) : null}

            {active === "food" ? (
              <div className="feat-prices">
                {FOOD_COMPARE_DEMO.map((item) => (
                  <div key={item.id} className={`feat-price ${item.best ? "best" : ""}`}>
                    <PlatformLogo platform={item.id} size={36} />
                    <span>{item.name}</span>
                    <b>₹{item.price}</b>
                    {item.best ? <em>Best demo</em> : <em>Demo</em>}
                  </div>
                ))}
              </div>
            ) : null}

            {active === "grocery" ? (
              <div className="feat-grocery">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/grocery/amul-gold-1l.jpg" alt="Amul Gold Milk" />
                <div className="feat-prices">
                  {GROCERY_COMPARE_DEMO.map((item) => (
                    <div key={item.id} className={`feat-price ${item.best ? "best" : ""}`}>
                      <PlatformLogo platform={item.id} size={32} />
                      <span>{item.name}</span>
                      <b>₹{item.price}</b>
                      {item.best ? <em>Best demo</em> : <em>Demo</em>}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {active === "cart" ? (
              <div className="feat-cart">
                <div className="feat-cart-bubble">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/icons/cart-btn.svg" alt="" />
                  <span>1</span>
                </div>
                <p>Bottom right. Pops when the count goes up. Hidden on an empty cart.</p>
              </div>
            ) : null}

            {active === "handoff" ? (
              <ol className="feat-steps">
                <li>
                  <strong>Compare</strong>
                  <span>See demo totals side by side.</span>
                </li>
                <li>
                  <strong>Pick</strong>
                  <span>Choose the cheaper app.</span>
                </li>
                <li>
                  <strong>Order there</strong>
                  <span>Kisse Loon does not invent a checkout.</span>
                </li>
              </ol>
            ) : null}

            <div className="feat-actions">
              {canCompare ? (
                <Link href={active === "grocery" || active === "cart" ? "/grocery" : "/food"} className="btn btn-primary">
                  Try it
                </Link>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => setConnectOpen(true)}>
                  Connect 2 apps
                </button>
              )}
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
