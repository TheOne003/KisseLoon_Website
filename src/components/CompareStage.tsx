"use client";

import { PlatformLogo } from "@/components/PlatformLogo";
import { FOOD_COMPARE_DEMO, GROCERY_COMPARE_DEMO } from "@/lib/site";
import type { SearchMode } from "@/lib/searchRouting";

export function CompareStage({ mode }: { mode: SearchMode }) {
  const food = mode === "food";
  const lanes = food ? FOOD_COMPARE_DEMO : GROCERY_COMPARE_DEMO;
  const item = food ? "Chicken Biryani" : "Amul Gold Milk";
  const winner = lanes.find((lane) => lane.best);

  return (
    <aside className="compare-stage" aria-label="Demo price comparison">
      <div className="compare-stage-top">
        <p className="compare-stage-kicker">Live compare</p>
        <span className="demo-badge">Demo prices</span>
      </div>
      <h2>{item}</h2>
      <p className="compare-stage-sub">Same item. Three apps. One better price.</p>
      <div className="compare-track" key={mode}>
        {lanes.map((lane, index) => (
          <div
            key={lane.id}
            className={`compare-lane ${lane.best ? "best" : ""}`}
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="compare-runner" style={{ animationDelay: `${index * 0.18}s` }}>
              <PlatformLogo platform={lane.id} size={36} />
            </div>
            <div className="compare-lane-meta">
              <span>{lane.name}</span>
              <strong className={lane.best ? "best-price" : ""}>₹{lane.price}</strong>
            </div>
          </div>
        ))}
      </div>
      {winner ? <p className="compare-winner">Best on {winner.name}</p> : null}
    </aside>
  );
}
