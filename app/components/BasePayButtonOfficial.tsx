"use client";

import type { ButtonHTMLAttributes } from "react";

export type BasePayTheme = "light" | "dark";

export interface BasePayButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  theme?: BasePayTheme;
  className?: string;
  loading?: boolean;
}

export function BasePayButtonOfficial({
  disabled = false,
  onClick,
  theme = "dark",
  className = "",
  loading = false,
}: BasePayButtonProps) {
  const isLight = theme === "light";

  const baseClasses = [
    "inline-flex items-center justify-center",
    "rounded-lg",
    "transition-all duration-150 ease-in-out",
    "select-none",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0052FF]",
  ].join(" ");

  const heightClass = "h-14 min-h-[56px] w-full"; // >= 44px for touch targets

  const bg = disabled
    ? "bg-[#374151] opacity-70 cursor-not-allowed"
    : isLight
      ? "bg-white hover:bg-[#f5f5f5]"
      : "bg-[#0000FF] hover:bg-[#0000E0]";

  return (
    <button
      type="button"
      aria-busy={loading || undefined}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${heightClass} ${bg} ${className}`}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          isLight
            ? "https://mintcdn.com/base-a060aa97/zJDlWs-ElgNXh0g7/images/base-account/BasePayBlueLogo.png?fit=max&auto=format&n=zJDlWs-ElgNXh0g7&q=85&s=8eedc35d29797d5cdf1ef2d735478430"
            : "https://mintcdn.com/base-a060aa97/zJDlWs-ElgNXh0g7/images/base-account/BasePayWhiteLogo.png?fit=max&auto=format&n=zJDlWs-ElgNXh0g7&q=85&s=5d59331efc45dac990a9321755d36f35"
        }
        alt="Base Pay"
        style={{ height: 20, width: "auto" }}
      />
    </button>
  );
}
