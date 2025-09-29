'use client'

import { useConnect, useAccount } from 'wagmi'
import { WalletIcon } from '@heroicons/react/24/outline'
import { useAppKit } from '@reown/appkit/react'

export function WalletConnector() {
  const { connect, connectors, isPending } = useConnect()
  const { isConnected } = useAccount()
  const { open } = useAppKit()

  if (isConnected) {
    return null
  }

  const handleMetaMaskConnect = () => {
    const injectedConnector = connectors.find(connector => connector.id === 'injected')
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
  }

  const handleWalletConnectConnect = () => {
    open()
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4 backdrop-blur-sm border border-blue-500/30">
          <WalletIcon className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">Connect Your Wallet</h3>
        <p className="text-gray-300 text-sm">
          Connect your wallet to start sending USDC tips on Base
        </p>
      </div>

      <div className="space-y-4">
        {/* MetaMask */}
        <button
          onClick={handleMetaMaskConnect}
          disabled={isPending}
          aria-label="Connect with MetaMask"
          className="w-full flex items-center justify-between py-4 px-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 disabled:from-gray-600/10 disabled:to-gray-600/10 disabled:cursor-not-allowed border border-orange-500/30 hover:border-orange-500/50 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <path d="M27.2 4.8L17.6 11.2L19.2 7.2L27.2 4.8Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.8 4.8L14.4 11.2L12.8 7.2L4.8 4.8Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23.2 22.4L20.8 26.4L26.4 28L28 22.4H23.2Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 22.4L5.6 28L11.2 26.4L8.8 22.4H4Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.8 14.4L9.6 16.8L15.2 17.2L15.2 11.2L10.8 14.4Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.2 14.4L16.8 11.2V17.2L22.4 16.8L21.2 14.4Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.2 26.4L14.4 24.8L11.6 22.4L11.2 26.4Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.6 24.8L20.8 26.4L20.4 22.4L17.6 24.8Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>MetaMask</span>
          </div>
          <div className="text-orange-400 text-sm">
            {isPending ? 'Connecting...' : 'Browser Wallet'}
          </div>
        </button>

        {/* WalletConnect */}
        <button
          onClick={handleWalletConnectConnect}
          aria-label="Connect with WalletConnect"
          className="w-full flex items-center justify-between py-4 px-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <path d="M9.6 12.8C13.6 8.8 20.4 8.8 24.4 12.8L25.2 13.6C25.6 14 25.6 14.8 25.2 15.2L23.6 16.8C23.4 17 23 17 22.8 16.8L21.6 15.6C19.2 13.2 15.2 13.2 12.8 15.6L11.6 16.8C11.4 17 11 17 10.8 16.8L9.2 15.2C8.8 14.8 8.8 14 9.2 13.6L9.6 12.8ZM27.6 17.6L29 19C29.4 19.4 29.4 20.2 29 20.6L21.2 28.4C20.8 28.8 20 28.8 19.6 28.4L16 24.8C15.9 24.7 15.7 24.7 15.6 24.8L12 28.4C11.6 28.8 10.8 28.8 10.4 28.4L2.6 20.6C2.2 20.2 2.2 19.4 2.6 19L4 17.6C4.4 17.2 5.2 17.2 5.6 17.6L9.2 21.2C9.3 21.3 9.5 21.3 9.6 21.2L13.2 17.6C13.6 17.2 14.4 17.2 14.8 17.6L18.4 21.2C18.5 21.3 18.7 21.3 18.8 21.2L22.4 17.6C22.8 17.2 23.6 17.2 24 17.6L27.6 17.6Z" fill="#3B99FC"/>
              </svg>
            </div>
            <span>WalletConnect</span>
          </div>
          <div className="text-blue-400 text-sm">
            Mobile & Desktop
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-300 text-xs text-center">
          🔒 Your wallet connection is secure and encrypted. We never store your private keys.
        </p>
      </div>
    </div>
  )
}