import type { GroceryProduct, PlatformPrice } from "../types";

function platformsFrom(
  prices: { blinkit: number | null; zepto: number | null; instamart: number | null },
  bestId = "instamart",
): PlatformPrice[] {
  return [
    {
      id: "blinkit",
      name: "Blinkit",
      price: prices.blinkit ?? undefined,
      time: "11 mins",
      letter: "B",
      color: "#fea619",
      best: bestId === "blinkit",
      unavailable: prices.blinkit == null,
    },
    {
      id: "zepto",
      name: "Zepto",
      price: prices.zepto ?? undefined,
      time: "8 mins",
      letter: "Z",
      color: "#e11d48",
      best: bestId === "zepto",
      unavailable: prices.zepto == null,
    },
    {
      id: "instamart",
      name: "Instamart",
      price: prices.instamart ?? undefined,
      time: "14 mins",
      letter: "I",
      color: "#f97316",
      best: bestId === "instamart",
      unavailable: prices.instamart == null,
    },
  ].map((p) => {
    if (p.unavailable) {
      return {
        id: p.id,
        name: p.name,
        letter: p.letter,
        color: p.color,
        unavailable: true,
      };
    }
    return p;
  });
}

function bestOf(list: PlatformPrice[]) {
  const best = list.find((p) => p.best) || list.find((p) => p.price != null);
  return {
    bestPlatform: best?.name || "Instamart",
    bestPrice: best?.price || 0,
  };
}

function product(entry: {
  id: string;
  brand: string;
  name: string;
  details: string;
  packSize?: string;
  attribute?: string;
  description: string;
  image: string;
  prices: { blinkit: number | null; zepto: number | null; instamart: number | null };
  bestId: string;
  category: string;
  stock?: string;
  stockLabel?: string;
}): GroceryProduct {
  const platforms = platformsFrom(entry.prices, entry.bestId);
  const { bestPlatform, bestPrice } = bestOf(platforms);
  const saveAmount = Math.max(
    0,
    Math.max(...platforms.filter((p) => p.price != null).map((p) => p.price as number)) - bestPrice,
  );
  return {
    id: entry.id,
    brand: entry.brand,
    name: entry.name,
    details: entry.details,
    packSize: entry.packSize || entry.details.split("•")[0]?.trim(),
    attribute: entry.attribute || entry.details.split("•")[1]?.trim(),
    description: entry.description,
    stock: entry.stock || "in-stock",
    stockLabel: entry.stockLabel || "In Stock",
    image: entry.image,
    saveAmount,
    bestPlatform,
    bestPrice,
    platforms,
    category: entry.category,
  };
}

