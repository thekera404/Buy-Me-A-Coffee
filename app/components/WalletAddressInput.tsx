'use client'

import { useState } from 'react'
import { WalletIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'

interface WalletAddressInputProps {
  address: string
  onChange: (address: string) => void
  isValid: boolean
}

export function WalletAddressInput({ address, onChange, isValid }: WalletAddressInputProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy address:', err)
      }
    }
  }

  const getBorderColor = () => {
    if (!address) return 'border-gray-600/50 focus:border-blue-500'
    return isValid ? 'border-green-500' : 'border-red-500'
  }

  const getHelperText = () => {
    if (!address) return 'Enter the recipient\'s wallet address'
    if (isValid) return '✓ Valid Ethereum address'
    return '✗ Invalid address format'
  }

  const getHelperTextColor = () => {
    if (!address) return 'text-gray-400'
    return isValid ? 'text-green-400' : 'text-red-400'
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-white" id="recipient-address-label">Recipient Address</h3>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <WalletIcon className="w-5 h-5 text-gray-400" />
        </div>
        <label htmlFor="recipient-address" className="sr-only">Recipient wallet address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0x..."
          id="recipient-address"
          aria-labelledby="recipient-address-label"
          aria-invalid={!!address && !isValid}
          aria-describedby="recipient-address-help"
          className={`w-full h-12 pl-12 pr-12 bg-gray-700/50 border-2 rounded-lg text-white placeholder-gray-400 font-mono text-sm transition-all duration-200 focus:outline-none ${
            getBorderColor()
          }`}
        />
        
        {address && (
          <button
            onClick={handleCopy}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-600/50 rounded transition-colors"
          >
            {copied ? (
              <CheckIcon className="w-5 h-5 text-green-400" />
            ) : (
              <ClipboardDocumentIcon className="w-5 h-5 text-gray-400 hover:text-white" />
            )}
          </button>
        )}
      </div>
      
      <p id="recipient-address-help" className={`mt-2 text-sm font-medium ${getHelperTextColor()}`} role="status" aria-live="polite">
        {getHelperText()}
      </p>
      
      {address && isValid && (
        <div className="mt-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
          <p className="text-green-300 text-sm font-medium">
            Ready to send USDC to this address
          </p>
        </div>
      )}
    </div>
  )
}