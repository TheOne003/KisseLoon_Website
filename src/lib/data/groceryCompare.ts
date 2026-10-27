import { getPlatformIcon } from "../platformIcons";
import type { GroceryPlatformSelection, GroceryProduct, RaceResult } from "../types";

export const GROCERY_RACE_COPY = {
  savingsTitle: "Save ₹4 on your order!",
  savingsSubtitle: "Instamart has the lowest price today. Compare, order and save instantly.",
  proceedLabel: "Proceed with Instamart",
};

export function getGroceryRaceDemo(product?: GroceryProduct | null): RaceResult {
  const platforms = product?.platforms?.filter((p) => !p.unavailable && typeof p.price === "number") || [];
  if (platforms.length < 2) {
    return {
      racers: [
        {
          id: "blinkit",
          name: "Blinkit",
          price: 74,
          priceColor: "#fea619",
          laneBg: "#fff8e1",
          trailColor: "rgba(254,166,25,0.33)",
          logo: getPlatformIcon("blinkit"),
          progress: 0.42,
          duration: 2200,
        },
        {
          id: "zepto",
          name: "Zepto",
          price: 76,
          priceColor: "#e11d48",
          laneBg: "#faf0ff",
          trailColor: "rgba(82,0,106,0.28)",
          logo: getPlatformIcon("zepto"),
          progress: 0.32,
          duration: 2400,
        },
        {
          id: "instamart",
          name: "Instamart",
          price: 72,
          priceColor: "#059669",
          laneBg: "#eefbf5",
          trailColor: "rgba(0,181,98,0.33)",
          logo: getPlatformIcon("instamart"),
          progress: 0.86,
          duration: 1700,
          winner: true,
        },
      ],
      ...GROCERY_RACE_COPY,
    };
  }

  const prices = platforms.map((p) => p.price as number);
  const bestPrice = Math.min(...prices);
  const highest = Math.max(...prices);
  const saveAmount = highest - bestPrice;
  const winner = platforms.find((p) => p.price === bestPrice);

  const progressByRank = [0.42, 0.55, 0.86];
  const sorted = [...platforms].sort((a, b) => (a.price || 0) - (b.price || 0));
  const progressMap = Object.fromEntries(
    sorted.map((p, index) => [p.id, progressByRank[Math.min(index, progressByRank.length - 1)]]),
  );

  const racers = platforms.map((platform, index) => {
    const isWinner = platform.id === winner?.id;
    return {
      id: platform.id,
      name: platform.name || platform.label || platform.id,
      price: platform.price as number,
      priceColor: isWinner ? "#059669" : platform.color || "#0b1c30",
      laneBg: isWinner ? "#eefbf5" : platform.id === "zepto" ? "#faf0ff" : "#fff8e1",
      trailColor: isWinner
        ? "rgba(0,181,98,0.33)"
        : platform.id === "zepto"
          ? "rgba(82,0,106,0.28)"
          : "rgba(254,166,25,0.33)",
      logo: getPlatformIcon(platform),
      progress: progressMap[platform.id] ?? 0.4 + index * 0.15,
      duration: isWinner ? 1700 : 2100 + index * 150,
      winner: isWinner,
    };
  });

  return {
    racers,
    savingsTitle: `Save ₹${saveAmount} on your order!`,
    savingsSubtitle: `${winner?.name || "Instamart"} has the lowest price today. Compare, order and save instantly.`,
    proceedLabel: `Proceed with ${winner?.name || "Instamart"}`,
    winnerId: winner?.id,
    bestPrice,
    highestPrice: highest,
    saveAmount,
  };
}

export function getGroceryPlatformSelectionDemo(product?: GroceryProduct | null): GroceryPlatformSelection {
  const demoPlatforms = [
    {
      id: "blinkit",
      name: "Blinkit",
      mark: "b!",
      markBg: "#f8e831",
      markColor: "#0d6b30",
      subtitle: "Grocery delivery • 11 mins",
      price: 74,
      priceNote: "Standard",
      priceNoteTone: "muted" as const,
    },
    {
      id: "zepto",
      name: "Zepto",
      mark: "z",
      markBg: "#52006a",
      markColor: "#ff3269",
      subtitle: "Grocery delivery • 8 mins",
      price: 76,
      priceNote: "+₹4 surge",
      priceNoteTone: "muted" as const,
    },
    {
      id: "instamart",
      name: "Instamart",
      mark: "I",
      markBg: "#fc8019",
      markColor: "#fff",
      subtitle: "Save ₹4 instantly",
      price: 72,
      priceNote: "LOWEST",
      priceNoteTone: "best" as const,
      best: true,
      saveLabel: "Save ₹4 instantly",
    },
  ];

  const platforms = product?.platforms?.length
    ? product.platforms
        .filter((p) => !p.unavailable && typeof p.price === "number")
        .map((platform) => {
          const fallback = demoPlatforms.find((p) => p.id === platform.id);
          const isBest = !!platform.best;
          return {
            id: platform.id,
            name: platform.name || platform.label || platform.id,
            mark: fallback?.mark || platform.letter || platform.name?.[0] || "?",
            markBg: fallback?.markBg || platform.color || "#eff4ff",
            markColor: fallback?.markColor || "#fff",
            subtitle: isBest
              ? `Save ₹${product.saveAmount || 4} instantly`
              : `Grocery delivery • ${platform.time?.replace(" delivery", "") || "—"}`,
            price: platform.price as number,
            priceNote: isBest ? "LOWEST" : platform.id === "zepto" ? "+₹4 surge" : "Standard",
            priceNoteTone: isBest ? ("best" as const) : ("muted" as const),
            best: isBest,
            saveLabel: isBest ? `Save ₹${product.saveAmount || 4} instantly` : undefined,
          };
        })
    : demoPlatforms;

  const prices = platforms.map((p) => p.price);
  const bestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const best = platforms.find((p) => p.best) || platforms.find((p) => p.price === bestPrice);

  return {
    itemTitle: product?.name || "Amul Gold Milk",
    packLabel: product?.packSize?.replace(" Pouch", "") || "1 L",
    brandLine: product?.brandLine || product?.brand || "Amul Dairy",
    stockLabel: product?.stockLabel || "In Stock",
    image: product?.image || "/assets/grocery/amul-gold-detail.jpg",
    platforms,
    bestPrice,
    highestPrice,
    saveAmount: highestPrice - bestPrice,
    defaultPlatformId: best?.id || "instamart",
  };
}