export const GROCERY_CATALOG: GroceryProduct[] = [
  product({
    id: "amul-gold-1l",
    brand: "AMUL",
    name: "Amul Gold Milk",
    details: "1 Litre • Full Cream 6% Fat",
    description: "Pasteurized full-cream milk for everyday use.",
    image: "/assets/grocery/amul-gold-1l.jpg",
    prices: { blinkit: 74, zepto: 76, instamart: 72 },
    bestId: "instamart",
    category: "Milk & Dairy",
  }),
  product({
    id: "amul-taaza-1l",
    brand: "AMUL",
    name: "Amul Taaza Milk",
    details: "1 Litre • Toned Milk 3% Fat",
    description: "Light toned milk, everyday fresh.",
    image: "/assets/grocery/amul-taaza-1l.jpg",
    prices: { blinkit: 58, zepto: 60, instamart: 57 },
    bestId: "instamart",
    category: "Milk & Dairy",
  }),
  product({
    id: "amul-gold-500",
    brand: "AMUL",
    name: "Amul Gold Milk 500 ml",
    details: "500 ml • Full Cream 6% Fat",
    description: "Handy half-litre pouch of Amul Gold.",
    image: "/assets/grocery/amul-gold-500.jpg",
    prices: { blinkit: 38, zepto: 39, instamart: 37 },
    bestId: "instamart",
    category: "Milk & Dairy",
  }),
  product({
    id: "amul-cow-1l",
    brand: "AMUL",
    name: "Amul Cow Milk",
    details: "1 Litre • Pure Cow Milk 3.5% Fat",
    description: "Pure cow milk with balanced creaminess.",
    image: "/assets/grocery/amul-cow-1l.jpg",
    prices: { blinkit: 56, zepto: null, instamart: 58 },
    bestId: "blinkit",
    category: "Milk & Dairy",
    stock: "fast-moving",
    stockLabel: "Fast Moving",
  }),
  product({
    id: "banana-robusta",
    brand: "FRESH",
    name: "Robusta Banana",
    details: "1 dozen • Fresh",
    description: "Naturally ripened robusta bananas.",
    image: "/assets/grocery/amul-gold-1l.jpg",
    prices: { blinkit: 48, zepto: 52, instamart: 45 },
    bestId: "instamart",
    category: "Fruits",
  }),
  product({
    id: "apple-shimla",
    brand: "FRESH",
    name: "Shimla Apple",
    details: "1 kg • Premium",
    description: "Crisp Shimla apples, hand-picked.",
    image: "/assets/grocery/amul-taaza-1l.jpg",
    prices: { blinkit: 160, zepto: 155, instamart: 168 },
    bestId: "zepto",
    category: "Fruits",
  }),
  product({
    id: "orange-nagpur",
    brand: "FRESH",
    name: "Nagpur Orange",
    details: "1 kg • Juicy",
    description: "Sweet Nagpur oranges for fresh juice.",
    image: "/assets/grocery/amul-cow-1l.jpg",
    prices: { blinkit: 72, zepto: 70, instamart: 75 },
    bestId: "zepto",
    category: "Fruits",
  }),
  product({
    id: "tomato-hybrid",
    brand: "FARM",
    name: "Hybrid Tomato",
    details: "1 kg • Fresh",
    description: "Firm hybrid tomatoes for daily cooking.",
    image: "/assets/grocery/paneer.jpg",
    prices: { blinkit: 36, zepto: 34, instamart: 38 },
    bestId: "zepto",
    category: "Vegetables",
  }),
  product({
    id: "onion-nashik",
    brand: "FARM",
    name: "Nashik Onion",
    details: "1 kg • Fresh",
    description: "Pungent Nashik onions, kitchen staple.",
    image: "/assets/grocery/curd.jpg",
    prices: { blinkit: 32, zepto: 30, instamart: 33 },
    bestId: "zepto",
    category: "Vegetables",
  }),
  product({
    id: "potato-table",
    brand: "FARM",
    name: "Table Potato",
    details: "1 kg • Fresh",
    description: "Clean table potatoes for fries & curries.",
    image: "/assets/grocery/butter.jpg",
    prices: { blinkit: 28, zepto: 29, instamart: 26 },
    bestId: "instamart",
    category: "Vegetables",
  }),
  product({
    id: "lays-classic",
    brand: "LAYS",
    name: "Lays Classic Salted",
    details: "52 g • Chips",
    description: "Classic salted potato chips.",
    image: "/assets/grocery/amul-milk.jpg",
    prices: { blinkit: 20, zepto: 22, instamart: 19 },
    bestId: "instamart",
    category: "Snacks",
  }),
  product({
    id: "kurkure-masala",
    brand: "KURKURE",
    name: "Kurkure Masala Munch",
    details: "75 g • Crunchy",
    description: "Spicy masala crunch snack.",
    image: "/assets/grocery/paneer.jpg",
    prices: { blinkit: 20, zepto: 18, instamart: 21 },
    bestId: "zepto",
    category: "Snacks",
  }),
  product({
    id: "bingo-mad-angles",
    brand: "BINGO",
    name: "Bingo Mad Angles",
    details: "66 g • Tangy",
    description: "Tangy mad angles for movie night.",
    image: "/assets/grocery/curd.jpg",
    prices: { blinkit: 20, zepto: 20, instamart: 18 },
    bestId: "instamart",
    category: "Snacks",
  }),
  product({
    id: "coca-cola-750",
    brand: "COCA-COLA",
    name: "Coca-Cola",
    details: "750 ml • Soft Drink",
    description: "Chilled cola classic.",
    image: "/assets/grocery/amul-milk.jpg",
    prices: { blinkit: 40, zepto: 38, instamart: 42 },
    bestId: "zepto",
    category: "Beverages",
  }),
  product({
    id: "real-juice-1l",
    brand: "REAL",
    name: "Real Mixed Fruit Juice",
    details: "1 L • Juice",
    description: "Mixed fruit juice, no concentrate fuss.",
    image: "/assets/grocery/amul-gold-1l.jpg",
    prices: { blinkit: 110, zepto: 115, instamart: 105 },
    bestId: "instamart",
    category: "Beverages",
  }),
];

export const GROCERY_CATEGORIES = ["Milk & Dairy", "Fruits", "Vegetables", "Snacks", "Beverages"];

export const CATEGORY_BG: Record<string, string> = {
  "Milk & Dairy": "#f1f5f9",
  Fruits: "#ecfdf5",
  Vegetables: "#fff7ed",
  Snacks: "#fffbeb",
  Beverages: "#eff6ff",
};

export function getCatalogByCategory(category: string): GroceryProduct[] {
  return GROCERY_CATALOG.filter((p) => p.category === category);
}

export function getCatalogProduct(id: string): GroceryProduct {
  return GROCERY_CATALOG.find((p) => p.id === id) || GROCERY_CATALOG[0];
}

