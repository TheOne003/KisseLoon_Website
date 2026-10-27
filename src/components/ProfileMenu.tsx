"use client";

import { useEffect, useRef, useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { useSession } from "@/context/SessionContext";
import { usePlatforms } from "@/context/PlatformContext";

export function ProfileMenu() {
  const { authenticated, user, logout } = useSession();
  const { connected, setConnectOpen } = usePlatforms();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="profile-menu" ref={rootRef}>
      <button
        type="button"
        className="site-icon-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Profile"
        onClick={() => setOpen((prev) => !prev)}
      >
        {authenticated && user.initials ? (
          <span className="site-avatar">{user.initials}</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/assets/icons/user-btn.svg" alt="" />
        )}
      </button>
      {open ? (
        <div className="profile-dropdown" role="menu">
          {authenticated ? (
            <>
              <p className="profile-dropdown-email">{user.email || user.name}</p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setConnectOpen(true);
                }}
              >
                Connected platforms
                <span>{connected.length}</span>
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <AuthForm compact />
          )}
        </div>
      ) : null}
    </div>
  );
}
