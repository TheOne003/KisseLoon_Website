"use client";

import { FormEvent, useState } from "react";
import { OtpBar } from "@/components/OtpBar";
import { useSession } from "@/context/SessionContext";
import { DEMO_OTP } from "@/lib/data/auth";
import { requestEmailOtp, verifyOtp } from "@/lib/services/authService";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ compact = false }: { compact?: boolean }) {
  const { hasEmailAccount, loginWithEmail, registerAccount } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const resetOtp = () => {
    setStep("email");
    setOtp("");
    setError("");
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    resetOtp();
  };

  const sendOtp = async () => {
    const trimmed = email.trim().toLowerCase();
    if (mode === "register" && name.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter a valid email.");
      return;
    }
    if (mode === "login" && !hasEmailAccount(trimmed)) {
      setError("No account for this email. Register first.");
      return;
    }
    if (mode === "register" && hasEmailAccount(trimmed)) {
      setError("That email is already registered. Log in.");
      return;
    }
    setBusy(true);
    const result = await requestEmailOtp(trimmed);
    setBusy(false);
    if (!result.ok) {
      setError("Enter a valid email.");
      return;
    }
    setError("");
    setStep("otp");
  };

  const confirmOtp = async (code: string) => {
    if (busy || code.length !== 6) return;
    setBusy(true);
    const checked = await verifyOtp(code);
    if (!checked.ok) {
      setBusy(false);
      setError(checked.error || "Invalid OTP");
      return;
    }
    setError("");
    setStep("success");
    await new Promise((resolve) => setTimeout(resolve, 900));
    const result = mode === "login" ? loginWithEmail(email) : registerAccount(name, email);
    if (result) {
      setBusy(false);
      setStep("otp");
      setError(result);
      return;
    }
    setBusy(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (step === "success") return;
    if (step === "email") {
      await sendOtp();
      return;
    }
    await confirmOtp(otp);
  };

  const idPrefix = compact ? "profile" : "login";

  return (
    <form className={compact ? "profile-login" : "form-card auth-card"} onSubmit={submit} noValidate>
      {step !== "success" ? (
        <div className="auth-tabs" role="tablist" aria-label="Account">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "active" : ""}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>
      ) : null}
      {step === "success" ? (
        <div className="otp-success" role="status">
          <span className="otp-success-mark" aria-hidden="true">
            ✓
          </span>
          <p>Verified</p>
        </div>
      ) : step === "email" ? (
        <>
          {mode === "register" ? (
            <>
              <label className={compact ? "sr-only" : undefined} htmlFor={`${idPrefix}-name`}>
                Name
              </label>
              <input
                id={`${idPrefix}-name`}
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
              />
            </>
          ) : null}
          <label className={compact ? "sr-only" : undefined} htmlFor={`${idPrefix}-email`}>
            Email
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
          />
          <p className="auth-note">We send a demo OTP. No live email is sent. Use {DEMO_OTP}.</p>
        </>
      ) : (
        <>
          <p className="auth-note">
            OTP for {email.trim().toLowerCase()}. Demo code {DEMO_OTP}.
          </p>
          <span className="demo-badge">Demo OTP {DEMO_OTP}</span>
          <label className={compact ? "sr-only" : undefined} htmlFor={`${idPrefix}-otp`}>
            OTP
          </label>
          <OtpBar
            id={`${idPrefix}-otp`}
            value={otp}
            disabled={busy}
            onChange={(value) => {
              setOtp(value);
              setError("");
              if (value.length === 6) void confirmOtp(value);
            }}
          />
        </>
      )}
      {error ? <p className="error-text">{error}</p> : null}
      {step !== "success" ? (
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={busy || (step === "otp" && otp.length !== 6)}
        >
          {busy ? "Please wait…" : step === "email" ? "Get OTP" : mode === "login" ? "Log in" : "Create account"}
        </button>
      ) : null}
      {step === "otp" ? (
        <button type="button" className="btn btn-ghost auth-back" onClick={resetOtp}>
          Change email
        </button>
      ) : null}
    </form>
  );
}
