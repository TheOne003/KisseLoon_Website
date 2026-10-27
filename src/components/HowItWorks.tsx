"use client";

import { useEffect, useRef } from "react";
import { PlatformLogo } from "@/components/PlatformLogo";
import { FOOD_COMPARE_DEMO } from "@/lib/site";

const WINNER = FOOD_COMPARE_DEMO.find((lane) => lane.best) ?? FOOD_COMPARE_DEMO[0];

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const start = () => node.classList.add("how-on");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    const fallback = window.setTimeout(start, 1800);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section className="how how-play" id="how-it-works" ref={ref} aria-label="How it works">
      <p className="compare-label">How it works</p>
      <div className="how-grid">
        <article className="how-card how-step how-step-search">
          <span>01</span>
          <h2>Search</h2>
          <p>A dish or a grocery item.</p>
          <div className="how-demo" aria-hidden="true">
            <div className="how-search">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/icons/search.svg" alt="" />
              <span className="how-type">Chicken Biryani</span>
            </div>
            <div className="how-hit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/food/biryani.jpg" alt="" />
              <div>
                <strong>Chicken Biryani</strong>
                <em>3 apps ready</em>
              </div>
            </div>
          </div>
        </article>

        <article className="how-card how-step how-step-race">
          <span>02</span>
          <h2>Race</h2>
          <p>Prices run across delivery apps.</p>
          <div className="how-demo" aria-hidden="true">
            <div className="how-lanes">
              {FOOD_COMPARE_DEMO.map((lane) => (
                <div key={lane.id} className={`how-lane ${lane.best ? "best" : ""}`}>
                  <PlatformLogo platform={lane.id} size={26} />
                  <span className="how-bar">
                    <span />
                  </span>
                  <b>₹{lane.price}</b>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="how-card how-step how-step-pick">
          <span>03</span>
          <h2>Pick</h2>
          <p>Order on the app that wins.</p>
          <div className="how-demo" aria-hidden="true">
            <div className="how-pick">
              <PlatformLogo platform={WINNER.id} size={44} />
              <strong>{WINNER.name}</strong>
              <b>₹{WINNER.price}</b>
              <em>Best demo price · Open this app</em>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
