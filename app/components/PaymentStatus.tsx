'use client'

import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface PaymentStatusProps {
  state: 'processing' | 'success' | 'error'
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

  if (state === 'processing') {
    return (
      <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2 text-blue-300">
          Processing Payment...
        </h3>
        <p className="text-center text-gray-300 mb-4">
          Please wait while we process your ${amount.toFixed(2)} USDC payment
        </p>
        <div className="bg-blue-700/30 rounded-lg p-3">
          <p className="text-blue-200 text-sm">
            <span className="font-medium">To:</span> {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
          </p>
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="bg-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-12 h-12 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-center mb-2 text-green-300">
          Payment Successful!
        </h3>
        <p className="text-center text-gray-300 mb-6">
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
                    <span className="font-medium">Transaction ID:</span>
                  </p>
                  <p className="text-green-300 text-xs font-mono truncate">
                    {transactionId}
                  </p>
                </div>
                <button
                  onClick={handleCopyTxId}
                  className="ml-2 p-1 hover:bg-green-600/30 rounded transition-colors"
                >
                  {copied ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  ) : (
                    <ClipboardDocumentIcon className="w-4 h-4 text-green-400" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={onReset}
          className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200"
        >
          Send Another Tip
        </button>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
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
            className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Try Again
          </button>
          <button
            onClick={onReset}
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