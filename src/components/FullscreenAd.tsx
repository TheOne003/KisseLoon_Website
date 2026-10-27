"use client";

import { useEffect, useRef, useState } from "react";
import { FULLSCREEN_AD, FULLSCREEN_AD_MS } from "@/lib/services/adsService";
import { prefersReducedMotion } from "@/lib/motion";

export function FullscreenAd({
  onDone,
  label,
}: {
  onDone: () => void;
  label: string;
}) {
  const [seconds, setSeconds] = useState(Math.ceil(FULLSCREEN_AD_MS / 1000));
  const done = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      onDone();
    };

    const duration = prefersReducedMotion() ? 400 : FULLSCREEN_AD_MS;
    const started = Date.now();
    const tick = window.setInterval(() => {
      const remaining = Math.max(0, duration - (Date.now() - started));
      setSeconds(Math.ceil(remaining / 1000));
    }, 200);
    const timer = window.setTimeout(finish, duration);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(tick);
    };
  }, [onDone]);

  return (
    <div className="fullscreen-ad" role="dialog" aria-label={label}>
      <div className="card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FULLSCREEN_AD.image} alt="" style={{ width: "100%", height: 220, objectFit: "cover" }} />
        <div style={{ padding: 20, color: "var(--text)", textAlign: "left" }}>
          <span className="demo-badge">Ad placeholder</span>
          <p className="muted" style={{ marginTop: 10, letterSpacing: "0.08em", fontSize: 11 }}>
            {FULLSCREEN_AD.eyebrow}
          </p>
          <h2 style={{ margin: "6px 0" }}>{FULLSCREEN_AD.title}</h2>
          <p className="muted">{FULLSCREEN_AD.subtitle}</p>
          <p style={{ marginTop: 12, fontWeight: 700 }}>Continuing in {seconds}s</p>
        </div>
      </div>
      <button type="button" className="skip" onClick={onDone}>
        Skip
      </button>
    </div>
  );
}
