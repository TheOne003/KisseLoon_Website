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
import { MIN_COMPARE_PLATFORMS, getConnectable } from "@/lib/platforms";
import { readJson, writeJson, storageKeys } from "@/lib/storage";

export interface ConnectedPlatform {
  id: string;
  name: string;
  kind: "food" | "grocery";
  phone: string;
  connectedAt: number;
}

interface PlatformState {
  ready: boolean;
  connected: ConnectedPlatform[];
  canCompare: boolean;
  connectOpen: boolean;
  setConnectOpen: (open: boolean) => void;
  isConnected: (id: string) => boolean;
  connectPlatform: (id: string, phone: string) => boolean;
  disconnectPlatform: (id: string) => void;
}

const PlatformContext = createContext<PlatformState | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [connected, setConnected] = useState<ConnectedPlatform[]>([]);
  const [connectOpen, setConnectOpen] = useState(false);

  useEffect(() => {
    setConnected(readJson<ConnectedPlatform[]>(storageKeys.platforms, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeJson(storageKeys.platforms, connected);
  }, [connected, ready]);

  useEffect(() => {
    if (!ready) return;
    const saved = readJson<ConnectedPlatform[]>(storageKeys.platforms, []);
    if (saved.length >= MIN_COMPARE_PLATFORMS) return;
    const timer = window.setTimeout(() => setConnectOpen(true), 2500);
    return () => window.clearTimeout(timer);
  }, [ready]);

  const connectPlatform = useCallback((id: string, phone: string) => {
    const meta = getConnectable(id);
    if (!meta) return false;
    setConnected((prev) => {
      if (prev.some((item) => item.id === id)) return prev;
      return [
        ...prev,
        {
          id: meta.id,
          name: meta.name,
          kind: meta.kind,
          phone,
          connectedAt: Date.now(),
        },
      ];
    });
    return true;
  }, []);

  const disconnectPlatform = useCallback((id: string) => {
    setConnected((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isConnected = useCallback((id: string) => connected.some((item) => item.id === id), [connected]);

  const value = useMemo<PlatformState>(
    () => ({
      ready,
      connected,
      canCompare: connected.length >= MIN_COMPARE_PLATFORMS,
      connectOpen,
      setConnectOpen,
      isConnected,
      connectPlatform,
      disconnectPlatform,
    }),
    [ready, connected, connectOpen, isConnected, connectPlatform, disconnectPlatform],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatforms(): PlatformState {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatforms must be used within PlatformProvider");
  return ctx;
}

