import { getPlatformIcon } from "@/lib/platformIcons";

export function PlatformLogo({
  platform,
  size = 24,
  className = "",
}: {
  platform: string | { id?: string; name?: string; label?: string; letter?: string } | null;
  size?: number;
  className?: string;
}) {
  const src = getPlatformIcon(platform);
  const label =
    typeof platform === "string" ? platform : platform?.name || platform?.label || platform?.id || "Platform";
  if (!src) {
    const letter =
      (typeof platform === "object" && platform?.letter) || String(label).slice(0, 1).toUpperCase();
    return (
      <span
        className={`platform-logo ${className}`}
        style={{
          width: size,
          height: size,
          display: "grid",
          placeItems: "center",
          background: "#eef2ff",
          fontSize: size * 0.4,
          fontWeight: 800,
        }}
        aria-label={label}
      >
        {letter}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label}
      className={`platform-logo ${size >= 40 ? "lg" : ""} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