export function searchGroceryCatalog(query = ""): GroceryProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return GROCERY_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.details.toLowerCase().includes(q),
  );
}

export function getDemoGroceryProduct(product: Partial<GroceryProduct> & { id?: string } = {}): GroceryProduct {
  const base = getCatalogProduct(product.id || "amul-gold-1l");
  const merged: GroceryProduct = {
    ...base,
    ...product,
    platforms: product.platforms?.length ? product.platforms : base.platforms,
    image: product.image || base.image,
    name: product.name || base.name,
  };

  return {
    ...merged,
    brandLine: `${merged.brand} • ${merged.category || "GROCERY"}`,
    packSize: merged.packSize || merged.details?.split("•")?.[0]?.trim() || "1 unit",
    attribute: merged.attribute || merged.details?.split("•")?.[1]?.trim() || "Grocery item",
    description:
      merged.description ||
      `${merged.name} — compare demo prices and add to your Kisse Loon cart.`,
    inStock: merged.stock !== "oos",
    platformsVerified: (merged.platforms || []).filter((p) => !p.unavailable).length,
    selectedPlatformId: merged.platforms?.find((p) => p.best)?.id || merged.platforms?.[0]?.id,
    selectedNote: "Best demo price",
  };
}

export function groceryProductToItemDetail(product: GroceryProduct) {
  const detail = getDemoGroceryProduct(product);
  const platforms = (detail.platforms || [])
    .filter((p) => !p.unavailable)
    .map((p) => ({
      id: p.id,
      label: p.name || p.label,
      name: p.name || p.label,
      price: p.price,
      color: p.color,
      letter: p.letter,
      best: !!p.best,
      note:
        p.note ||
        (p.best
          ? "FREE delivery"
          : `${p.time || ""}`.replace(/delivery/i, "").trim() || "Standard delivery"),
    }));

  const best = platforms.find((p) => p.best) || platforms[0];
  const next = platforms.find((p) => p.id !== best?.id && typeof p.price === "number") || best;
  const save = Math.max(0, (next?.price || 0) - (best?.price || 0));

  return {
    id: detail.id,
    name: detail.name,
    dietary: "GROCERY" as const,
    description: detail.description || "",
    image: detail.image,
    detailImage: detail.image,
    platforms,
    bestPriceText:
      save > 0
        ? `Save ₹${save} vs next best platform`
        : `Best price on ${best?.label || "this platform"}`,
  };
}

export function getDemoGroceryResults(query = "Amul Gold Milk") {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
  const matched = searchGroceryCatalog(normalized);

  const payload = (title: string, products: GroceryProduct[]) => ({
    title,
    foundCount: products.length,
    subtitle: "Demo prices across quick-commerce stores",
    products,
  });

  if (matched.length) {
    return payload(query.trim() || matched[0].name, matched);
  }
  if (normalized.includes("fruit")) {
    return payload(query.trim() || "Fruits", GROCERY_CATALOG.filter((p) => p.category === "Fruits"));
  }
  if (normalized.includes("veg")) {
    return payload(query.trim() || "Vegetables", GROCERY_CATALOG.filter((p) => p.category === "Vegetables"));
  }
  if (normalized.includes("snack")) {
    return payload(query.trim() || "Snacks", GROCERY_CATALOG.filter((p) => p.category === "Snacks"));
  }
  if (normalized.includes("milk") || normalized.includes("dairy")) {
    return payload(query.trim() || "Milk & Dairy", GROCERY_CATALOG.filter((p) => p.category === "Milk & Dairy"));
  }
  return payload(
    query.trim() || "Amul Gold Milk",
    GROCERY_CATALOG.filter((p) => p.category === "Milk & Dairy"),
  );
}

export function getDemoGrocerySearch(query: string) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
  const empty = {
    query: "",
    products: [] as { id: string; name: string; subtitle: string; icon: string; catalogId: string }[],
    related: [] as { id: string; brand: string; rest: string; catalogId: string }[],
  };
  if (!normalized) {
    return empty;
  }

  const matched = searchGroceryCatalog(normalized);
  const products = matched.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.details,
    icon: "drop",
    catalogId: p.id,
  }));

  const related = matched.slice(0, 4).map((p) => ({
    id: `rel-${p.id}`,
    brand: p.brand,
    rest: ` ${p.name}`,
    catalogId: p.id,
  }));

  if (!related.length && normalized.length >= 2) {
    const loose = searchGroceryCatalog(normalized.slice(0, 3));
    loose.slice(0, 4).forEach((p) => {
      related.push({
        id: `rel-${p.id}`,
        brand: p.brand,
        rest: ` ${p.name}`,
        catalogId: p.id,
      });
    });
  }

  return { query: query.trim(), products, related };
}
