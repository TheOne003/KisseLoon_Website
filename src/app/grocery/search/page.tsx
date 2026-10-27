"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { getDemoGrocerySearch } from "@/lib/data/groceryCatalog";

function Search() {
  const params = useSearchParams();
  const initial = params.get("q") || "Amul Gold Milk";
  const [query, setQuery] = useState(initial);
  const result = useMemo(() => getDemoGrocerySearch(query), [query]);
  const router = useRouter();

  const openResults = (name: string) => {
    router.push(`/grocery/results?q=${encodeURIComponent(name)}`);
  };

  return (
    <SiteShell>
      <PageHeading eyebrow="Grocery" title="Search grocery" subtitle="Grocery results stay on the grocery journey." />
      <div className="stack">
        <div className="search-bar">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search grocery products"
            aria-label="Search grocery products"
            autoFocus
          />
        </div>
        {result.products.map((product) => (
          <button
            key={product.id}
            type="button"
            className="card"
            style={{ padding: 14, textAlign: "left", border: 0 }}
            onClick={() => openResults(product.name)}
          >
            <strong>{product.name}</strong>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              {product.subtitle}
            </p>
          </button>
        ))}
        {result.related.length ? <h3 style={{ margin: 0 }}>Related</h3> : null}
        {result.related.map((item) => (
          <button
            key={item.id}
            type="button"
            className="btn"
            style={{ justifyContent: "flex-start", background: "#fff" }}
            onClick={() => openResults(`${item.brand}${item.rest}`.trim())}
          >
            <strong>{item.brand}</strong>
            {item.rest}
          </button>
        ))}
        {!result.products.length && query.trim() ? (
          <p className="muted">No grocery matches. Try milk, fruit, snacks, or a brand name.</p>
        ) : null}
      </div>
    </SiteShell>
  );
}

export default function GrocerySearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
