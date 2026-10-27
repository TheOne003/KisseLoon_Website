const KEYS = {
  cart: "kisseloon.cart.v1",
  session: "kisseloon.session.v1",
  location: "kisseloon.location.v1",
  splashSeen: "kisseloon.splash.seen",
  snapshot: "kisseloon.cartSnapshot.v1",
  profile: "kisseloon.profile.v1",
  checkoutIntent: "kisseloon.checkoutIntent.v1",
  platforms: "kisseloon.platforms.v1",
  accounts: "kisseloon.accounts.v1",
  contact: "kisseloon.contact.v1",
} as const;

function canUse(): boolean {
  return typeof window !== "undefined";
}

export function readJson<T>(key: string, fallback: T): T {
  if (!canUse()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (!canUse()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

export function removeKey(key: string): void {
  if (!canUse()) return;
  window.localStorage.removeItem(key);
}

export function readSessionJson<T>(key: string, fallback: T): T {
  if (!canUse()) return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeSessionJson<T>(key: string, value: T): void {
  if (!canUse()) return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export const storageKeys = KEYS;
