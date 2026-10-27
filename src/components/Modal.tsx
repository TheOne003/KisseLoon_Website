"use client";

import { useEffect } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
  dialog = false,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  dialog?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`modal-backdrop ${dialog ? "dialog" : ""}`}
      role="presentation"
      onClick={onClose}
    >
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="sheet-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
