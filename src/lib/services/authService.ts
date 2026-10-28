import { DEMO_OTP, isDemoOtp } from "../data/auth";

export const AUTH_MODE = "demo" as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestOtp(phone: string): Promise<{ ok: boolean; demoHint?: string }> {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) {
    return { ok: false };
  }
  return { ok: true, demoHint: DEMO_OTP };
}

export async function requestEmailOtp(email: string): Promise<{ ok: boolean; demoHint?: string }> {
  if (!EMAIL_RE.test(email.trim().toLowerCase())) {
    return { ok: false };
  }
  await new Promise((resolve) => setTimeout(resolve, 280));
  return { ok: true, demoHint: DEMO_OTP };
}

export async function verifyOtp(otp: string): Promise<{ ok: boolean; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 420));
  if (!isDemoOtp(otp)) {
    return { ok: false, error: `Invalid OTP. Use demo code ${DEMO_OTP}` };
  }
  return { ok: true };
}
