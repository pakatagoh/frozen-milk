interface MilkBottlePlaceholderProps {
  className?: string;
  size?: "sm" | "lg";
}

const DIMENSIONS: Record<"sm" | "lg", { width: number; height: number }> = {
  sm: { width: 22, height: 34 },
  lg: { width: 42, height: 56 },
};

/** Coral-toned milk bottle placeholder SVG used across the app for rows without an image. */
export function MilkBottlePlaceholder({ className, size = "sm" }: MilkBottlePlaceholderProps) {
  const dim = DIMENSIONS[size];

  return (
    <svg
      width={dim.width}
      height={dim.height}
      viewBox="0 0 28 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="5" y="12" width="18" height="26" rx="4" fill="#fce5dd" stroke="#F08A75" strokeWidth="1.5" />
      <rect x="9" y="16" width="10" height="18" rx="2" fill="#fdf2ee" />
      <rect x="9" y="7" width="10" height="6" rx="1.5" fill="#fce5dd" stroke="#F08A75" strokeWidth="1.5" />
      <rect x="10" y="2" width="8" height="6" rx="1.5" fill="#F08A75" />
      <line x1="9" y1="22" x2="19" y2="22" stroke="#F08A75" strokeWidth="0.6" opacity="0.5" />
      <line x1="9" y1="27" x2="19" y2="27" stroke="#F08A75" strokeWidth="0.6" opacity="0.5" />
      <line x1="9" y1="32" x2="15" y2="32" stroke="#F08A75" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}
