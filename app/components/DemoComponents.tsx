"use client";

import { useCallback, useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { pay, getPaymentStatus } from "@base-org/account";
import { BasePayButton } from "./base-pay-button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle, XCircle, Loader2, Shield } from "lucide-react";

// Reusable Button
type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
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
  } as const;

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  } as const;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Reusable Card
function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl shadow-lg border overflow-hidden transition-all hover:shadow-xl ${className}`}
      style={{
        background: "rgba(255,255,255,0.05)",
        borderColor: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(6px)",
      }}
    >
      {title && (
        <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// Public Home component used by app/page.tsx
export function Home() {
  return (
    <div className="space-y-6 animate-fade-in">
      <DonateCard />
    </div>
  );
}

// DonateCard implements the tipping flow
function DonateCard() {
  const { isFrameReady } = useMiniKit();
  const defaultRecipient = process.env.NEXT_PUBLIC_DONATION_RECIPIENT || "";
  const testnet = (process.env.NEXT_PUBLIC_BASEPAY_TESTNET || "false") === "true";

  const [selectedAmount, setSelectedAmount] = useState<number>(3);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>(defaultRecipient);
  const [status, setStatus] = useState<"idle" | "paying" | "checking" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [txCopied, setTxCopied] = useState<boolean>(false);

  const isValidAddress = (address: string): boolean =>
    Boolean(address) && address.length === 42 && address.startsWith("0x");

  const currentAmount = customAmount ? Number.parseFloat(customAmount) : selectedAmount;
  const isAmountValid = Number.isFinite(currentAmount) && currentAmount > 0;
  const isRecipientValid = isValidAddress(recipient);

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
    if (!isFrameReady) {
      setStatus("error");
      setMessage("MiniKit not ready. Please try again.");
      return;
    }

    setStatus("paying");
    setMessage("");

    try {
      const parsed = Number.parseFloat(String(currentAmount));
      if (Number.isNaN(parsed) || parsed <= 0) {
        throw new Error("Enter a valid amount in USD");
      }
      const normalizedAmount = parsed.toFixed(2);

      if (!isRecipientValid) {
        throw new Error("Enter a valid recipient address");
      }

      // Use Base Pay SDK - works both inside and outside Farcaster
      const payment = await pay({
        amount: normalizedAmount,
        to: recipient as `0x${string}`,
        testnet,
        payerInfo: { requests: [{ type: "email", optional: true }] },
      });

      setStatus("checking");
      const result = await getPaymentStatus({ id: payment.id, testnet });

      if (result.status === "completed") {
        setStatus("success");
        setMessage(payment.id);
      } else {
        setStatus("error");
        setMessage("Payment not completed yet. Please check later.");
      }
    } catch (err) {
      setStatus("error");
      const e = err as Error;
      setMessage(e?.message || "Payment failed");
    }
  }, [currentAmount, isRecipientValid, recipient, testnet, isFrameReady]);

  return (
    <div className="min-h-[70vh] p-4">
      <div className="mx-auto max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-white leading-tight">Buy Me a Coffee</h1>
          <p className="text-sm text-gray-300">Support your favorite creator with a small tip on Base</p>
          {testnet && (
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              🧪 Testnet Mode - Base Sepolia
            </div>
          )}
        </div>

        <Card title="Choose Amount">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-2">
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
                    className={`h-12 text-lg font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0052FF] ${
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
              <label className="block text-xs text-gray-300">Or enter custom amount (USD)</label>
              <div className="relative w-full max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className={`pl-7 w-full max-w-xs px-3 py-3 rounded-lg text-white placeholder:text-gray-400 outline-none transition-all bg-[rgba(255,255,255,0.06)] border ${
                    customAmount
                      ? "border-blue-500 ring-1 ring-blue-500/20"
                      : "border-[rgba(255,255,255,0.15)]"
                  }`}
                />
              </div>
              {customAmount && (
                <p className="text-xs text-gray-400">
                  Custom amount: ${Number.parseFloat(customAmount || "0").toFixed(2)} USDC
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-gray-300">Recipient Address (Base)</label>
              <input
                type="text"
                placeholder="Enter creator's wallet address (0x...)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={`w-full px-3 py-3 rounded-lg font-mono text-sm text-white placeholder:text-gray-400 outline-none transition-all bg-[rgba(255,255,255,0.06)] border ${
                  recipient
                    ? isRecipientValid
                      ? "border-green-500 ring-1 ring-green-500/20"
                      : "border-red-500 ring-1 ring-red-500/20"
                    : "border-[rgba(255,255,255,0.15)]"
                }`}
              />
              {recipient && (
                <div className="flex items-center justify-between">
                  {isRecipientValid ? (
                    <p className="text-xs text-green-400">Valid Base address</p>
                  ) : (
                    <p className="text-xs text-red-400">Please enter a valid address (starts with 0x, 42 chars)</p>
                  )}
                  {isRecipientValid && (
                    <button
                      type="button"
                      onClick={copyAddress}
                      className="h-6 px-2 text-xs rounded-md border border-[rgba(255,255,255,0.15)] text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.08)]"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {(isAmountValid && currentAmount > 0) && (
          <div className="mt-5 border rounded-lg p-4" style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.1)" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Total Amount:</span>
              <span className="text-lg font-bold text-white">${currentAmount.toFixed(2)} USDC</span>
            </div>
          </div>
        )}

        <div className="mt-5 w-full">
          <BasePayButton
            colorScheme="dark"
            onClick={handlePayment}
            disabled={!isAmountValid || !isRecipientValid || status === "paying" || status === "checking" || !isFrameReady}
          />
          {!isFrameReady && (
            <div className="mt-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-400">Initializing MiniKit...</p>
              </div>
            </div>
          )}
        </div>

        {status !== "idle" && (
          <div className="mt-4">
            {status === "success" && (
              <Alert className="border-green-500/30 bg-green-500/10 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Payment Successful!</AlertTitle>
                <AlertDescription className="text-green-300 space-y-2">
                  <p>Thank you! Your payment has been settled successfully.</p>
                  {message && (
                    <div className="flex items-center justify-between gap-2 p-2 bg-green-500/5 rounded border border-green-500/20">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-green-400 mb-1">Transaction ID:</p>
                        <p className="text-xs font-mono text-green-300 break-all sm:break-normal">
                          <span className="sm:hidden">
                            {message.length > 16 ? `${message.slice(0, 8)}...${message.slice(-6)}` : message}
                          </span>
                          <span className="hidden sm:inline">
                            {message.length > 32 ? `${message.slice(0, 16)}...${message.slice(-12)}` : message}
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(message);
                            setTxCopied(true);
                            setTimeout(() => setTxCopied(false), 2000);
                          } catch {
                            // Fallback for older browsers
                          }
                        }}
                        className="shrink-0 px-2 py-1 text-xs rounded border border-green-500/30 text-green-300 hover:text-green-200 hover:bg-green-500/10 transition-colors"
                      >
                        {txCopied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {status === "error" && (
              <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 text-red-400">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Payment Failed</AlertTitle>
                <AlertDescription className="text-red-300">
                  {message || "Transaction was rejected or failed to process. Please try again."}
                </AlertDescription>
              </Alert>
            )}
            
            {(status === "paying" || status === "checking") && (
              <Alert className="border-blue-500/30 bg-blue-500/10 text-blue-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>
                  {status === "paying" ? "Processing Payment" : "Verifying Transaction"}
                </AlertTitle>
                <AlertDescription className="text-blue-300">
                  {status === "paying" 
                    ? "Waiting for wallet confirmation..." 
                    : "Checking payment status..."
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 border border-gray-700 p-3">  
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Secure Payment</p>
              <p className="text-xs text-gray-300">
                Powered by Base Pay - USDC on {testnet ? "Base Sepolia (Testnet)" : "Base Mainnet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
