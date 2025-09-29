"use client"

interface BasePayButtonProps {
  colorScheme?: "light" | "dark"
  disabled?: boolean
  onClick?: () => void
}

export const SignInWithBaseButton = ({ colorScheme = "light" }) => {
  const isLight = colorScheme === "light"
  return (
    <button
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 16px",
        backgroundColor: isLight ? "#ffffff" : "var(--app-background)",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "14px",
        fontWeight: "500",
        color: isLight ? "#000000" : "#ffffff",
        minWidth: "180px",
        height: "44px",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: isLight ? "var(--app-accent)" : "#FFFFFF",
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />
      <span>Sign in with Base</span>
    </button>
  )
}

export const BasePayButton = ({ colorScheme = "light", disabled = false, onClick }: BasePayButtonProps) => {
  const isLight = colorScheme === "light"

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 16px",
        backgroundColor: disabled ? "rgba(255,255,255,0.1)" : isLight ? "#ffffff" : "var(--app-accent)",
        border: "none",
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "system-ui, -apple-system, sans-serif",
        minWidth: "180px",
        width: "100%",
        height: "56px", // Increased for mobile touch targets
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          isLight
            ? "https://mintcdn.com/base-a060aa97/zJDlWs-ElgNXh0g7/images/base-account/BasePayBlueLogo.png?fit=max&auto=format&n=zJDlWs-ElgNXh0g7&q=85&s=8eedc35d29797d5cdf1ef2d735478430"
            : "https://mintcdn.com/base-a060aa97/zJDlWs-ElgNXh0g7/images/base-account/BasePayWhiteLogo.png?fit=max&auto=format&n=zJDlWs-ElgNXh0g7&q=85&s=5d59331efc45dac990a9321755d36f35"
        }
        alt="Base Pay"
        style={{
          height: "20px",
          width: "auto",
        }}
      />
    </button>
  )
}
