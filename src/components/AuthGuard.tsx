"use client";

/** Authentication is optional and must not block browsing. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
