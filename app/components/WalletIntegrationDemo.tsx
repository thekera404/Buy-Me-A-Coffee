'use client'

import { useState } from 'react'
import { useWalletKit } from '@/hooks/use-walletkit'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Wallet, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export function WalletIntegrationDemo() {
  const { isInitialized, activeSessions, error } = useWalletKit()
  const [showDetails, setShowDetails] = useState(false)

  const sessionCount = Object.keys(activeSessions).length

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Wallet className="h-5 w-5" />
          WalletConnect Integration
        </CardTitle>
        <CardDescription className="text-gray-300">
          Your wallet is now WalletConnect enabled
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Status:</span>
          <div className="flex items-center gap-2">
            {error ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <Badge variant="destructive">Error</Badge>
              </>
            ) : isInitialized ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge className="bg-green-600">Ready</Badge>
              </>
            ) : (
              <>
                <div className="h-4 w-4 rounded-full bg-yellow-500 animate-pulse" />
                <Badge variant="secondary">Initializing</Badge>
              </>
            )}
          </div>
        </div>

        {/* Active Sessions */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Active Sessions:</span>
          <Badge variant="outline" className="text-white border-gray-600">
            {sessionCount}
          </Badge>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Supported Features:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-gray-300">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Transaction Signing
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Message Signing
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              <CheckCircle className="h-3 w-3 text-green-500" />
              dApp Connections
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Multi-Chain Support
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link href="/wallet" className="w-full">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Wallet className="h-4 w-4 mr-2" />
              Open Wallet Dashboard
            </Button>
          </Link>
          
          {sessionCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              {showDetails ? 'Hide' : 'Show'} Session Details
            </Button>
          )}
        </div>

        {/* Session Details */}
        {showDetails && sessionCount > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-700">
            <h5 className="text-sm font-medium text-white">Connected dApps:</h5>
            <div className="space-y-1">
              {Object.entries(activeSessions).map(([topic, session]) => (
                <div key={topic} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 truncate">
                    {session.peer?.metadata?.name || 'Unknown dApp'}
                  </span>
                  {session.peer?.metadata?.url && (
                    <a
                      href={session.peer.metadata.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}