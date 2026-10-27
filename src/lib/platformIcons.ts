const PLATFORM_ICONS: Record<string, string> = {
  "amazon-fresh": "/assets/platform/amazon-fresh.jpg",
  amazonfresh: "/assets/platform/amazon-fresh.jpg",
  "flipkart-minutes": "/assets/platform/flipkart-minutes.jpg",
  flipkartminutes: "/assets/platform/flipkart-minutes.jpg",
  flipkart: "/assets/platform/flipkart-minutes.jpg",
  swiggy: "/assets/platform/swiggy.jpg",
  "bistro-blinkit": "/assets/platform/bistro-blinkit.jpg",
  bistro: "/assets/platform/bistro-blinkit.jpg",
  blinkit: "/assets/platform/blinkit.jpg",
  toing: "/assets/platform/toing.jpg",
  instamart: "/assets/platform/instamart.jpg",
  "swiggy-instamart": "/assets/platform/instamart.jpg",
  zomato: "/assets/platform/zomato.jpg",
  jiomart: "/assets/platform/jiomart.jpg",
  "jio-mart": "/assets/platform/jiomart.jpg",
  jio: "/assets/platform/jiomart.jpg",
  bigbasket: "/assets/platform/bigbasket.jpg",
  zepto: "/assets/platform/zepto.jpg",
  swish: "/assets/platform/swish.jpg",
  "zepto-cafe": "/assets/platform/zepto-cafe.jpg",
  zeptocafe: "/assets/platform/zepto-cafe.jpg",
  "ownly-rapido": "/assets/platform/ownly-rapido.jpg",
  ownly: "/assets/platform/ownly-rapido.jpg",
  rapido: "/assets/platform/ownly-rapido.jpg",
};

const NAME_ALIASES: Record<string, string> = {
  "amazon fresh": "amazon-fresh",
  "flipkart minutes": "flipkart-minutes",
  "bistro by blinkit": "bistro-blinkit",
  "swiggy instamart": "instamart",
  "jio mart": "jiomart",
  "big basket": "bigbasket",
  "zepto cafe": "zepto-cafe",
  "zepto café": "zepto-cafe",
  "ownly by rapido": "ownly-rapido",
};

const LETTER_ALIASES: Record<string, string> = {
  s: "swiggy",
  z: "zomato",
  t: "toing",
};

export function normalizePlatformKey(value = ""): string {
  const raw = String(value).trim().toLowerCase();
  if (!raw) return "";
  if (NAME_ALIASES[raw]) return NAME_ALIASES[raw];
  if (LETTER_ALIASES[raw]) return LETTER_ALIASES[raw];
  return raw.replace(/\s+/g, "-");
}

export function getPlatformIcon(
  platform?: string | { id?: string; name?: string; label?: string; letter?: string } | null,
): string | null {
  if (!platform) return null;

  if (typeof platform === "string") {
    const key = normalizePlatformKey(platform);
    return PLATFORM_ICONS[key] || null;
  }

  const candidates = [platform.id, platform.name, platform.label].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const icon = getPlatformIcon(candidate);
    if (icon) return icon;
  }

  if (platform.letter) {
    return getPlatformIcon(platform.letter);
  }

  return null;
}
