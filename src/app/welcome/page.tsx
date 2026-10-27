"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlatformLogo } from "@/components/PlatformLogo";
import { SiteShell, PageHeading } from "@/components/SiteShell";
import { DEMO_PHONE } from "@/lib/data/auth";
import { requestOtp } from "@/lib/services/authService";

export default function WelcomePage() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const canSubmit = phone.length === 10;

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Optional account"
        title="Sign in is not required"
        subtitle="You can search, compare, and use the cart without an account. This demo OTP is only for optional profile screens."
      />
      <div className="form-card" style={{ maxWidth: 480 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/brand/kisse-loon-brand.png" alt="Kisse Loon" style={{ width: 160, marginBottom: 16 }} />
        <label htmlFor="phone">MOBILE NUMBER</label>
        <div className="phone-row">
          <span className="prefix">+91</span>
          <input
            id="phone"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="Enter 10-digit number"
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
          />
        </div>
        <button type="button" className="btn btn-ghost" style={{ paddingLeft: 0 }} onClick={() => setPhone(DEMO_PHONE)}>
          Use demo number {DEMO_PHONE}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={!canSubmit}
          onClick={async () => {
            const result = await requestOtp(phone);
            if (result.ok) router.push(`/otp?phone=${phone}`);
          }}
        >
          Get OTP
        </button>
        <Link href="/" className="btn btn-ghost btn-block">
          Continue browsing without signing in
        </Link>
        <div className="row" style={{ justifyContent: "center", marginTop: 16, gap: 16 }}>
          {["blinkit", "zepto", "instamart"].map((id) => (
            <PlatformLogo key={id} platform={id} size={32} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
