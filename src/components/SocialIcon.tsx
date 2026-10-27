export function SocialIcon({ name, size = 18 }: { name: string; size?: number }) {
  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (name === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M8 10.5V17M8 7.5v.02M12.5 17v-3.8c0-1.4.9-2.2 2.1-2.2 1.3 0 2.4.8 2.4 2.4V17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M4 4l6.7 8.6L4.4 20h2.5l5.2-6.1L17.8 20H20l-7-9.1L19.4 4H17l-4.8 5.6L6.2 4H4z"
        fill="currentColor"
      />
    </svg>
  );
}
