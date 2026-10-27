export const SOCIALS = [
  { name: "Instagram", handle: "@kisseloon", href: "https://www.instagram.com/kisseloon/" },
  { name: "LinkedIn", handle: "kisse-loon", href: "https://www.linkedin.com/company/kisse-loon/" },
  { name: "X", handle: "@kisseloon", href: "https://x.com/kisseloon" },
] as const;

export const FOOD_COMPARE_DEMO = [
  { id: "swiggy", name: "Swiggy", price: 525, best: false },
  { id: "zomato", name: "Zomato", price: 510, best: false },
  { id: "toing", name: "Toing", price: 490, best: true },
] as const;

export const GROCERY_COMPARE_DEMO = [
  { id: "blinkit", name: "Blinkit", price: 74, best: false },
  { id: "zepto", name: "Zepto", price: 76, best: false },
  { id: "instamart", name: "Instamart", price: 72, best: true },
] as const;
