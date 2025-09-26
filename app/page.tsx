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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Professional Icon */}
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Buy a Coffee</h1>
          <p className="text-gray-600">Send USDC payments on Base network</p>
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
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                canPay && !isPending
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
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
