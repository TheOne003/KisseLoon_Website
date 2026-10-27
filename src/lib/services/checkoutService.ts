import type { CartPlatformOption, CheckoutDestination } from "../types";

/**
 * Partner checkout destinations.
 * Keep empty until a real, validated integration URL exists.
 * Never invent Swiggy/Zomato/Blinkit checkout links.
 */
const PLATFORM_CHECKOUT_URLS: Record<string, string> = {
  // Populated when platform integrations are available.
};

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getCheckoutDestination(
  platform?: Pick<CartPlatformOption, "id" | "name" | "checkoutUrl"> | null,
): CheckoutDestination {
  if (!platform?.id) {
    return { available: false, reason: "missing_platform" };
  }

  const configured = platform.checkoutUrl || PLATFORM_CHECKOUT_URLS[platform.id];
  if (!configured) {
    return {
      available: false,
      reason: "not_configured",
      platformId: platform.id,
      platformName: platform.name,
    };
  }

  if (!isSafeHttpUrl(configured)) {
    return {
      available: false,
      reason: "invalid_url",
      platformId: platform.id,
      platformName: platform.name,
    };
  }

  return {
    available: true,
    url: configured,
    platformId: platform.id,
    platformName: platform.name,
  };
}

export function hasAnyCheckoutUrl(): boolean {
  return Object.keys(PLATFORM_CHECKOUT_URLS).length > 0;
}
