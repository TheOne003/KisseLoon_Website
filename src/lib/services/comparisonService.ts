/**
 * Comparison operations — UI animations must not invent prices.
 * Current layer: demo catalog. Swap this file for a live pricing backend later.
 */
import { getCartPlatformSelectionDemo } from "../data/cartPlatform";
import { getGroceryPlatformSelectionDemo, getGroceryRaceDemo } from "../data/groceryCompare";
import { getPlatformIcon } from "../platformIcons";
import type {
  CartCompareResult,
  CartLine,
  CartPlatformSelection,
  GroceryProduct,
  ItemCompareResult,
  MenuItem,
  PlatformPrice,
  RaceResult,
  Restaurant,
  RestaurantCompareResult,
} from "../types";

const FOOD_LANE: Record<string, { priceColor: string; laneBg: string; trailColor: string }> = {
  swiggy: {
    priceColor: "#fc8019",
    laneBg: "#fff5eb",
    trailColor: "rgba(252,128,25,0.33)",
  },
  zomato: {
    priceColor: "#cb202d",
    laneBg: "#fff0f2",
    trailColor: "rgba(203,32,45,0.33)",
  },
  toing: {
    priceColor: "#059669",
    laneBg: "#eefbf5",
    trailColor: "rgba(0,181,98,0.33)",
  },
};

export const DATA_MODE = "demo" as const;

function buildRaceFromPlatforms(platforms: PlatformPrice[] = []): RaceResult | null {
  const available = platforms.filter((p) => p && !p.unavailable && typeof p.price === "number");
  if (available.length < 2) {
    return null;
  }

  const prices = available.map((p) => p.price as number);
  const bestPrice = Math.min(...prices);
  const highest = Math.max(...prices);
  const saveAmount = highest - bestPrice;
  const winner = available.find((p) => p.price === bestPrice);
  const sorted = [...available].sort((a, b) => (a.price as number) - (b.price as number));
  const progressByRank = [0.38, 0.55, 0.82, 0.7];
  const progressMap = Object.fromEntries(
    sorted.map((p, index) => [p.id, progressByRank[Math.min(index, progressByRank.length - 1)]]),
  );

  const racers = available.map((platform, index) => {
    const lane = FOOD_LANE[platform.id] || {
      priceColor: platform.color || "#0b1c30",
      laneBg: "#f5f7ff",
      trailColor: "rgba(11,28,48,0.2)",
    };
    const isWinner = platform.id === winner?.id;
    return {
      id: platform.id,
      name: platform.name || platform.label || platform.id,
      price: platform.price as number,
      priceColor: isWinner ? "#059669" : lane.priceColor,
      laneBg: isWinner ? "#eefbf5" : lane.laneBg,
      trailColor: isWinner ? "rgba(0,181,98,0.33)" : lane.trailColor,
      logo: getPlatformIcon(platform),
      progress: progressMap[platform.id] ?? 0.4 + index * 0.15,
      duration: isWinner ? 1700 : 2000 + index * 150,
      winner: isWinner,
    };
  });

  return {
    racers,
    savingsTitle: `Save ₹${saveAmount} on your order!`,
    savingsSubtitle: `${winner?.name || winner?.label || "Best platform"} has the lowest price today. Compare, order and save instantly.`,
    proceedLabel: `Proceed with ${winner?.name || winner?.label || "best price"}`,
    winnerId: winner?.id,
    bestPrice,
    highestPrice: highest,
    saveAmount,
  };
}

/** Restaurant-level comparison for food navigation. */
export function compareRestaurantMenu(restaurant?: Restaurant | null): RestaurantCompareResult {
  if (!restaurant?.menu?.length) {
    return {
      ok: false,
      error: "Restaurant menu unavailable",
      restaurantId: restaurant?.id,
    };
  }

  const totals: Record<
    string,
    { id: string; name: string; label: string; color?: string; price: number; count: number }
  > = {};

  restaurant.menu.forEach((item) => {
    const platforms = item.platforms || item.prices || [];
    platforms.forEach((p) => {
      if (p == null || typeof p.price !== "number") return;
      const id = p.id;
      if (!totals[id]) {
        totals[id] = {
          id,
          name: p.name || p.label || id,
          label: p.label || p.name || id,
          color: p.color,
          price: 0,
          count: 0,
        };
      }
      totals[id].price += p.price;
      totals[id].count += 1;
    });
  });

  const platforms = Object.values(totals).map((p) => ({
    ...p,
    price: Math.round(p.price / Math.max(p.count, 1)),
  }));

  const race = buildRaceFromPlatforms(platforms);
  if (!race) {
    return {
      ok: false,
      error: "Not enough platform prices for menu comparison",
      restaurantId: restaurant.id,
    };
  }

  return {
    ok: true,
    restaurantId: restaurant.id,
    race,
    menu: restaurant.menu,
    comparedAt: Date.now(),
  };
}

/** Product-level grocery comparison. */
export function compareGroceryProduct(product: GroceryProduct): ItemCompareResult {
  if (!product) {
    return { ok: false, error: "No product to compare" };
  }
  const race = getGroceryRaceDemo(product);
  const selection = getGroceryPlatformSelectionDemo(product);
  return {
    ok: true,
    kind: "grocery",
    itemId: product.id,
    variantId: product.packSize || product.id,
    race,
    selection,
    comparedAt: Date.now(),
  };
}

/** Optional food item comparison — not used in the approved food flow. */
export function compareSingleItem({
  item,
  product,
  quantity = 1,
}: {
  item?: MenuItem;
  product?: GroceryProduct;
  quantity?: number;
}): ItemCompareResult {
  if (product) return compareGroceryProduct(product);

  if (item) {
    const platforms = (item.platforms || []).map((p) => ({
      ...p,
      name: p.name || p.label,
      price: typeof p.price === "number" ? p.price * quantity : p.price,
    }));
    const race = buildRaceFromPlatforms(platforms);
    return {
      ok: Boolean(race),
      error: race ? undefined : "Not enough platform prices",
      kind: "food",
      itemId: item.id,
      variantId: item.id,
      race: race || undefined,
      comparedAt: Date.now(),
    };
  }

  return { ok: false, error: "No item or product to compare" };
}

/** Full-basket comparison for the orbit journey. */
export function compareCart(cartSnapshot: CartLine[] = []): CartCompareResult {
  const items = Array.isArray(cartSnapshot) ? cartSnapshot : [];
  if (!items.length) {
    return { ok: false, error: "Cart snapshot is empty", items: [] };
  }

  const selection = getCartPlatformSelectionDemo(items);
  return {
    ok: true,
    items: items.map((item) => ({ ...item })),
    selection,
    itemIds: items.map((item) => item.id),
    comparedAt: Date.now(),
  };
}

export function buildRaceFromCartSelection(selection?: CartPlatformSelection | null): RaceResult | null {
  const platforms = (selection?.platforms || [])
    .filter((p) => p && p.selectable !== false && typeof p.total === "number")
    .map((p) => ({
      id: p.id,
      name: p.name,
      label: p.name,
      price: p.total as number,
    }));
  return buildRaceFromPlatforms(platforms);
}
