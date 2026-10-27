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
  image: "/assets/home/ad-banner.jpg",
  href: "/grocery",
};

export const FULLSCREEN_AD = {
  image: "/assets/home/ad-banner.jpg",
  eyebrow: "SMART GROCERY",
  title: "Save up to 40% on essentials",
  subtitle: "Placeholder placement — no ad network is connected yet.",
};

export type AdSlot = (typeof AD_PLACEMENTS)[keyof typeof AD_PLACEMENTS];
