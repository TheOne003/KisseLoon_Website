import { getDemoSearchResult, normalizeSearchQuery, POPULAR_DISHES } from "./data/foodSearch";
import { GROCERY_CATALOG, searchGroceryCatalog } from "./data/groceryCatalog";

export type SearchMode = "food" | "grocery";

export type SearchSuggestion = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
};

export function foodSearchHref(query: string): string {
  const result = getDemoSearchResult(query);
  if (result) {
    return `/food/results?q=${encodeURIComponent(result.query)}`;
  }
  return `/food?q=${encodeURIComponent(query.trim())}`;
}

export function grocerySearchHref(query: string): string {
  const trimmed = query.trim() || "Amul Gold Milk";
  return `/grocery/results?q=${encodeURIComponent(trimmed)}`;
}

export function searchHref(query: string, mode: SearchMode): string {
  return mode === "grocery" ? grocerySearchHref(query) : foodSearchHref(query);
}

function foodSuggestions(): SearchSuggestion[] {
  const seen = new Set<string>();
  const items: SearchSuggestion[] = [];
  for (const dish of POPULAR_DISHES) {
    const key = normalizeSearchQuery(dish.name);
    if (seen.has(key)) continue;
    seen.add(key);
    const result = getDemoSearchResult(dish.name);
    items.push({
      id: dish.id,
      name: dish.name,
      subtitle: result ? `${result.restaurants.length} restaurants` : dish.platforms,
      image: dish.image,
      href: searchHref(dish.name, "food"),
    });
  }
  return items;
}

export function suggestSearchItems(query: string, mode: SearchMode): SearchSuggestion[] {
  const q = normalizeSearchQuery(query);
  if (mode === "food") {
    const items = foodSuggestions();
    if (!q) return items;
    return items.filter((item) => normalizeSearchQuery(item.name).includes(q));
  }
  const products = q ? searchGroceryCatalog(query) : GROCERY_CATALOG.slice(0, 6);
  return products.slice(0, 8).map((product) => ({
    id: product.id,
    name: product.name,
    subtitle: `${product.brand} · ${product.details}`,
    image: product.image,
    href: grocerySearchHref(product.name),
  }));
}
