"use client";

export function OtpBar({
  id,
  value,
  onChange,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="otp-bar">
      <input
        id={id}
        className="otp-bar-input"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
        aria-label="6-digit OTP"
      />
      <div className="otp-bar-cells" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className={`otp-bar-cell ${value[index] ? "filled" : ""} ${value.length === index ? "active" : ""}`}
          >
            {value[index] || ""}
          </span>
        ))}
      </div>
    </div>
  );
}
