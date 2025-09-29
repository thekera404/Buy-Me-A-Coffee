'use client'

import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface PaymentStatusProps {
  state: 'preparing' | 'pending' | 'confirming' | 'success' | 'error'
  amount: number
  recipientAddress: string
  transactionId?: string
  errorMessage?: string
  onRetry: () => void
  onReset: () => void
}

export function PaymentStatus({
  state,
  amount,
  recipientAddress,
  transactionId,
  errorMessage,
  onRetry,
  onReset
}: PaymentStatusProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopyTxId = async () => {
    if (transactionId) {
      try {
        await navigator.clipboard.writeText(transactionId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy transaction ID:', err)
      }
    }
  }

  const handleViewOnBasescan = () => {
    if (transactionId) {
      const basescanUrl = process.env.NEXT_PUBLIC_TESTNET === 'true' 
        ? `https://sepolia.basescan.org/tx/${transactionId}`
        : `https://basescan.org/tx/${transactionId}`
      window.open(basescanUrl, '_blank')
    }
  }

  if (state === 'preparing') {
    return (
      <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6" role="status" aria-live="polite">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2 text-blue-300">
          Preparing Transaction...
        </h3>
        <p className="text-center text-gray-300 mb-4">
          Setting up your ${amount.toFixed(2)} USDC payment
        </p>
        <div className="bg-blue-700/30 rounded-lg p-3">
          <p className="text-blue-200 text-sm">
            <span className="font-medium">To:</span> {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
          </p>
        </div>
      </div>
    )
  }

  if (state === 'pending') {
    return (
      <div className="bg-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6" role="status" aria-live="polite">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <ArrowPathIcon className="w-12 h-12 text-yellow-400 animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2 text-yellow-300">
          Transaction Submitted
        </h3>
        <p className="text-center text-gray-300 mb-4">
          Please confirm the transaction in your wallet
        </p>
        <div className="bg-yellow-700/30 rounded-lg p-3">
          <p className="text-yellow-200 text-sm">
            <span className="font-medium">Amount:</span> ${amount.toFixed(2)} USDC
          </p>
        </div>
      </div>
    )
  }

  if (state === 'confirming') {
    return (
      <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6" role="status" aria-live="polite">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2 text-blue-300">
          Confirming Transaction...
        </h3>
        <p className="text-center text-gray-300 mb-4">
          Waiting for blockchain confirmation
        </p>
        
        <div className="space-y-3">
          <div className="bg-blue-700/30 rounded-lg p-3">
            <p className="text-blue-200 text-sm">
              <span className="font-medium">Amount:</span> ${amount.toFixed(2)} USDC
            </p>
          </div>
          
          {transactionId && (
            <div className="bg-blue-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-blue-200 text-sm">
                    <span className="font-medium">Transaction Hash:</span>
                  </p>
                  <p className="text-blue-300 text-xs font-mono truncate">
                    {transactionId}
                  </p>
                </div>
                <button
                  onClick={handleViewOnBasescan}
                  className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="bg-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6" role="status" aria-live="polite">
        <div className="flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-12 h-12 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-center mb-2 text-green-300">
          Payment Successful!
        </h3>
        <p className="text-center text-[#c8c8d1] mb-6">
          Your ${amount.toFixed(2)} USDC tip has been sent successfully
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="bg-green-700/30 rounded-lg p-3">
            <p className="text-green-200 text-sm">
              <span className="font-medium">Amount:</span> ${amount.toFixed(2)} USDC
            </p>
          </div>
          
          <div className="bg-green-700/30 rounded-lg p-3">
            <p className="text-green-200 text-sm">
              <span className="font-medium">To:</span> {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
            </p>
          </div>
          
          {transactionId && (
            <div className="bg-green-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-green-200 text-sm">
                    <span className="font-medium">Transaction Hash:</span>
                  </p>
                  <p className="text-green-300 text-xs font-mono truncate">
                    {transactionId}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={handleCopyTxId}
                    aria-label="Copy transaction hash"
                    className="p-1 hover:bg-green-600/30 rounded transition-colors"
                  >
                    {copied ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <ClipboardDocumentIcon className="w-4 h-4 text-green-400" />
                    )}
                  </button>
                  <button
                    onClick={handleViewOnBasescan}
                    aria-label="View transaction on Basescan"
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={onReset}
          aria-label="Send another tip"
          className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200"
        >
          Send Another Tip
        </button>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6" role="status" aria-live="polite">
        <div className="flex items-center justify-center mb-4">
          <XCircleIcon className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-center mb-2 text-red-300">
          Payment Failed
        </h3>
        <p className="text-center text-gray-300 mb-4">
          {errorMessage || 'Something went wrong with your payment'}
        </p>
        
        <div className="bg-red-700/30 rounded-lg p-3 mb-6">
          <p className="text-red-200 text-sm">
            <span className="font-medium">Attempted Amount:</span> ${amount.toFixed(2)} USDC
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            aria-label="Retry payment"
            className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Try Again
          </button>
          <button
            onClick={onReset}
            aria-label="Reset and start over"
            className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return null
}