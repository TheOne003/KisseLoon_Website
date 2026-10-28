export const AD_PLACEMENTS = {
  POST_OTP: "ad-1-post-otp",
  HOME_BANNER: "ad-2-home-banner",
  PRE_CHECKOUT: "ad-3-pre-checkout",
} as const;

export const FULLSCREEN_AD_MS = 5000;

export const HOME_AD = {
  id: AD_PLACEMENTS.HOME_BANNER,
  tag: "ADVERTISEMENT",
  eyebrow: "SMART GROCERY",
  title: "Save up to 40% on essentials",
  subtitle: "Demo price comparison across quick stores.",
  cta: "Check Deals",
  image: "/assets/home/ad-grocery.jpg",
  href: "/grocery",
  tone: "light" as const,
};

export const HOME_HERO_AD = {
  ...HOME_AD,
  title: "Save up to 40% on essentials",
  subtitle: "Sample grocery placement",
  cta: "View deals",
};

export const HOME_MID_AD = {
  id: "ad-home-mid",
  tag: "ADVERTISEMENT",
  eyebrow: "FOOD DEALS",
  title: "Biryani night, better price",
  subtitle: "Sample food placement",
  cta: "Compare food",
  image: "/assets/food/ad-food.jpg",
  href: "/food",
  tone: "dark" as const,
};

export const FULLSCREEN_AD = {
  image: "/assets/home/ad-grocery.jpg",
  eyebrow: "SMART GROCERY",
  title: "Save up to 40% on essentials",
  subtitle: "Placeholder placement — no ad network is connected yet.",
};

export const SEARCH_AD = {
  id: "ad-search",
  tag: "ADVERTISEMENT",
  title: "Hungry? Better prices nearby",
  subtitle: "Sample search placement",
  cta: "Browse food",
  image: "/assets/ads/search.jpg",
  href: "/food",
  tone: "dark" as const,
};

export const SEARCH_GROCERY_AD = {
  ...SEARCH_AD,
  id: "ad-search-grocery",
  href: "/grocery",
  cta: "Browse grocery",
};

export const RACE_AD = {
  id: "ad-race",
  tag: "ADVERTISEMENT",
  title: "Chill deals on drinks",
  subtitle: "Sample race placement",
  cta: "View offers",
  image: "/assets/ads/race.jpg",
  href: "/grocery",
  tone: "dark" as const,
};

export const ORBIT_AD = {
  id: "ad-orbit",
  tag: "ADVERTISEMENT",
  title: "Breakfast, faster",
  subtitle: "Sample compare placement",
  cta: "See deals",
  image: "/assets/ads/orbit.jpg",
  href: "/food",
  tone: "light" as const,
};

export const REDIRECT_AD = {
  id: "ad-redirect",
  tag: "ADVERTISEMENT",
  title: "Save the sweet stuff",
  subtitle: "Sample checkout placement",
  cta: "See more",
  image: "/assets/ads/redirect.jpg",
  href: "/food",
  tone: "dark" as const,
};

export type AdSlot = (typeof AD_PLACEMENTS)[keyof typeof AD_PLACEMENTS];
