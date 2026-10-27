import { getCartFingerprint } from "./cart";
import { storageKeys, readSessionJson, writeSessionJson } from "./storage";
import type { CartLine, ComparisonContext } from "./types";

export interface CartSnapshotRecord {
  snapshotId: string;
  fingerprint: string;
  items: CartLine[];
  context: ComparisonContext;
  createdAt: number;
}

export function saveCartSnapshot(record: CartSnapshotRecord): void {
  writeSessionJson(storageKeys.snapshot, record);
}

export function readCartSnapshot(): CartSnapshotRecord | null {
  return readSessionJson<CartSnapshotRecord | null>(storageKeys.snapshot, null);
}

export function snapshotMatchesCart(items: CartLine[]): boolean {
  const snap = readCartSnapshot();
  if (!snap) return false;
  return snap.fingerprint === getCartFingerprint(items);
}
