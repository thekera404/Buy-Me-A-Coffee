"use client";

import { type ReactNode, useCallback, useState } from "react";
import { pay, getPaymentStatus } from "@base-org/account";
// Removed unused BasePayButton import in favor of local branded button
import { BasePayButtonOfficial } from "./BasePayButtonOfficial";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)]",
    secondary:
      "bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)] text-[var(--app-foreground)]",
    outline:
      "border border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-[var(--app-accent)]",
    ghost:
      "hover:bg-[var(--app-accent-light)] text-[var(--app-foreground-muted)]",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function Card({
  title,
  children,
  className = "",
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all hover:shadow-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

type FeaturesProps = {
  setActiveTab: (tab: string) => void;
};

export function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Key Features">
        <ul className="space-y-3 mb-4">
          <li className="flex items-start">
            <span className="text-[var(--app-foreground-muted)]">Minimalistic and beautiful UI design</span>
          </li>
          <li className="flex items-start">
            <span className="text-[var(--app-foreground-muted)]">Responsive layout for all devices</span>
          </li>
          <li className="flex items-start">
            <span className="text-[var(--app-foreground-muted)]">Dark mode support</span>
          </li>
          <li className="flex items-start">
            <span className="text-[var(--app-foreground-muted)]">OnchainKit integration</span>
          </li>
        </ul>
        <Button variant="outline" onClick={() => setActiveTab("home")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

export function Home() {
  return (
    <div className="space-y-6 animate-fade-in">
      <DonateCard />
    </div>
  );
}

// Removed Icon component as it's no longer used

// Removed TodoList since the app is focused on donations


function DonateCard() {
  const defaultRecipient = process.env.NEXT_PUBLIC_DONATION_RECIPIENT || "";
  const testnet = (process.env.NEXT_PUBLIC_BASEPAY_TESTNET || "false") === "true";

  const [selectedAmount, setSelectedAmount] = useState<number>(3);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>(defaultRecipient);
  const emailOptional = true;
  const [status, setStatus] = useState<"idle" | "paying" | "checking" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const isValidAddress = (address: string): boolean =>
    Boolean(address) && address.length === 42 && address.startsWith("0x");

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(recipient);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const handlePayment = useCallback(async () => {
    setStatus("paying");
    setMessage("");

    try {
      const currentAmount = customAmount ? Number.parseFloat(customAmount) : selectedAmount;
      const parsed = Number.parseFloat(String(currentAmount));
      if (Number.isNaN(parsed) || parsed <= 0) {
        throw new Error("Enter a valid amount in USD");
      }
      const normalizedAmount = parsed.toFixed(2);

      if (!isValidAddress(recipient)) {
        throw new Error("Enter a valid recipient address");
      }

      const payment = await pay({
        amount: normalizedAmount,
        to: recipient as `0x${string}`,
        testnet,
        payerInfo: {
          requests: [{ type: "email", optional: emailOptional }],
        },
      });

      setStatus("checking");

      const result = await getPaymentStatus({ id: payment.id, testnet });

      if (result.status === "completed") {
        setStatus("success");
        setMessage(`Thank you! Payment settled. Tx: ${payment.id}`);
      } else {
        setStatus("error");
        setMessage("Payment not completed yet. Please check later.");
      }
    } catch (err) {
      setStatus("error");
      const e = err as Error;
      setMessage(e?.message || "Payment failed");
    }
  }, [recipient, selectedAmount, customAmount, testnet, emailOptional]);

  return (
    <div className="min-h-[70vh] p-2 sm:p-4">
      <div className="mx-auto max-w-md w-full">
        <div className="mb-5 sm:mb-6 text-center">
          <h1 className="mb-2 text-xl sm:text-2xl font-bold text-white leading-tight">Buy a coffee</h1>
          <p className="text-sm sm:text-base text-[var(--app-foreground-muted)] px-2">
            Support your favorite creator with a small USDC tip on Base
          </p>
        </div>

        <Card title="Choose Amount" className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
          <div className="space-y-5">
            {/* Preset amounts */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[1, 3, 5].map((amt) => {
                const active = !customAmount && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`h-11 sm:h-12 text-base sm:text-lg font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0052FF] ${
                      active
                        ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
                        : "bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-gray-200 border border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    ${amt}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-[var(--app-foreground-muted)]">Amount (USD)</label>
              <div className="relative w-full max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-foreground-muted)] text-base">$</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className="pl-7 w-full max-w-xs px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-[var(--app-foreground-muted)]">Recipient Address (Base)</label>
              <input
                type="text"
                placeholder="Enter creator's wallet address (0x...)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] font-mono text-sm"
              />
              {recipient && (
                <div className="flex items-center justify-between">
                  {isValidAddress(recipient) ? (
                    <p className="text-xs text-green-400">Valid Base address</p>
                  ) : (
                    <p className="text-xs text-red-400">Please enter a valid address (starts with 0x, 42 chars)</p>
                  )}
                  {isValidAddress(recipient) && (
              <button
                type="button"
                      onClick={copyAddress}
                      className="h-6 px-2 text-xs rounded-md border border-[var(--app-card-border)] text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              >
                      {copied ? "Copied" : "Copy"}
              </button>
                  )}
                </div>
              )}
            </div>
      </div>
    </Card>

        {(customAmount ? Number.parseFloat(customAmount || "0") : selectedAmount) > 0 && (
          <div className="mt-4 sm:mt-5 border border-blue-500/30 bg-blue-500/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--app-foreground-muted)]">Total Amount:</span>
              <span className="text-lg sm:text-xl font-bold text-white">${(customAmount ? Number.parseFloat(customAmount || "0") : selectedAmount).toFixed(2)} USDC</span>
            </div>
          </div>
        )}

        <div className="mt-4 sm:mt-5 w-full">
          <BasePayButtonOfficial
            theme="dark"
            onClick={handlePayment}
            disabled={
              !(customAmount ? Number.parseFloat(customAmount || "0") > 0 : selectedAmount > 0) ||
              !isValidAddress(recipient)
            }
            loading={status === "paying" || status === "checking"}
          />
        </div>

        {status !== "idle" && (
          <div className="mt-3 text-sm">
            <span
              className={
                status === "success"
                  ? "text-green-500"
                  : status === "error"
                  ? "text-red-500"
                  : "text-[var(--app-foreground-muted)]"
              }
            >
              {status === "paying" && "Waiting for wallet confirmation..."}
              {status === "checking" && "Checking payment status..."}
              {(status === "success" || status === "error") && message}
            </span>
          </div>
        )}

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-[color:rgba(255,255,255,0.06)] border border-[color:rgba(255,255,255,0.15)] p-3">
            <div>
              <p className="text-sm font-medium text-white">Secure Payment</p>
              <p className="text-xs text-[var(--app-foreground-muted)]">Payments use USDC on Base Mainnet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Removed TransactionCard as it's not part of the donation flow
