"use client";

import { useState } from "react";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { DEMO_NOTIFICATIONS } from "@/lib/data/account";

export default function NotificationsPage() {
  const [items, setItems] = useState(DEMO_NOTIFICATIONS);
  const sections = ["today", "yesterday"] as const;

  return (
    <SiteShell>
      <PageHeading title="Notifications" />
      <div className="stack">
        {sections.map((section) => (
          <section key={section}>
            <h3 style={{ textTransform: "capitalize" }}>{section}</h3>
            <div className="stack">
              {items
                .filter((item) => item.section === section)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="card"
                    style={{ padding: 14, textAlign: "left", border: 0, opacity: item.unread ? 1 : 0.7 }}
                    onClick={() =>
                      setItems((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, unread: false } : entry)))
                    }
                  >
                    <strong>{item.title}</strong>
                    <p className="muted" style={{ margin: "4px 0 0" }}>
                      {item.timeLabel}
                      {item.unread ? " · unread" : ""}
                    </p>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    </SiteShell>
  );
}
