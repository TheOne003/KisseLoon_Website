"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import type { RaceResult } from "@/lib/types";
import { ScreenHeader } from "./Header";
import { PlatformLogo } from "./PlatformLogo";

export function RaceAnimation({
  race,
  location,
  sessionKey,
  onFinished,
  onBack,
  backHref,
}: {
  race: RaceResult;
  location?: string;
  sessionKey: string | number;
  onFinished: () => void;
  onBack?: () => void;
  backHref?: string;
}) {
  const [progress, setProgress] = useState<number[]>(() => race.racers.map(() => 0));
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    finishedRef.current = false;
    setDone(false);
    setProgress(race.racers.map(() => 0));

    const reduced = prefersReducedMotion();
    const timeouts: number[] = [];
    const fallbackMs = Math.max(...race.racers.map((r) => r.duration), 1700) + 2500;

    const complete = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinishedRef.current();
    };

    race.racers.forEach((racer, index) => {
      timeouts.push(
        window.setTimeout(() => {
          setProgress((prev) => {
            const next = [...prev];
            next[index] = racer.progress;
            return next;
          });
        }, reduced ? 0 : 80 + index * 120),
      );
    });

    const longest = reduced ? 200 : Math.max(...race.racers.map((r) => r.duration)) + 180;
    timeouts.push(
      window.setTimeout(() => {
        setDone(true);
        timeouts.push(window.setTimeout(complete, reduced ? 50 : 900));
      }, longest),
    );
    timeouts.push(window.setTimeout(complete, fallbackMs));

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [sessionKey, race]);

  return (
    <div className="screen">
      <ScreenHeader title="Price race" subtitle={location || "Comparing demo platform prices"} backHref={backHref} onBack={onBack} />
      <div className="screen-body narrow stack">
        <span className="demo-badge">Demo comparison</span>
        <div className="race-stage">
          {race.racers.map((racer, index) => (
            <div key={racer.id} className="lane" style={{ background: racer.laneBg }}>
              <div
                className="trail"
                style={{
                  width: `${Math.max(8, progress[index] * 100)}%`,
                  background: racer.trailColor,
                  transition: `width ${racer.duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
              />
              <div
                className="racer"
                style={{
                  left: `calc(${progress[index] * 72}% + 8px)`,
                  transition: `left ${racer.duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
              >
                <PlatformLogo platform={racer} size={44} />
                <div className="racer-stats">
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{racer.name}</div>
                  <div className="price" style={{ color: racer.priceColor }}>
                    ₹{racer.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h2 style={{ margin: "0 0 6px" }}>{race.savingsTitle}</h2>
          <p className="muted">{race.savingsSubtitle}</p>
          {done ? (
            <p className="save" style={{ marginTop: 8 }}>
              Opening the next step…
            </p>
          ) : (
            <p className="muted">Racing across available platforms…</p>
          )}
        </div>
      </div>
    </div>
  );
}
