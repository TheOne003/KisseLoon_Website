import type { MenuItem, Restaurant, RestaurantCard } from "../types";

function foodPlatforms(
  swiggy: number,
  zomato: number,
  toing: number,
): MenuItem["platforms"] {
  return [
    {
      id: "swiggy",
      label: "Swiggy",
      name: "Swiggy",
      letter: "S",
      color: "#ff5200",
      bg: "rgba(255,82,0,0.1)",
      price: swiggy,
      note: "FREE delivery above ₹199",
    },
    {
      id: "zomato",
      label: "Zomato",
      name: "Zomato",
      letter: "Z",
      color: "#e23744",
      bg: "rgba(226,55,68,0.1)",
      price: zomato,
      note: "FREE delivery above ₹149",
    },
    {
      id: "toing",
      label: "Toing",
      name: "Toing",
      letter: "T",
      color: "#059669",
      bg: "#059669",
      price: toing,
      note: "FREE delivery above ₹199",
      best: true,
    },
  ];
}

function pricesFrom(platforms: MenuItem["platforms"]) {
  return platforms.map((p) => ({
    id: p.id,
    label: p.label,
    letter: p.letter,
    color: p.color,
    price: p.price,
    best: p.best,
  }));
}

const chickenHyderabadi: MenuItem = {
  id: "chicken-hyderabadi",
  name: "Chicken Hyderabadi Dum Biryani",
  tag: "Best Seller",
  dietary: "NON-VEG",
  description:
    "Tender chicken marinated in traditional Hyderabadi spices, layered with fragrant basmati rice and slow cooked.",
  detailImage: "/assets/item/chicken-hyderabadi-hero.jpg",
  image: "/assets/restaurant/chicken-hyderabadi.jpg",
  platforms: foodPlatforms(525, 510, 490),
  savingsText: "You save ₹35 on Toing",
  bestPriceText: "₹490 — Best Price on Toing • You save ₹35",
};
chickenHyderabadi.prices = pricesFrom(chickenHyderabadi.platforms);

const chicken65: MenuItem = {
  id: "chicken-65",
  name: "Chicken 65 Biryani",
  tag: "Spicy Favorite",
  dietary: "NON-VEG",
  description:
    "Spicy Chicken 65 pieces layered with aromatic basmati rice and signature masala for a bold biryani bite.",
  detailImage: "/assets/restaurant/chicken-65.jpg",
  image: "/assets/restaurant/chicken-65.jpg",
  platforms: foodPlatforms(445, 430, 410),
  savingsText: "You save ₹35 on Toing",
  bestPriceText: "₹410 — Best Price on Toing • You save ₹35",
};
chicken65.prices = pricesFrom(chicken65.platforms);

const paneerBiryani: MenuItem = {
  id: "paneer-biryani",
  name: "Paneer Biryani",
  tag: "Pure Veg",
  dietary: "VEG",
  description: "Soft paneer cubes cooked with fragrant spices and layered with long-grain basmati rice.",
  detailImage: "/assets/restaurant/paneer-biryani.jpg",
  image: "/assets/restaurant/paneer-biryani.jpg",
  platforms: foodPlatforms(399, 389, 379),
  savingsText: "You save ₹20 on Toing",
  bestPriceText: "₹379 — Best Price on Toing • You save ₹20",
};
paneerBiryani.prices = pricesFrom(paneerBiryani.platforms);

export const DEMO_RESTAURANTS: Record<string, Restaurant> = {
  "biryani-by-kilo": {
    id: "biryani-by-kilo",
    name: "Biryani By Kilo",
    area: "Koramangala",
    cuisine: "Hyderabadi Biryani",
    rating: "4.3",
    reviews: "12.4K",
    time: "35–45 mins",
    open: true,
    heroImage: "/assets/restaurant/hero-biryani-by-kilo.jpg",
    categories: ["Popular", "Chicken Biryani", "Mutton Biryani"],
    menu: [chickenHyderabadi, chicken65, paneerBiryani],
  },
};

export function getDemoRestaurant(restaurantId: string): Restaurant | null {
  return DEMO_RESTAURANTS[restaurantId] ?? null;
}

export function getDemoRestaurantForCard(restaurant: RestaurantCard | Restaurant): Restaurant {
  const exact = getDemoRestaurant(restaurant.id);
  if (exact) return exact;

  return {
    ...DEMO_RESTAURANTS["biryani-by-kilo"],
    id: restaurant.id,
    name: restaurant.name,
    area: "Koramangala",
    cuisine: restaurant.cuisine,
    rating: restaurant.rating,
    time: restaurant.time?.replace("min", "mins") || "35–45 mins",
  };
}
