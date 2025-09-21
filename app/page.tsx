'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { AmountSelector } from './components/AmountSelector'
import { WalletAddressInput } from './components/WalletAddressInput'
import { PaymentStatus } from './components/PaymentStatus'
import { WalletConnector } from './components/WalletConnector'
import { sdk } from "@farcaster/miniapp-sdk";

type PaymentState = 'idle' | 'processing' | 'success' | 'error'

export default function App() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [recipientAddress, setRecipientAddress] = useState<string>('')
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [transactionId, setTransactionId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  const { isConnected } = useAccount()
  
  const finalAmount = selectedAmount || parseFloat(customAmount) || 0
  const isValidAmount = finalAmount > 0
  const isValidAddress = recipientAddress.length === 42 && recipientAddress.startsWith('0x')
  const canPay = isConnected && isValidAmount && isValidAddress

  useEffect(() => {
    // Initialize the MiniApp SDK and signal that the app is ready
    const initializeSdk = async () => {
      try {
        // Signal that the app is ready and the splash screen can be hidden
        await sdk.actions.ready();
        console.log("MiniApp SDK initialized successfully");
      } catch (error) {
        console.error("Failed to initialize MiniApp SDK:", error);
      }
    };

    initializeSdk();
  }, []);

  const handlePayment = async () => {
    if (!canPay) return
    
    setPaymentState('processing')
    setErrorMessage('')
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock transaction ID
      const mockTxId = '0x' + Math.random().toString(16).substr(2, 64)
      setTransactionId(mockTxId)
      setPaymentState('success')
    } catch {
      setErrorMessage('Payment failed. Please try again.')
      setPaymentState('error')
    }
  }

  const resetPayment = () => {
    setPaymentState('idle')
    setTransactionId('')
    setErrorMessage('')
    setSelectedAmount(null)
    setCustomAmount('')
    setRecipientAddress('')
  }

  return (
    <main className="min-h-screen bg-[#0a0b2b] text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-4 backdrop-blur-sm border border-blue-500/30">
            <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Buy a Coffee</h1>
          <p className="text-gray-300 text-sm">
            Send USDC tips on Base blockchain to support creators
          </p>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="mb-6">
            <WalletConnector />
          </div>
        )}

        {/* Main Interface */}
        {isConnected && paymentState === 'idle' && (
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
              disabled={!canPay}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                canPay
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {!isValidAmount && 'Select Amount'}
              {isValidAmount && !isValidAddress && 'Enter Valid Address'}
              {canPay && `Pay $${finalAmount.toFixed(2)} USDC`}
            </button>
          </div>
        )}

        {/* Payment Status */}
        {paymentState !== 'idle' && (
          <PaymentStatus
            state={paymentState}
            amount={finalAmount}
            recipientAddress={recipientAddress}
            transactionId={transactionId}
            errorMessage={errorMessage}
            onRetry={handlePayment}
            onReset={resetPayment}
          />
        )}
      </div>
    </main>
  );
}
