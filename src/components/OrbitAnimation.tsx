"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CART_ORBIT_COPY,
  CART_ORBIT_HUB,
  CART_ORBIT_PHASE_MS,
  CART_ORBIT_PLATFORMS,
  CART_ORBIT_RINGS,
  FOOD_ORBIT_PLATFORMS,
  getCartChipLabel,
} from "@/lib/data/orbit";
import { prefersReducedMotion } from "@/lib/motion";
import type { CartLine, OrbitCopy } from "@/lib/types";
import { ScreenHeader } from "./Header";
import { PlatformLogo } from "./PlatformLogo";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function OrbitAnimation({
  items,
  copy = CART_ORBIT_COPY,
  sessionKey,
  variant = "grocery",
  onFinished,
  onBack,
  backHref,
}: {
  items: CartLine[];
  copy?: OrbitCopy;
  sessionKey: string | number;
  variant?: "grocery" | "food" | "mixed";
  onFinished: () => void;
  onBack?: () => void;
  backHref?: string;
}) {
  const platforms = variant === "food" ? FOOD_ORBIT_PLATFORMS : CART_ORBIT_PLATFORMS;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const finishedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;
  const phase = copy.phases[Math.min(phaseIndex, copy.phases.length - 1)];

  const chips = useMemo(() => items.slice(0, 4).map(getCartChipLabel), [items]);

  useEffect(() => {
    finishedRef.current = false;
    setPhaseIndex(0);
    const reduced = prefersReducedMotion();
    const timeouts: number[] = [];
    let raf = 0;
    const start = performance.now();

    const complete = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinishedRef.current();
    };

    if (reduced) {
      setPhaseIndex(copy.phases.length - 1);
      timeouts.push(window.setTimeout(complete, 250));
      return () => timeouts.forEach((id) => window.clearTimeout(id));
    }

    const loop = (now: number) => {
      setTick(now - start);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    copy.phases.forEach((_, index) => {
      timeouts.push(
        window.setTimeout(() => setPhaseIndex(index), index * CART_ORBIT_PHASE_MS),
      );
    });

    const total = copy.phases.length * CART_ORBIT_PHASE_MS + 900;
    timeouts.push(window.setTimeout(complete, total));
    timeouts.push(window.setTimeout(complete, total + 4000));

    return () => {
      cancelAnimationFrame(raf);
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [sessionKey, copy.phases, copy.phases.length]);

  return (
    <div className="screen">
      <ScreenHeader
        title={copy.headerTitle}
        subtitle={copy.headerSubtitle}
        backHref={backHref}
        onBack={onBack}
      />
      <div className="screen-body narrow stack">
        <span className="demo-badge">Demo comparison</span>
        <div className="card" style={{ padding: 16 }}>
          <p className="muted" style={{ marginTop: 0 }}>
            {copy.listTitle}
          </p>
          <div className="row" style={{ flexWrap: "wrap" }}>
            {chips.map((chip) => (
              <span key={chip} className="pill" style={{ background: "#eef2ff" }}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div className="orbit-canvas" aria-hidden="true">
            {CART_ORBIT_RINGS.map((size) => (
              <div
                key={size}
                className="orbit-ring"
                style={{ width: size, height: size }}
              />
            ))}
            {platforms.map((platform) => {
              const elapsed = tick / platform.periodMs;
              const start = toRad(platform.startDeg);
              const angle = start + elapsed * Math.PI * 2 * (platform.clockwise ? 1 : -1);
              const collapse = phase.complete ? 0.15 : 1;
              const x = CART_ORBIT_HUB.x + Math.cos(angle) * platform.radius * collapse - 22;
              const y = CART_ORBIT_HUB.y + Math.sin(angle) * platform.radius * collapse - 22;
              return (
                <div
                  key={platform.id}
                  className="orbit-node"
                  style={{
                    left: x,
                    top: y,
                    transform: `scale(${phase.complete ? 1.05 : 1})`,
                  }}
                >
                  <PlatformLogo platform={platform} size={44} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${Math.round(phase.progress * 100)}%` }} />
          </div>
          <h2 style={{ margin: "14px 0 6px" }}>{phase.bannerTitle || phase.title}</h2>
          <p className="muted">{phase.bannerSubtitle || phase.subtitle}</p>
          {phase.statusTitle ? (
            <p style={{ marginTop: 10, fontWeight: 700 }}>{phase.statusTitle}</p>
          ) : null}
          <p className="muted">{phase.statusSubtitle || copy.noteText}</p>
        </div>
      </div>
    </div>
  );
}
