import type { FoodSearchResult } from "../types";

export const DEMO_SEARCHES: Record<string, FoodSearchResult> = {
  "chicken biryani": {
    query: "Chicken Biryani",
    location: "Koramangala, Bengaluru",
    restaurants: [
      {
        id: "biryani-by-kilo",
        name: "Biryani By Kilo",
        cuisine: "Hyderabadi Biryani",
        rating: "4.3",
        time: "35–45 min",
        platforms: ["swiggy", "zomato", "toing"],
        image: "/assets/search/biryani-by-kilo.jpg",
      },
      {
        id: "dum-safar",
        name: "Dum Safar Biryani",
        cuisine: "North Indian",
        rating: "4.2",
        time: "20–25 min",
        platforms: ["swiggy", "zomato", "toing"],
        image: "/assets/search/dum-safar.jpg",
      },
      {
        id: "oudh-1590",
        name: "Oudh 1590",
        cuisine: "Mughlai",
        rating: "4.2",
        time: "25–35 min",
        platforms: ["swiggy", "zomato", "toing"],
        image: "/assets/search/oudh-1590.jpg",
      },
      {
        id: "khadak-singh",
        name: "Khadak Singh Da Dhaba",
        cuisine: "North Indian",
        rating: "4.1",
        time: "20–25 min",
        platforms: ["swiggy", "zomato", "toing"],
        image: "/assets/search/khadak-singh.jpg",
      },
      {
        id: "bikkgane",
        name: "Bikkgane Biryani",
        cuisine: "Biryani",
        rating: "4.4",
        time: "20–25 min",
        platforms: ["swiggy", "zomato", "toing"],
        image: "/assets/search/bikkgane.jpg",
      },
    ],
  },
};

export function normalizeSearchQuery(value = ""): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getDemoSearchResult(query: string): FoodSearchResult | null {
  return DEMO_SEARCHES[normalizeSearchQuery(query)] ?? null;
}

export const POPULAR_DISHES = [
  {
    id: "biryani",
    name: "Chicken Biryani",
    platforms: "From 3 platforms",
    price: "From ₹190",
    image: "/assets/food/biryani.jpg",
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    platforms: "From 4 platforms",
    price: "From ₹260",
    image: "/assets/food/butter-chicken.jpg",
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    platforms: "From 3 platforms",
    price: "From ₹220",
    image: "/assets/food/paneer-tikka.jpg",
  },
];
