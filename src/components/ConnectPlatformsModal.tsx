"use client";

import { useState } from "react";
import { OtpBar } from "@/components/OtpBar";
import { PlatformLogo } from "@/components/PlatformLogo";
import { usePlatforms } from "@/context/PlatformContext";
import { CONNECTABLE_PLATFORMS, MIN_COMPARE_PLATFORMS } from "@/lib/platforms";
import { DEMO_OTP } from "@/lib/data/auth";
import { requestOtp, verifyOtp } from "@/lib/services/authService";

type Step = "pick" | "phone" | "otp";

const PLATFORM_SECTIONS = [
  { title: "Food", platforms: CONNECTABLE_PLATFORMS.filter((item) => item.kind === "food") },
  { title: "Grocery", platforms: CONNECTABLE_PLATFORMS.filter((item) => item.kind === "grocery") },
] as const;

export function ConnectPlatformsModal() {
  const { connectOpen, setConnectOpen, connected, canCompare, isConnected, connectPlatform, disconnectPlatform } =
    usePlatforms();
  const [step, setStep] = useState<Step>("pick");
  const [selected, setSelected] = useState<(typeof CONNECTABLE_PLATFORMS)[number] | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!connectOpen) return null;

  const reset = () => {
    setStep("pick");
    setSelected(null);
    setPhone("");
    setOtp("");
    setError("");
    setBusy(false);
  };

  const close = () => {
    reset();
    setConnectOpen(false);
  };

  const pick = (platform: (typeof CONNECTABLE_PLATFORMS)[number]) => {
    if (isConnected(platform.id)) {
      disconnectPlatform(platform.id);
      return;
    }
    setSelected(platform);
    setError("");
    setStep("phone");
  };

  const sendOtp = async () => {
    if (phone.length !== 10) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    setBusy(true);
    const result = await requestOtp(phone);
    setBusy(false);
    if (!result.ok) {
      setError("Could not send OTP.");
      return;
    }
    setError("");
    setStep("otp");
  };

  const confirmOtp = async (code = otp) => {
    if (!selected || busy || code.length !== 6) return;
    setBusy(true);
    const result = await verifyOtp(code);
    setBusy(false);
    if (!result.ok) {
      setError(result.error || "Invalid OTP");
      return;
    }
    connectPlatform(selected.id, phone);
    reset();
  };

  return (
    <div className="modal-backdrop dialog connect-backdrop" role="presentation" onClick={canCompare ? close : undefined}>
      <div className="sheet connect-sheet" role="dialog" aria-modal="true" aria-labelledby="connect-title" onClick={(event) => event.stopPropagation()}>
        <p className="compare-stage-kicker">Connect apps</p>
        <h2 id="connect-title">
          {step === "pick" && "Connect platforms to compare"}
          {step === "phone" && `Connect ${selected?.name}`}
          {step === "otp" && "Enter OTP"}
        </h2>
        <p className="muted">At least {MIN_COMPARE_PLATFORMS} apps are needed. This is a demo connect — it does not sign in to the partner app.</p>

        {step === "pick" ? (
          <>
            <p className="connect-progress">
              {connected.length} of {CONNECTABLE_PLATFORMS.length} connected
            </p>
            <div className="connect-scroll">
              {PLATFORM_SECTIONS.map((section) => (
                <section key={section.title} className="connect-section">
                  <h3>{section.title}</h3>
                  <div className="connect-grid">
                    {section.platforms.map((platform) => {
                      const done = isConnected(platform.id);
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          className={`connect-chip ${done ? "connected" : ""}`}
                          onClick={() => pick(platform)}
                        >
                          <PlatformLogo platform={platform.id} size={36} />
                          <span>{platform.name}</span>
                          {done ? <em>Connected · tap to remove</em> : <em>{platform.kind}</em>}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
            <div className="connect-foot">
              <button type="button" className="btn btn-ghost" onClick={close}>
                {canCompare ? "Done" : "Not now"}
              </button>
              {canCompare ? (
                <button type="button" className="btn btn-primary" onClick={close}>
                  Start comparing
                </button>
              ) : (
                <span className="muted">Connect {MIN_COMPARE_PLATFORMS - connected.length} more to compare</span>
              )}
            </div>
          </>
        ) : null}

        {step === "phone" && selected ? (
          <div className="connect-scroll">
            <div className="stack">
              <label htmlFor="connect-phone">Mobile number for {selected.name}</label>
              <div className="phone-row">
                <span className="prefix">+91</span>
                <input
                  id="connect-phone"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit number"
                />
              </div>
              {error ? <p className="error-text">{error}</p> : null}
              <button type="button" className="btn btn-primary btn-block" disabled={busy} onClick={sendOtp}>
                {busy ? "Sending…" : "Get OTP"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Back
              </button>
            </div>
          </div>
        ) : null}

        {step === "otp" && selected ? (
          <div className="connect-scroll">
            <div className="stack">
              <span className="demo-badge">Demo OTP {DEMO_OTP}</span>
              <label htmlFor="connect-otp">OTP</label>
              <OtpBar
                id="connect-otp"
                value={otp}
                disabled={busy}
                onChange={(value) => {
                  setOtp(value);
                  setError("");
                  if (value.length === 6) void confirmOtp(value);
                }}
              />
              {error ? <p className="error-text">{error}</p> : null}
              <button
                type="button"
                className="btn btn-primary btn-block"
                disabled={otp.length !== 6 || busy}
                onClick={confirmOtp}
              >
                {busy ? "Verifying…" : "Connect"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setStep("phone"); setError(""); }}>
                Change number
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
