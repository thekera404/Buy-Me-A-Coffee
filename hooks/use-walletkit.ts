import { useState, useEffect, useCallback } from 'react'
import { walletKitService } from '@/lib/walletkit'
import { WalletKit } from '@reown/walletkit'

interface SessionMetadata {
  name?: string
  url?: string
  description?: string
  icons?: string[]
}

interface SessionPeer {
  metadata?: SessionMetadata
}

interface SessionNamespace {
  accounts: string[]
  methods: string[]
  events: string[]
}

interface Session {
  topic: string
  peer?: SessionPeer
  namespaces?: Record<string, SessionNamespace>
  expiry?: number
}

export interface UseWalletKitReturn {
  walletKit: InstanceType<typeof WalletKit> | null
  isInitialized: boolean
  isInitializing: boolean
  error: string | null
  activeSessions: Record<string, Session>
  pair: (uri: string) => Promise<void>
  disconnectSession: (topic: string) => Promise<void>
  refreshSessions: () => void
}

export function useWalletKit(): UseWalletKitReturn {
  const [walletKit, setWalletKit] = useState<InstanceType<typeof WalletKit> | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSessions, setActiveSessions] = useState<Record<string, Session>>({})

  const initializeWalletKit = useCallback(async () => {
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

    if (!projectId) {
      setError('WalletConnect Project ID not found')
      return
    }

    if (isInitializing || isInitialized) return

    setIsInitializing(true)
    setError(null)

    try {
      const kit = await walletKitService.initialize(projectId)
      setWalletKit(kit)
      setIsInitialized(true)
      refreshSessions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize WalletKit')
      console.error('WalletKit initialization error:', err)
    } finally {
      setIsInitializing(false)
    }
  }, [isInitializing, isInitialized])

  const refreshSessions = useCallback(() => {
    const sessions = walletKitService.getActiveSessions()
    setActiveSessions(sessions)
  }, [])

  const pair = useCallback(async (uri: string) => {
    try {
      await walletKitService.pair(uri)
      // Sessions will be updated through event listeners
      setTimeout(refreshSessions, 1000) // Refresh after a short delay
    } catch (err) {
      console.error('Failed to pair:', err)
      throw err
    }
  }, [refreshSessions])

  const disconnectSession = useCallback(async (topic: string) => {
    try {
      await walletKitService.disconnectSession(topic)
      refreshSessions()
    } catch (err) {
      console.error('Failed to disconnect session:', err)
      throw err
    }
  }, [refreshSessions])

  useEffect(() => {
    initializeWalletKit()
  }, [initializeWalletKit])

  // Set up periodic session refresh
  useEffect(() => {
    if (!isInitialized) return

    const interval = setInterval(refreshSessions, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [isInitialized, refreshSessions])

  return {
    walletKit,
    isInitialized,
    isInitializing,
    error,
    activeSessions,
    pair,
    disconnectSession,
    refreshSessions,
  }
}