"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import type { RaceResult } from "@/lib/types";
import { PlatformLogo } from "./PlatformLogo";
import { PageHeading, SiteShell } from "./SiteShell";

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
    <SiteShell>
      {backHref ? (
        <Link href={backHref} className="page-back" onClick={onBack}>
          ← Back
        </Link>
      ) : null}
      <PageHeading
        eyebrow="Demo comparison"
        title="Price race"
        subtitle={location || "Comparing demo platform prices"}
      />
      <div className="race-page">
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
                <PlatformLogo platform={racer} size={48} />
                <div className="racer-stats">
                  <div className="racer-name">{racer.name}</div>
                  <div className="price" style={{ color: racer.priceColor }}>
                    ₹{racer.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="race-aside">
          <span className="demo-badge">Demo comparison</span>
          <h2>{race.savingsTitle}</h2>
          <p className="muted">{race.savingsSubtitle}</p>
          {done ? (
            <p className="save">Opening the next step…</p>
          ) : (
            <p className="muted">Racing across available platforms…</p>
          )}
        </aside>
      </div>
    </SiteShell>
  );
}
