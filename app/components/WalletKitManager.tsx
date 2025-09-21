'use client'

import { useState } from 'react'
import { useWalletKit } from '@/hooks/use-walletkit'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Separator } from '@/app/components/ui/separator'
import { Copy, ExternalLink, Trash2, Wifi, WifiOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SessionNamespace {
  accounts?: string[]
  methods?: string[]
  events?: string[]
}

export function WalletKitManager() {
  const {
    isInitialized,
    isInitializing,
    error,
    activeSessions,
    pair,
    disconnectSession,
    refreshSessions,
  } = useWalletKit()

  const [pairingUri, setPairingUri] = useState('')
  const [isPairing, setIsPairing] = useState(false)
  const { toast } = useToast()

  const handlePair = async () => {
    if (!pairingUri.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid pairing URI',
        variant: 'destructive',
      })
      return
    }

    setIsPairing(true)
    try {
      await pair(pairingUri)
      setPairingUri('')
      toast({
        title: 'Success',
        description: 'Pairing initiated successfully',
      })
    } catch (error) {
      console.error('Pairing failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to pair with dApp',
        variant: 'destructive',
      })
    } finally {
      setIsPairing(false)
    }
  }

  const handleDisconnect = async (topic: string) => {
    try {
      await disconnectSession(topic)
      toast({
        title: 'Success',
        description: 'Session disconnected successfully',
      })
    } catch (error) {
      console.error('Disconnect failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to disconnect session',
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <WifiOff className="h-5 w-5" />
            WalletKit Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isInitialized ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-gray-400" />
            )}
            WalletKit Status
          </CardTitle>
          <CardDescription>
            {isInitializing
              ? 'Initializing WalletKit...'
              : isInitialized
              ? 'WalletKit is ready to accept connections'
              : 'WalletKit not initialized'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={isInitialized ? 'default' : 'secondary'}>
              {isInitialized ? 'Connected' : 'Disconnected'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSessions}
              disabled={!isInitialized}
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pairing Card */}
      <Card>
        <CardHeader>
          <CardTitle>Connect to dApp</CardTitle>
          <CardDescription>
            Paste a WalletConnect URI to connect to a dApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="wc:..."
              value={pairingUri}
              onChange={(e) => setPairingUri(e.target.value)}
              disabled={!isInitialized || isPairing}
            />
            <Button
              onClick={handlePair}
              disabled={!isInitialized || isPairing || !pairingUri.trim()}
            >
              {isPairing ? 'Pairing...' : 'Pair'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Get the WalletConnect URI from the dApp you want to connect to
          </p>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            {Object.keys(activeSessions).length} active session(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(activeSessions).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No active sessions. Connect to a dApp to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(activeSessions).map(([topic, session]) => (
                <div key={topic} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{session.peer?.metadata?.name || 'Unknown dApp'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.peer?.metadata?.description || 'No description'}
                      </p>
                      {session.peer?.metadata?.url && (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <ExternalLink className="h-3 w-3" />
                          <a
                            href={session.peer.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {session.peer.metadata.url}
                          </a>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(topic)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Session Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Topic:</span>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-muted px-1 rounded">
                            {formatAddress(topic)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(topic)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expiry:</span>
                        <div className="text-xs">
                          {new Date(session.expiry * 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Namespaces */}
                  {session.namespaces && Object.keys(session.namespaces).length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Supported Namespaces</h5>
                        <div className="space-y-2">
                          {Object.entries(session.namespaces).map(([namespace, config]: [string, { accounts?: string[]; methods?: string[]; events?: string[] }]) => (
                            <div key={namespace} className="text-xs space-y-1">
                              <Badge variant="outline">{namespace}</Badge>
                              <div className="ml-2 space-y-1">
                                <div>
                                  <span className="text-muted-foreground">Accounts:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {config.accounts?.map((account: string, idx: number) => (
                                      <code key={idx} className="bg-muted px-1 rounded">
                                        {formatAddress(account)}
                                      </code>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Methods:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {config.methods?.map((method: string, idx: number) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {method}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}