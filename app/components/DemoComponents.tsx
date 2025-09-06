"use client";

import { type ReactNode, useCallback, useState } from "react";
import { pay, getPaymentStatus } from "@base-org/account";
import { BasePayButton } from "@base-org/account-ui/react";

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

type HomeProps = {
  setActiveTab: (tab: string) => void;
};

export function Home(_: HomeProps) {
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

  const [amount, setAmount] = useState<string>("1.00");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>(defaultRecipient);
  const [emailOptional, setEmailOptional] = useState<boolean>(true);
  const [status, setStatus] = useState<"idle" | "paying" | "checking" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSelectAmount = (value: string) => {
    setAmount(value);
    setCustomAmount("");
  };

  const resolvedAmount = customAmount.trim() !== "" ? Number.parseFloat(customAmount).toFixed(2) : amount;

  const handlePayment = useCallback(async () => {
    setStatus("paying");
    setMessage("");

    try {
      if (!recipient || !recipient.startsWith("0x") || recipient.length !== 42) {
        throw new Error("Enter a valid recipient address");
      }

      const payment = await pay({
        amount: resolvedAmount,
        to: recipient as `0x${string}`,
        testnet,
        payerInfo: {
          requests: [
            { type: "email", optional: emailOptional },
          ],
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
  }, [recipient, resolvedAmount, testnet, emailOptional]);

  return (
    <Card title="Buy the developer a coffee">
      <div className="space-y-4">
        <p className="text-[var(--app-foreground-muted)]">
          Support this developer with a small USDC tip on Base.
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant={amount === "1.00" && customAmount === "" ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleSelectAmount("1.00")}
          >
            $1
          </Button>
          <Button
            variant={amount === "3.00" && customAmount === "" ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleSelectAmount("3.00")}
          >
            $3
          </Button>
          <Button
            variant={amount === "5.00" && customAmount === "" ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleSelectAmount("5.00")}
          >
            $5
          </Button>
          <input
            type="number"
            min="1"
            step="0.5"
            placeholder="Custom"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-24 px-2 py-1 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-md text-[var(--app-foreground)]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-[var(--app-foreground-muted)]">Recipient Address (Base)</label>
          <input
            type="text"
            placeholder="0xRecipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="emailOptional"
            type="checkbox"
            checked={emailOptional}
            onChange={(e) => setEmailOptional(e.target.checked)}
          />
          <label htmlFor="emailOptional" className="text-sm text-[var(--app-foreground-muted)]">
            Email is optional at checkout
                </label>
              </div>

        <div className="flex items-center justify-start">
          <BasePayButton colorScheme="light" onClick={handlePayment} />
        </div>

        {status !== "idle" && (
          <div className="text-sm">
            <span className={
              status === "success"
                ? "text-green-500"
                : status === "error"
                ? "text-red-500"
                : "text-[var(--app-foreground-muted)]"
            }>
              {status === "paying" && "Waiting for wallet confirmation..."}
              {status === "checking" && "Checking payment status..."}
              {(status === "success" || status === "error") && message}
            </span>
          </div>
        )}

        <p className="text-[var(--app-foreground-muted)] text-xs">Payments use USDC on Base Mainnet.</p>
      </div>
    </Card>
  );
}


// Removed TransactionCard as it's not part of the donation flow
