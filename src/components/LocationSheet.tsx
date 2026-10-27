"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { Modal } from "./Modal";

export function LocationControl() {
  const { location, addresses, setLocation } = useSession();
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const useGps = async () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Location is not available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
          );
          const data = await res.json();
          const label =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.suburb ||
            data?.address?.state ||
            "Current location";
          setLocation(label);
          setOpen(false);
        } catch {
          setLocation("Current location");
          setOpen(false);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("Could not read your location. Choose a saved address instead.");
      },
    );
  };

  return (
    <>
      <div className="location-row">
        <button type="button" className="location-btn" onClick={() => setOpen(true)}>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 11s4-3.4 4-6A4 4 0 1 0 2 5c0 2.6 4 6 4 6z" fill="#fea619" />
            <circle cx="6" cy="5" r="1.4" fill="#0b1c30" />
          </svg>
          <span>Delivering to {location}</span>
        </button>
        <button type="button" className="change-btn" onClick={() => setOpen(true)}>
          Change
        </button>
      </div>
      <Modal open={open} title="Choose location" onClose={() => setOpen(false)}>
        <div className="stack">
          <button type="button" className="btn btn-primary" onClick={useGps} disabled={locating}>
            {locating ? "Locating…" : "Use current location"}
          </button>
          {error ? <p className="error-text">{error}</p> : null}
          {addresses.map((address) => (
            <button
              key={address.id}
              type="button"
              className="btn"
              style={{ background: "#eef2ff", color: "var(--text)", justifyContent: "flex-start" }}
              onClick={() => {
                setLocation(address.city);
                setOpen(false);
              }}
            >
              <strong>{address.label}</strong>
              <span className="muted">
                {address.line}, {address.city}
              </span>
            </button>
          ))}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setOpen(false);
              router.push("/address/new");
            }}
          >
            Add new address
          </button>
        </div>
      </Modal>
    </>
  );
}
