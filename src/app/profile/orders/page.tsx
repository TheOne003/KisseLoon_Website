"use client";

import { useState } from "react";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { DEMO_ORDERS } from "@/lib/data/account";

export default function OrdersPage() {
  const [tab, setTab] = useState("all");
  const orders = DEMO_ORDERS.filter((order) => tab === "all" || order.category === tab);

  return (
    <SiteShell>
      <PageHeading title="Order history" subtitle="Demo orders" />
      <div className="stack">
        <div className="chip-row">
          {["all", "food", "grocery"].map((id) => (
            <button key={id} type="button" className={`chip ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
              {id}
            </button>
          ))}
        </div>
        {orders.map((order) => (
          <article key={order.id} className="card" style={{ padding: 14 }}>
            <div className="row space-between">
              <strong>{order.id}</strong>
              <span className={order.status === "cancelled" ? "error-text" : "save"}>{order.status}</span>
            </div>
            <p className="muted">{order.dateLabel}</p>
            <p>{order.items}</p>
            <div className="row space-between">
              <span>{order.platform}</span>
              <strong>₹{order.total}</strong>
            </div>
            <button type="button" className="btn btn-ghost" disabled>
              Reorder (not connected)
            </button>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}
