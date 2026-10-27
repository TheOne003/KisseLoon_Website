export const CONNECTABLE_PLATFORMS = [
  { id: "swiggy", name: "Swiggy", kind: "food" as const },
  { id: "zomato", name: "Zomato", kind: "food" as const },
  { id: "toing", name: "Toing", kind: "food" as const },
  { id: "blinkit", name: "Blinkit", kind: "grocery" as const },
  { id: "zepto", name: "Zepto", kind: "grocery" as const },
  { id: "instamart", name: "Instamart", kind: "grocery" as const },
] as const;

export type ConnectableId = (typeof CONNECTABLE_PLATFORMS)[number]["id"];

export const MIN_COMPARE_PLATFORMS = 2;

export const COMPARE_LOCK_PREFIXES = [
  "/food/results",
  "/food/race",
  "/food/menu",
  "/food/item",
  "/grocery/results",
  "/grocery/search",
  "/grocery/race",
  "/grocery/product",
  "/cart/orbit",
  "/cart/platforms",
];

export function isCompareLockedPath(pathname: string): boolean {
  return COMPARE_LOCK_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function getConnectable(id: string) {
  return CONNECTABLE_PLATFORMS.find((platform) => platform.id === id) || null;
}
