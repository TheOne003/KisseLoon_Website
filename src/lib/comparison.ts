import type {
  AnimationType,
  CartLine,
  ComparisonContext,
  ComparisonKind,
  ComparisonMode,
  ComparisonSource,
} from "./types";

export const ComparisonModeValues = {
  ITEM: "item",
  CART: "cart",
} as const satisfies Record<string, ComparisonMode>;

export const ComparisonSourceValues = {
  FOOD_MENU: "food-menu",
  FOOD_ITEM: "food-item",
  GROCERY_PRODUCT: "grocery-product",
  GROCERY_CART: "grocery-cart",
  FOOD_CART: "food-cart",
} as const satisfies Record<string, ComparisonSource>;

let snapshotSeq = 0;

export function createCartSnapshotId(): string {
  snapshotSeq += 1;
  return `cart-snap-${Date.now()}-${snapshotSeq}`;
}

export function createComparisonContext(
  partial: Partial<ComparisonContext> & {
    mode: ComparisonMode;
    source: ComparisonSource;
    kind: ComparisonKind;
  },
): ComparisonContext {
  const mode = partial.mode === "cart" ? "cart" : "item";
  return {
    mode,
    source: partial.source,
    kind: partial.kind,
    itemIds: Array.isArray(partial.itemIds) ? [...partial.itemIds] : [],
    cartSnapshotId: partial.cartSnapshotId,
    restaurantId: partial.restaurantId,
    variantId: partial.variantId,
    createdAt: Date.now(),
  };
}

export function isCartComparison(context?: ComparisonContext | null): boolean {
  return context?.mode === "cart" || context?.kind === "cart";
}

export function isItemComparison(context?: ComparisonContext | null): boolean {
  return context?.mode === "item";
}

/**
 * Approved flow (takes precedence over the mobile swap):
 * restaurant + grocery product → race
 * full cart → orbit
 */
export function animationForKind(kind: ComparisonKind): AnimationType {
  return kind === "cart" ? "orbit" : "race";
}

export function animationForContext(context?: ComparisonContext | null): AnimationType {
  if (!context) return "race";
  return animationForKind(context.kind);
}

export function cartSourceFromItems(items: CartLine[] = []): ComparisonSource {
  const hasFood = items.some((item) => item.category === "food");
  const hasGrocery = items.some((item) => item.category === "grocery");
  if (hasFood && !hasGrocery) return "food-cart";
  if (hasGrocery && !hasFood) return "grocery-cart";
  if (hasFood) return "food-cart";
  return "grocery-cart";
}
