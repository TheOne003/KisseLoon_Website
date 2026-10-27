"use client";

import type { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { PlatformProvider } from "./PlatformContext";
import { SessionProvider } from "./SessionContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <PlatformProvider>
        <CartProvider>{children}</CartProvider>
      </PlatformProvider>
    </SessionProvider>
  );
}
