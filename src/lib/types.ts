export type ItemCategory = "food" | "grocery";

export type ComparisonMode = "item" | "cart";

export type ComparisonSource =
  | "food-menu"
  | "food-item"
  | "grocery-product"
  | "grocery-cart"
  | "food-cart";

/** Explicit comparison kinds — never infer from cart length. */
export type ComparisonKind = "restaurant" | "grocery-product" | "cart";

export type AnimationType = "race" | "orbit";

export interface PlatformPrice {
  id: string;
  name?: string;
  label?: string;
  letter?: string;
  color?: string;
  bg?: string;
  price?: number;
  note?: string;
  noteTone?: "save" | "higher" | "muted" | "best";
  time?: string;
  best?: boolean;
  unavailable?: boolean;
  checkoutUrl?: string;
}

export interface RestaurantCard {
  id: string;
  name: string;
  cuisine: string;
  rating: string;
  time: string;
  platforms: string[];
  image: string;
}

export interface FoodSearchResult {
  query: string;
  location: string;
  restaurants: RestaurantCard[];
}

export interface MenuItem {
  id: string;
  name: string;
  tag: string;
  dietary: "VEG" | "NON-VEG" | "GROCERY" | string;
  description: string;
  detailImage: string;
  image: string;
  platforms: PlatformPrice[];
  prices?: PlatformPrice[];
  savingsText?: string;
  bestPriceText?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  area: string;
  cuisine: string;
  rating: string;
  reviews?: string;
  time: string;
  open: boolean;
  heroImage: string;
  categories: string[];
  menu: MenuItem[];
}

export interface GroceryProduct {
  id: string;
  brand: string;
  name: string;
  details: string;
  packSize?: string;
  attribute?: string;
  description?: string;
  stock?: string;
  stockLabel?: string;
  image: string;
  saveAmount: number;
  bestPlatform: string;
  bestPrice: number;
  platforms: PlatformPrice[];
  category: string;
  brandLine?: string;
  inStock?: boolean;
  platformsVerified?: number;
  selectedPlatformId?: string;
  selectedNote?: string;
}

export interface CartLine {
  id: string;
  productId?: string;
  variantId?: string;
  restaurantId?: string;
  category: ItemCategory;
  name: string;
  subtitle: string;
  price: number;
  mrp: number;
  bestOn: string;
  bestPlatformId: string;
  platformPrices?: Record<string, number>;
  qty: number;
  tag: string;
  tagLabel: string;
  image: string;
}

export interface CartSummary {
  foodItems: CartLine[];
  groceryItems: CartLine[];
  foodCount: number;
  groceryCount: number;
  totalCount: number;
  foodSubtotal: number;
  grocerySubtotal: number;
  deliveryFee: number;
  saveAmount: number;
  total: number;
  optimizedLine: string;
}

export interface ComparisonContext {
  mode: ComparisonMode;
  source: ComparisonSource;
  kind: ComparisonKind;
  itemIds: string[];
  cartSnapshotId?: string;
  restaurantId?: string;
  variantId?: string;
  createdAt: number;
}

export interface RaceRacer {
  id: string;
  name: string;
  price: number;
  priceColor: string;
  laneBg: string;
  trailColor: string;
  logo: string | null;
  progress: number;
  duration: number;
  winner?: boolean;
}

export interface RaceResult {
  racers: RaceRacer[];
  savingsTitle: string;
  savingsSubtitle: string;
  proceedLabel: string;
  winnerId?: string;
  bestPrice?: number;
  highestPrice?: number;
  saveAmount?: number;
}

export interface CartPlatformOption {
  id: string;
  name: string;
  readyLabel: string;
  subtitle?: string;
  eta?: string;
  etaTone?: "default" | "best";
  total: number | null;
  estimateLabel?: string;
  incomplete: boolean;
  selectable: boolean;
  best: boolean;
  saveLabel?: string;
  moreLabel?: string;
  checkoutUrl?: string;
}

export interface CartPlatformSelection {
  itemCount: number;
  itemLine: string;
  bestCombinedRate: number | null;
  defaultPlatformId: string | null;
  platforms: CartPlatformOption[];
  isEstimate: boolean;
  hasCompleteBasket: boolean;
}

export interface GroceryPlatformOption {
  id: string;
  name: string;
  mark?: string;
  markBg?: string;
  markColor?: string;
  subtitle?: string;
  price: number;
  priceNote?: string;
  priceNoteTone?: "muted" | "best";
  best?: boolean;
  saveLabel?: string;
  letter?: string;
  color?: string;
  time?: string;
  unavailable?: boolean;
}

export interface GroceryPlatformSelection {
  itemTitle: string;
  packLabel: string;
  brandLine: string;
  stockLabel: string;
  image: string;
  platforms: GroceryPlatformOption[];
  bestPrice: number;
  highestPrice: number;
  saveAmount: number;
  defaultPlatformId: string;
}

export interface RestaurantCompareResult {
  ok: boolean;
  error?: string;
  restaurantId?: string;
  race?: RaceResult;
  menu?: MenuItem[];
  comparedAt?: number;
}

export interface ItemCompareResult {
  ok: boolean;
  error?: string;
  kind?: "grocery" | "food";
  itemId?: string;
  variantId?: string;
  race?: RaceResult;
  selection?: GroceryPlatformSelection;
  comparedAt?: number;
}

export interface CartCompareResult {
  ok: boolean;
  error?: string;
  items: CartLine[];
  selection?: CartPlatformSelection;
  itemIds?: string[];
  comparedAt?: number;
}

export interface CheckoutDestination {
  available: boolean;
  url?: string;
  reason?: "not_configured" | "invalid_url" | "missing_platform";
  platformId?: string;
  platformName?: string;
}

export interface SessionUser {
  phone: string;
  name: string;
  email: string;
  initials: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  line: string;
  city: string;
}

export interface NotificationItem {
  id: string;
  section: "today" | "yesterday";
  type: string;
  title: string;
  timeLabel: string;
  unread: boolean;
}

export interface OrderItem {
  id: string;
  category: ItemCategory;
  dateLabel: string;
  items: string;
  platform: string;
  total: number;
  status: "delivered" | "cancelled" | string;
}

export interface OrbitPhase {
  key: string;
  progress: number;
  title: string | null;
  subtitle: string | null;
  statusTitle: string | null;
  statusSubtitle: string | null;
  bannerTitle?: string;
  bannerSubtitle?: string;
  ctaLabel?: string;
  speed: number;
  complete: boolean;
}

export interface OrbitCopy {
  headerTitle: string;
  headerSubtitle: string;
  listTitle: string;
  noteText: string;
  phases: OrbitPhase[];
}
