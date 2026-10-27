"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  cartItemFromFoodSelection,
  cartItemFromGroceryProduct,
  getCartFingerprint,
  getCartSummary,
  upsertCartItem,
} from "@/lib/cart";
import { storageKeys, readJson, writeJson } from "@/lib/storage";
import type { CartLine, CartSummary, GroceryProduct, MenuItem, PlatformPrice, Restaurant } from "@/lib/types";

interface CartState {
  items: CartLine[];
  summary: CartSummary;
  fingerprint: string;
  ready: boolean;
  addLine: (item: CartLine, options?: { replaceQty?: boolean }) => void;
  addFoodItem: (payload: {
    item: MenuItem;
    restaurant: Restaurant;
    platform?: PlatformPrice | null;
    quantity?: number;
  }) => void;
  addGroceryItem: (payload: {
    product: GroceryProduct;
    platform?: PlatformPrice | null;
    quantity?: number;
  }) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  qtyFor: (id: string) => number;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readJson<CartLine[]>(storageKeys.cart, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeJson(storageKeys.cart, items);
  }, [items, ready]);

  const addLine = useCallback((item: CartLine, options?: { replaceQty?: boolean }) => {
    setItems((prev) => upsertCartItem(prev, item, options));
  }, []);

  const addFoodItem = useCallback(
    ({
      item,
      restaurant,
      platform,
      quantity = 1,
    }: {
      item: MenuItem;
      restaurant: Restaurant;
      platform?: PlatformPrice | null;
      quantity?: number;
    }) => {
      const best = platform || item.platforms?.find((p) => p.best) || item.platforms?.[0];
      if (!best) return;
      const line = cartItemFromFoodSelection({ item, restaurant, platform: best, quantity });
      setItems((prev) => upsertCartItem(prev, line));
    },
    [],
  );

  const addGroceryItem = useCallback(
    ({
      product,
      platform,
      quantity = 1,
    }: {
      product: GroceryProduct;
      platform?: PlatformPrice | null;
      quantity?: number;
    }) => {
      const chosen =
        platform ||
        product.platforms?.find((p) => p.best && !p.unavailable) ||
        product.platforms?.find((p) => !p.unavailable);
      if (!chosen || chosen.unavailable) return;
      const line = cartItemFromGroceryProduct(product, chosen);
      setItems((prev) => upsertCartItem(prev, { ...line, qty: quantity }));
    },
    [],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((item) => item.id !== id);
      return prev.map((item) => (item.id === id ? { ...item, qty } : item));
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const summary = useMemo(() => getCartSummary(items), [items]);
  const fingerprint = useMemo(() => getCartFingerprint(items), [items]);

  const qtyFor = useCallback(
    (id: string) => items.find((item) => item.id === id)?.qty || 0,
    [items],
  );

  const value = useMemo<CartState>(
    () => ({
      items,
      summary,
      fingerprint,
      ready,
      addLine,
      addFoodItem,
      addGroceryItem,
      setQty,
      removeItem,
      qtyFor,
    }),
    [items, summary, fingerprint, ready, addLine, addFoodItem, addGroceryItem, setQty, removeItem, qtyFor],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
