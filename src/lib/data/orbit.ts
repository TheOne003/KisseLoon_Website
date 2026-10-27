import type { CartLine, OrbitCopy, OrbitPhase } from "../types";

export const CART_ORBIT_CANVAS = { width: 358, height: 220 };
export const CART_ORBIT_HUB = { x: 179, y: 110 };

export const CART_ORBIT_PLATFORMS = [
  {
    id: "blinkit",
    name: "Blinkit",
    letter: "B",
    color: "#f8cc26",
    textColor: "#1a1a1a",
    radius: 86,
    startDeg: -90,
    settleDeg: -90,
    clockwise: true,
    periodMs: 1800,
  },
  {
    id: "zepto",
    name: "Zepto",
    letter: "Z",
    color: "#8b2fc9",
    textColor: "#ffffff",
    radius: 86,
    startDeg: 30,
    settleDeg: 150,
    clockwise: true,
    periodMs: 1800,
  },
  {
    id: "instamart",
    name: "Instamart",
    letter: "I",
    color: "#f2702e",
    textColor: "#ffffff",
    radius: 86,
    startDeg: 150,
    settleDeg: 30,
    clockwise: true,
    periodMs: 1800,
  },
];

export const FOOD_ORBIT_PLATFORMS = [
  {
    id: "swiggy",
    name: "Swiggy",
    letter: "S",
    color: "#fc8019",
    textColor: "#ffffff",
    radius: 86,
    startDeg: -90,
    settleDeg: -90,
    clockwise: true,
    periodMs: 1800,
  },
  {
    id: "zomato",
    name: "Zomato",
    letter: "Z",
    color: "#cb202d",
    textColor: "#ffffff",
    radius: 86,
    startDeg: 30,
    settleDeg: 150,
    clockwise: true,
    periodMs: 1800,
  },
  {
    id: "toing",
    name: "Toing",
    letter: "T",
    color: "#059669",
    textColor: "#ffffff",
    radius: 86,
    startDeg: 150,
    settleDeg: 30,
    clockwise: true,
    periodMs: 1800,
  },
];

export const CART_ORBIT_RINGS = [172, 128];

export const CART_ORBIT_PHASES: OrbitPhase[] = [
  {
    key: "connecting",
    progress: 0.15,
    title: "Optimizing your cart",
    subtitle: "Comparing item prices, delivery, and discounts…",
    statusTitle: "Checking available platforms",
    statusSubtitle: "Food + Grocery multi-cart engine",
    speed: 1,
    complete: false,
  },
  {
    key: "early",
    progress: 0.4,
    title: "Fetching demo rates",
    subtitle: "Connecting to Blinkit, Zepto, and Instamart…",
    statusTitle: "Fetching prices from platforms...",
    statusSubtitle: "Syncing current cart values",
    speed: 1,
    complete: false,
  },
  {
    key: "mid",
    progress: 0.75,
    title: "Calculating fees",
    subtitle: "Assembling custom combined options…",
    statusTitle: "Comparing delivery & packing...",
    statusSubtitle: "Applying available coupon discounts",
    speed: 1.1,
    complete: false,
  },
  {
    key: "complete",
    progress: 1,
    title: null,
    subtitle: null,
    statusTitle: null,
    statusSubtitle: null,
    bannerTitle: "Best combined rate found!",
    bannerSubtitle: "Save with a complete basket on one platform",
    ctaLabel: "View Best Deal →",
    speed: 0,
    complete: true,
  },
];

export const CART_ORBIT_COPY: OrbitCopy = {
  headerTitle: "Cart Comparison",
  headerSubtitle: "Smart Multi-Platform Comparison",
  listTitle: "Your cart",
  noteText: "Comparing this basket across available food & quick-marts",
  phases: CART_ORBIT_PHASES,
};

export const CART_ORBIT_PHASE_MS = 2200;
export const CART_ORBIT_COLLAPSE_MS = 380;
export const CART_ORBIT_EXPAND_MS = 420;

export function getCartChipLabel(item: CartLine): string {
  if (!item?.name) return "Item";
  if (item.category === "grocery" && /coca|coke/i.test(item.name)) {
    return "Coca-Cola (750ml)";
  }
  if (/chicken.*biryani|biryani/i.test(item.name)) return "Chicken Biryani";
  if (/paneer/i.test(item.name)) return "Paneer Tikka";
  return item.name.length > 18 ? `${item.name.slice(0, 16)}…` : item.name;
}
