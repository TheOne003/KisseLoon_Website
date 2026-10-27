export const DEMO_PHONE = "9876543210";
export const DEMO_OTP = "123456";

export function isDemoOtp(otp: string): boolean {
  return String(otp).replace(/\D/g, "") === DEMO_OTP;
}

export function formatProfilePhone(value = ""): string {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length >= 10) {
    const local = digits.slice(-10);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return "+91 98765 43210";
}
