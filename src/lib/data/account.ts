import type { NotificationItem, OrderItem, SavedAddress } from "../types";

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    section: "today",
    type: "price",
    title: "Toor Dal price dropped ₹20 on Blinkit!",
    timeLabel: "2h ago",
    unread: true,
  },
  {
    id: "n2",
    section: "today",
    type: "delivered",
    title: "Your order #KL4521 has been delivered",
    timeLabel: "5h ago",
    unread: false,
  },
  {
    id: "n3",
    section: "today",
    type: "feature",
    title: "Compare prices in real-time! Try our new live feed",
    timeLabel: "8h ago",
    unread: true,
  },
  {
    id: "n4",
    section: "yesterday",
    type: "promo",
    title: "Get 15% off on your first grocery order!",
    timeLabel: "1d ago",
    unread: false,
  },
  {
    id: "n5",
    section: "yesterday",
    type: "stock",
    title: "Items in your wishlist are back in stock",
    timeLabel: "1d ago",
    unread: false,
  },
];

export const DEMO_ORDERS: OrderItem[] = [
  {
    id: "KL90281",
    category: "food",
    dateLabel: "Today, 2:15 PM",
    items: "2x Paneer Butter Masala, 1x Butter Naan",
    platform: "Zepto Cafe",
    total: 349,
    status: "delivered",
  },
  {
    id: "KL89271",
    category: "grocery",
    dateLabel: "14 Sept 2026",
    items: "Rice 5kg, Toor Dal 1kg, Milk 1L, Fortune Oil",
    platform: "Blinkit",
    total: 612,
    status: "delivered",
  },
  {
    id: "KL87461",
    category: "food",
    dateLabel: "11 Sept 2026",
    items: "1x Veg Loaded Pizza, 1x Garlic Bread",
    platform: "Instamart",
    total: 289,
    status: "cancelled",
  },
  {
    id: "KL85123",
    category: "grocery",
    dateLabel: "08 Sept 2026",
    items: "Aashirvaad Atta 10kg, Sugar 2kg, Onions 3kg",
    platform: "Zepto",
    total: 512,
    status: "delivered",
  },
];

export const SAVED_ADDRESSES: SavedAddress[] = [
  { id: "home", label: "Home", line: "Indirapuram", city: "Ghaziabad" },
  { id: "work", label: "Work", line: "Koramangala", city: "Bengaluru" },
  { id: "mom", label: "Mom’s Place", line: "Sector 62", city: "Noida" },
];

export const MEALS = [
  {
    id: "morning",
    image: "/assets/home/meal-morning.png",
    badge: "Morning · 6 AM – 11 AM",
    badgeBg: "#ffd959",
    badgeColor: "#1a1a1a",
    title: "Breakfast & Brunch",
    subtitle: "Fresh parathas, eggs, smoothies & more",
  },
  {
    id: "afternoon",
    image: "/assets/home/meal-afternoon.png",
    badge: "Afternoon · 12 PM – 4 PM",
    badgeBg: "#fa8c33",
    badgeColor: "#1a1a1a",
    title: "Lunch Specials",
    subtitle: "Thalis, biryanis, rice bowls & combos",
  },
  {
    id: "evening",
    image: "/assets/home/meal-evening.png",
    badge: "Evening · 4 PM – 8 PM",
    badgeBg: "#d97333",
    badgeColor: "#1a1a1a",
    title: "Snacks & Chai",
    subtitle: "Samosas, pakoras, chaat & tea-time treats",
  },
  {
    id: "night",
    image: "/assets/home/meal-night.png",
    badge: "Night · 8 PM – 12 AM",
    badgeBg: "#403380",
    badgeColor: "#fff",
    title: "Dinner & Late Bites",
    subtitle: "Curries, naan, kebabs & midnight cravings",
  },
];

export const FOOD_MODE_IMAGES = [
  "/assets/home/slides/food-1.jpg",
  "/assets/home/slides/food-2.jpg",
  "/assets/home/slides/food-3.jpg",
  "/assets/home/slides/food-4.jpg",
  "/assets/home/slides/food-5.jpg",
];

export const GROCERY_MODE_IMAGES = [
  "/assets/home/slides/grocery-1.jpg",
  "/assets/home/slides/grocery-2.jpg",
  "/assets/home/slides/grocery-3.jpg",
  "/assets/home/slides/grocery-4.jpg",
  "/assets/home/slides/grocery-5.jpg",
  "/assets/home/slides/grocery-6.jpg",
];

export const OTP_HELP_FAQS = [
  {
    q: "I didn’t receive an OTP",
    a: "Use the demo code 123456. A live SMS gateway is not connected in this build.",
  },
  {
    q: "Can I change my number?",
    a: "Yes. Go back to Welcome and enter a different 10-digit number. Demo verification still uses 123456.",
  },
  {
    q: "Is this a live login?",
    a: "No. Authentication is a local demo. Connect authService.ts to a real OTP provider later.",
  },
];
