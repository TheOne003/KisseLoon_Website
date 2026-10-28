"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getCartSummary } from "@/lib/cart";
import {
  CART_ORBIT_CANVAS,
  CART_ORBIT_COLLAPSE_MS,
  CART_ORBIT_COPY,
  CART_ORBIT_EXPAND_MS,
  CART_ORBIT_HUB,
  CART_ORBIT_PHASE_MS,
  CART_ORBIT_PLATFORMS,
  CART_ORBIT_RINGS,
  FOOD_ORBIT_PLATFORMS,
  getCartChipLabel,
} from "@/lib/data/orbit";
import { prefersReducedMotion } from "@/lib/motion";
import { ORBIT_AD } from "@/lib/services/adsService";
import type { CartLine, OrbitCopy } from "@/lib/types";
import { HomeAd } from "./HomeAd";
import { PlatformLogo } from "./PlatformLogo";
import { PageHeading, SiteShell } from "./SiteShell";

type OrbitPlatform = (typeof CART_ORBIT_PLATFORMS)[number];
type OrbitMode = "orbit" | "collapse" | "expand" | "done";

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function shortestAngleDelta(from: number, to: number) {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function nodeAt(angle: number, radiusMul: number, platform: OrbitPlatform, scale: number) {
  const node = 44 * scale;
  const hubX = CART_ORBIT_HUB.x * scale;
  const hubY = CART_ORBIT_HUB.y * scale;
  const radius = platform.radius * scale * radiusMul;
  return {
    left: hubX + Math.cos(angle) * radius - node / 2,
    top: hubY + Math.sin(angle) * radius - node / 2,
  };
}

function CheckIcon({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.5 17 19 7.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SyncIcon({ size = 12, color = "#45464D" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 0 1-13.2 6.1M4 12a8 8 0 0 1 13.2-6.1"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.2 18.6V14.2H10.4M17.8 5.4v4.4h-4.2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v16M5 8h14" stroke="#45464d" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M5 8 3 14a3.2 3.2 0 0 0 6.4 0L7.4 8M19 8l-2 6a3.2 3.2 0 0 0 6.4 0L21.4 8"
        stroke="#45464d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.5 13.4 9l4.6 1.4L13.4 11.8 12 16.5 10.6 11.8 6 11.4 10.6 9 12 4.5Z"
        stroke="#059669"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M18 14.5 18.6 16.2 20.4 16.8 18.6 17.4 18 19.1 17.4 17.4 15.6 16.8 17.4 16.2 18 14.5Z" fill="#059669" />
    </svg>
  );
}

export function OrbitAnimation({
  items,
  copy = CART_ORBIT_COPY,
  sessionKey,
  variant = "grocery",
  onFinished,
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
  const phases = copy.phases?.length ? copy.phases : CART_ORBIT_COPY.phases;
  const summary = useMemo(() => getCartSummary(items), [items]);
  const chips = useMemo(
    () =>
      items.slice(0, 4).map((item) => ({
        id: item.id,
        label: getCartChipLabel(item),
        category: item.category,
      })),
    [items],
  );

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [canvasW, setCanvasW] = useState(CART_ORBIT_CANVAS.width);
  const scale = canvasW / CART_ORBIT_CANVAS.width;
  const canvasH = Math.round((canvasW / CART_ORBIT_CANVAS.width) * CART_ORBIT_CANVAS.height);
  const nodeSize = 44 * scale;
  const checkSize = 18 * scale;
  const hubX = CART_ORBIT_HUB.x * scale;
  const hubY = CART_ORBIT_HUB.y * scale;

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [hubComplete, setHubComplete] = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const [fillProgress, setFillProgress] = useState(phases[0]?.progress ?? 0.15);

  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const platformsRef = useRef(platforms);
  const phasesRef = useRef(phases);
  const scaleRef = useRef(scale);
  const phaseIndexRef = useRef(0);
  const anglesRef = useRef(platforms.map((p) => (p.startDeg * Math.PI) / 180));
  const radiusMulRef = useRef(1);
  const modeRef = useRef<OrbitMode>("orbit");
  const finaleStartedAt = useRef(0);
  const collapseFromAngles = useRef<number[]>([]);
  const checksShownRef = useRef(false);
  const navigated = useRef(false);
  const onFinishedRef = useRef(onFinished);

  platformsRef.current = platforms;
  phasesRef.current = phases;
  scaleRef.current = scale;
  onFinishedRef.current = onFinished;

  const applyNodes = (angles: number[], radiusMul: number) => {
    const list = platformsRef.current;
    const s = scaleRef.current;
    angles.forEach((angle, index) => {
      const el = nodeRefs.current[index];
      const platform = list[index];
      if (!el || !platform) return;
      const pos = nodeAt(angle, radiusMul, platform, s);
      el.style.left = `${pos.left}px`;
      el.style.top = `${pos.top}px`;
    });
  };

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const next = Math.min(Math.max(Math.floor(el.clientWidth), 280), 720);
      setCanvasW(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    applyNodes(anglesRef.current, radiusMulRef.current);
  }, [scale, variant]);

  useEffect(() => {
    const list = platformsRef.current;
    const steps = phasesRef.current;
    navigated.current = false;
    checksShownRef.current = false;
    modeRef.current = "orbit";
    radiusMulRef.current = 1;
    phaseIndexRef.current = 0;
    anglesRef.current = list.map((p) => (p.startDeg * Math.PI) / 180);
    setPhaseIndex(0);
    setHubComplete(false);
    setShowChecks(false);
    setFillProgress(steps[0]?.progress ?? 0.15);

    const reduced = prefersReducedMotion();
    if (reduced) {
      modeRef.current = "done";
      anglesRef.current = list.map((p) => (p.settleDeg * Math.PI) / 180);
      applyNodes(anglesRef.current, 1);
      setPhaseIndex(Math.max(steps.length - 1, 0));
      setFillProgress(1);
      setShowChecks(true);
      setHubComplete(true);
      return;
    }

    applyNodes(anglesRef.current, 1);

    let rafId = 0;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      const current = phasesRef.current[phaseIndexRef.current];
      const mode = modeRef.current;
      const orbitList = platformsRef.current;

      if (mode === "orbit" && !current?.complete) {
        const speed = current?.speed ?? 1;
        anglesRef.current = anglesRef.current.map((angle, index) => {
          const platform = orbitList[index];
          if (!platform) return angle;
          const omega =
            ((2 * Math.PI) / (platform.periodMs / 1000)) * speed * (platform.clockwise ? 1 : -1);
          return angle + omega * dt;
        });
        radiusMulRef.current = 1;
      } else if (mode === "collapse" || mode === "expand") {
        const elapsed = now - finaleStartedAt.current;
        if (mode === "collapse") {
          const t = Math.min(elapsed / CART_ORBIT_COLLAPSE_MS, 1);
          const e = easeInOut(t);
          radiusMulRef.current = 1 - e * 0.95;
          anglesRef.current = collapseFromAngles.current.map((from, index) => {
            const to = ((orbitList[index]?.settleDeg ?? 0) * Math.PI) / 180;
            return from + shortestAngleDelta(from, to) * e;
          });
          if (t >= 1) {
            modeRef.current = "expand";
            finaleStartedAt.current = now;
            anglesRef.current = orbitList.map((p) => (p.settleDeg * Math.PI) / 180);
          }
        } else {
          const t = Math.min(elapsed / CART_ORBIT_EXPAND_MS, 1);
          const e = easeInOut(t);
          const far = 1.15;
          radiusMulRef.current = t < 0.75 ? 0.05 + e * far : far - ((t - 0.75) / 0.25) * (far - 1);
          if (t >= 0.6 && !checksShownRef.current) {
            checksShownRef.current = true;
            setShowChecks(true);
            setHubComplete(true);
          }
          if (t >= 1) {
            radiusMulRef.current = 1;
            modeRef.current = "done";
            if (!checksShownRef.current) {
              checksShownRef.current = true;
              setShowChecks(true);
              setHubComplete(true);
            }
          }
        }
      }

      applyNodes(anglesRef.current, radiusMulRef.current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const timers = steps.map((_, index) =>
      window.setTimeout(() => {
        const nextSteps = phasesRef.current;
        phaseIndexRef.current = index;
        setPhaseIndex(index);
        setFillProgress(nextSteps[index]?.progress ?? 0);
        if (nextSteps[index]?.complete && modeRef.current === "orbit") {
          modeRef.current = "collapse";
          finaleStartedAt.current = performance.now();
          collapseFromAngles.current = [...anglesRef.current];
        }
      }, index * CART_ORBIT_PHASE_MS),
    );

    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [sessionKey, variant]);

  const phase = phases[phaseIndex] || phases[0];
  const percent = Math.round((phase?.progress || 0) * 100);
  const uiComplete = hubComplete || Boolean(phase?.complete);
  const completePhase = phases.find((step) => step.complete) || phases[phases.length - 1];

  const handleFinish = () => {
    if (navigated.current) return;
    navigated.current = true;
    onFinishedRef.current();
  };

  return (
    <SiteShell>
      <PageHeading title={copy.headerTitle} subtitle={copy.headerSubtitle} />
      <HomeAd ad={ORBIT_AD} variant="leaderboard" />
      <div className="orbit-layout">
        <div className="orbit-stage">
          <div className="orbit-stage-frame" ref={stageRef}>
            <div className="orbit-canvas" style={{ width: canvasW, height: canvasH }} aria-hidden="true">
          <div className="orbit-rings">
            {CART_ORBIT_RINGS.map((size) => (
              <div
                key={size}
                className="orbit-ring"
                style={{ width: size * scale, height: size * scale }}
              />
            ))}
          </div>

          <div
            className={`orbit-hub ${hubComplete ? "is-complete" : ""}`}
            style={{
              left: hubX - 40 * scale,
              top: hubY - 40 * scale,
              width: 80 * scale,
              height: 80 * scale,
            }}
          >
            {hubComplete ? (
              <>
                <span className="orbit-hub-peach" style={{ width: 92 * scale, height: 92 * scale }} />
                <span className="orbit-hub-outer is-complete" style={{ width: 74 * scale, height: 74 * scale }}>
                  <span className="orbit-hub-inner is-complete" style={{ width: 62 * scale, height: 62 * scale }}>
                    <CheckIcon size={28 * scale} color="#059669" />
                  </span>
                </span>
              </>
            ) : (
              <span className="orbit-hub-outer" style={{ width: 78 * scale, height: 78 * scale }}>
                <span className="orbit-hub-inner" style={{ width: 68 * scale, height: 68 * scale }}>
                  <strong style={{ fontSize: 12 * scale }}>KISSE</strong>
                  <em style={{ fontSize: 12 * scale }}>LOON</em>
                </span>
              </span>
            )}
          </div>

          {platforms.map((platform, index) => (
              <div
                key={platform.id}
                className="orbit-node"
                ref={(el) => {
                  nodeRefs.current[index] = el;
                }}
                style={{
                  width: nodeSize,
                  height: nodeSize,
                }}
              >
                {showChecks ? (
                  <span className="orbit-badge" style={{ background: platform.color, width: nodeSize - 6 * scale, height: nodeSize - 6 * scale }}>
                    <CheckIcon size={checkSize} />
                  </span>
                ) : (
                  <PlatformLogo platform={platform} size={nodeSize - 6 * scale} />
                )}
              </div>
          ))}
            </div>
          </div>
        </div>

        <aside className="orbit-side">
          <div className="orbit-cart-card">
            <div className="orbit-cart-top">
              <div className="orbit-cart-title-row">
                <p className="orbit-cart-title">{copy.listTitle}</p>
                <span className="orbit-count-badge">
                  {summary.totalCount} item{summary.totalCount === 1 ? "" : "s"}
                </span>
              </div>
              <div className="orbit-sync-row">
                <span className="orbit-spin" aria-hidden="true">
                  <SyncIcon />
                </span>
                <span>Auto Sync</span>
              </div>
            </div>
            <div className="orbit-chips">
              {chips.map((chip) => (
                <span key={chip.id} className="orbit-chip">
                  <i className={`orbit-chip-dot ${chip.category === "grocery" ? "is-grocery" : "is-food"}`} />
                  {chip.label}
                </span>
              ))}
            </div>
            <div className="orbit-note">
              <ScaleIcon />
              <p>{copy.noteText}</p>
            </div>
          </div>

          {uiComplete && showChecks ? (
            <div className="orbit-banner">
              <div className="orbit-banner-title">
                <SparklesIcon />
                <strong>{completePhase?.bannerTitle}</strong>
              </div>
              <p>{completePhase?.bannerSubtitle}</p>
            </div>
          ) : (
            <div className="orbit-message">
              {phase?.title ? <h2>{phase.title}</h2> : null}
              {phase?.subtitle ? <p>{phase.subtitle}</p> : null}
            </div>
          )}

          <div className="orbit-progress">
            <div className="orbit-progress-track">
              <div
                className={`orbit-progress-fill ${showChecks ? "is-done" : ""}`}
                style={{ width: `${Math.round(fillProgress * 100)}%` }}
              />
            </div>
            <p>{percent}% Complete</p>
          </div>

          {uiComplete && showChecks ? (
            <button type="button" className="orbit-cta" onClick={handleFinish}>
              {completePhase?.ctaLabel || "View Best Deal →"}
            </button>
          ) : (
            <div className="orbit-status">
              <div className="orbit-status-left">
                <span className="orbit-status-icon">
                  <span className="orbit-spin" aria-hidden="true">
                    <SyncIcon size={18} color="#684000" />
                  </span>
                </span>
                <div>
                  {phase?.statusTitle ? <strong>{phase.statusTitle}</strong> : null}
                  {phase?.statusSubtitle ? <p>{phase.statusSubtitle}</p> : null}
                </div>
              </div>
              <div className="orbit-dots" aria-hidden="true">
                <i className="orbit-dot" />
                <i className="orbit-dot" />
                <i className="orbit-dot" />
              </div>
            </div>
          )}
        </aside>
      </div>
    </SiteShell>
  );
}
