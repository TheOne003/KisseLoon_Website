import { getDemoSearchResult } from "./data/foodSearch";
import { searchGroceryCatalog } from "./data/groceryCatalog";

export type SearchMode = "food" | "grocery";

export function foodSearchHref(query: string): string {
  const result = getDemoSearchResult(query);
  if (result) {
    return `/food/results?q=${encodeURIComponent(result.query)}`;
  }
  return `/food?q=${encodeURIComponent(query.trim())}`;
}

export function grocerySearchHref(query: string): string {
  const trimmed = query.trim() || "Amul Gold Milk";
  const matches = searchGroceryCatalog(trimmed);
  if (matches.length) {
    return `/grocery/results?q=${encodeURIComponent(trimmed)}`;
  }
  return `/grocery/results?q=${encodeURIComponent(trimmed)}`;
}

export function searchHref(query: string, mode: SearchMode): string {
  return mode === "grocery" ? grocerySearchHref(query) : foodSearchHref(query);
}
