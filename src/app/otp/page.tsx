"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlatformLogo } from "@/components/PlatformLogo";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { DEMO_OTP } from "@/lib/data/auth";
import { verifyOtp } from "@/lib/services/authService";
import { useSession } from "@/context/SessionContext";

function OtpForm() {
  const search = useSearchParams();
  const phone = search.get("phone") || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login } = useSession();
  const digits = otp.replace(/\D/g, "").slice(0, 6);
  const masked = useMemo(() => {
    const d = phone.replace(/\D/g, "");
    if (d.length < 4) return "+91 ••••••••••";
    return `+91 ${d.slice(0, 2)}••••••${d.slice(-2)}`;
  }, [phone]);

  const submit = async () => {
    setBusy(true);
    setError("");
    const result = await verifyOtp(digits);
    setBusy(false);
    if (!result.ok) {
      setError(result.error || "Invalid OTP");
      return;
    }
    login(phone);
    router.replace("/");
  };

  return (
    <SiteShell>
      <PageHeading title="Verify OTP" subtitle="Optional demo sign-in. Browsing does not require this step." />
      <div className="stack" style={{ maxWidth: 480 }}>
        <p className="muted">Enter the 6-digit code sent to {masked}</p>
        <span className="demo-badge">Demo OTP {DEMO_OTP}</span>
        <input
          ref={inputRef}
          className="sr-only"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={digits}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
          aria-label="One-time password"
        />
        <button type="button" className="otp-boxes" onClick={() => inputRef.current?.focus()} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <input key={index} readOnly value={digits[index] || ""} />
          ))}
        </button>
        {error ? <p className="error-text">{error}</p> : null}
        {info ? <p className="muted">{info}</p> : null}
        <button type="button" className="btn btn-primary btn-block" disabled={digits.length !== 6 || busy} onClick={submit}>
          {busy ? "Verifying…" : "Verify"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setInfo(`Resent demo code ${DEMO_OTP}`)}>
          Resend OTP
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => router.push("/welcome")}>
          Change number
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => router.push("/otp/help")}>
          Need help?
        </button>
        <div className="row" style={{ justifyContent: "center", gap: 18 }}>
          {[
            { id: "blinkit", time: "11 mins" },
            { id: "zepto", time: "9 mins" },
            { id: "instamart", time: "14 mins" },
          ].map((item) => (
            <div key={item.id} style={{ textAlign: "center" }}>
              <PlatformLogo platform={item.id} size={32} />
              <div className="muted" style={{ fontSize: 11 }}>
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpForm />
    </Suspense>
  );
}
