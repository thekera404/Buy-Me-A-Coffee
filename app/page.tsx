'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { AmountSelector } from './components/AmountSelector'
import { WalletAddressInput } from './components/WalletAddressInput'
import { PaymentStatus } from './components/PaymentStatus'
import { WalletConnector } from './components/WalletConnector'
import { useUSDCPayment } from '@/hooks/use-usdc-payment'
import { sdk } from "@farcaster/miniapp-sdk";

export default function App() {
  const { isConnected } = useAccount()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  
  // Use the real USDC payment hook
  const { paymentState, sendPayment, resetPayment, isPending, txHash } = useUSDCPayment()

  // Initialize MiniApp SDK
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sdk.actions.ready()
    }
  }, [])

  // Validation logic
  const finalAmount = selectedAmount || parseFloat(customAmount) || 0
  const isValidAmount = finalAmount > 0
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(recipientAddress)
  const canPay = isValidAmount && isValidAddress && paymentState.status === 'idle'

  // Handle payment with real USDC transaction
  const handlePayment = async () => {
    if (!canPay) return
    
    try {
      await sendPayment(finalAmount.toString(), recipientAddress)
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  return (
    <main aria-label="Buy Me a Coffee payment app" className="min-h-screen bg-gradient-to-br from-[#0a0b2b] via-[#0c2140] to-[#0e2038] p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Buy Me a Coffee</h1>
          <p className="text-[#c8c8d1]">Send secure USDC tips on Base</p>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="mb-8">
            <WalletConnector />
          </div>
        )}

        {/* Main Interface */}
        {isConnected && paymentState.status === 'idle' && (
          <div className="space-y-6">
            {/* Amount Selection */}
            <AmountSelector
              selectedAmount={selectedAmount}
              customAmount={customAmount}
              onAmountSelect={setSelectedAmount}
              onCustomAmountChange={setCustomAmount}
            />

            {/* Wallet Address Input */}
            <WalletAddressInput
              address={recipientAddress}
              onChange={setRecipientAddress}
              isValid={isValidAddress}
            />

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={!canPay || isPending}
              aria-busy={isPending}
              aria-live="polite"
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b2b] ${
                canPay && !isPending
                  ? 'bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white shadow-lg shadow-[var(--app-accent)]/25'
                  : 'bg-white/10 text-[#c8c8d1] cursor-not-allowed'
              }`}
            >
              {isPending && 'Processing...'}
              {!isPending && !isValidAmount && 'Select Amount'}
              {!isPending && isValidAmount && !isValidAddress && 'Enter Valid Address'}
              {!isPending && canPay && `Pay $${finalAmount.toFixed(2)} USDC`}
            </button>
          </div>
        )}

        {/* Payment Status */}
        {paymentState.status !== 'idle' && (
          <PaymentStatus
            state={paymentState.status}
            amount={finalAmount}
            recipientAddress={recipientAddress}
            transactionId={txHash}
            errorMessage={paymentState.error}
            onRetry={handlePayment}
            onReset={resetPayment}
          />
        )}
      </div>
    </main>
  );
}
