import { WalletKit, IWalletKit } from '@reown/walletkit'
import { Core } from '@walletconnect/core'

export class WalletKitService {
  private walletKit: IWalletKit | null = null
  private core: Core | null = null

  async initialize(projectId: string) {
    try {
      // Initialize Core
      this.core = new Core({
        projectId,
      })

      // Initialize WalletKit
      this.walletKit = await WalletKit.init({
        core: this.core,
        metadata: {
          name: 'Buy Me A Coffee Wallet',
          description: 'Support creators with crypto donations',
          url: 'https://buymeacoffee.com',
          icons: ['https://buymeacoffee.com/icon.png'],
        },
      })

      // Set up event listeners
      this.setupEventListeners()

      console.log('WalletKit initialized successfully')
      return this.walletKit
    } catch (error) {
      console.error('Failed to initialize WalletKit:', error)
      throw error
    }
  }

  private setupEventListeners() {
    if (!this.walletKit) return

    // Session proposal event
    this.walletKit.on('session_proposal', async (event) => {
      console.log('Session proposal received:', event)
      // Handle session proposal - you can implement custom logic here
      // For now, we'll auto-approve for demo purposes
      await this.approveSession(event)
    })

    // Session request event
    this.walletKit.on('session_request', async (event) => {
      console.log('Session request received:', event)
      // Handle session requests (signing, transactions, etc.)
      await this.handleSessionRequest(event)
    })

    // Session delete event
    this.walletKit.on('session_delete', (event) => {
      console.log('Session deleted:', event)
    })
  }

  private async approveSession(proposal: any) {
    try {
      if (!this.walletKit) throw new Error('WalletKit not initialized')

      // Get required and optional namespaces from the proposal
      const { requiredNamespaces, optionalNamespaces } = proposal.params

      // Build session namespaces based on supported chains and methods
      const sessionNamespaces: any = {}

      // Handle required namespaces
      Object.keys(requiredNamespaces).forEach((key) => {
        const namespace = requiredNamespaces[key]
        sessionNamespaces[key] = {
          accounts: namespace.chains?.map((chain: string) => `${chain}:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`) || [],
          methods: namespace.methods || [],
          events: namespace.events || [],
        }
      })

      // Handle optional namespaces
      Object.keys(optionalNamespaces || {}).forEach((key) => {
        const namespace = optionalNamespaces[key]
        if (!sessionNamespaces[key]) {
          sessionNamespaces[key] = {
            accounts: namespace.chains?.map((chain: string) => `${chain}:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`) || [],
            methods: namespace.methods || [],
            events: namespace.events || [],
          }
        }
      })

      // Approve the session
      await this.walletKit.approveSession({
        id: proposal.id,
        namespaces: sessionNamespaces,
      })

      console.log('Session approved successfully')
    } catch (error) {
      console.error('Failed to approve session:', error)
      // Reject the session if approval fails
      await this.walletKit?.rejectSession({
        id: proposal.id,
        reason: {
          code: 5000,
          message: 'User rejected the session',
        },
      })
    }
  }

  private async handleSessionRequest(request: any) {
    try {
      if (!this.walletKit) throw new Error('WalletKit not initialized')

      const { topic, params, id } = request
      const { request: sessionRequest } = params

      console.log('Handling session request:', sessionRequest.method)

      // Handle different request methods
      switch (sessionRequest.method) {
        case 'eth_sendTransaction':
          // Handle transaction signing
          const txResult = await this.handleTransaction(sessionRequest.params[0])
          await this.walletKit.respondSessionRequest({
            topic,
            response: {
              id,
              result: txResult,
              jsonrpc: '2.0',
            },
          })
          break

        case 'personal_sign':
          // Handle message signing
          const signResult = await this.handlePersonalSign(sessionRequest.params)
          await this.walletKit.respondSessionRequest({
            topic,
            response: {
              id,
              result: signResult,
              jsonrpc: '2.0',
            },
          })
          break

        case 'eth_signTypedData':
        case 'eth_signTypedData_v4':
          // Handle typed data signing
          const typedDataResult = await this.handleTypedDataSign(sessionRequest.params)
          await this.walletKit.respondSessionRequest({
            topic,
            response: {
              id,
              result: typedDataResult,
              jsonrpc: '2.0',
            },
          })
          break

        default:
          // Reject unsupported methods
          await this.walletKit.respondSessionRequest({
            topic,
            response: {
              id,
              error: {
                code: 5001,
                message: `Method ${sessionRequest.method} not supported`,
              },
              jsonrpc: '2.0',
            },
          })
      }
    } catch (error) {
      console.error('Failed to handle session request:', error)
      // Send error response
      await this.walletKit?.respondSessionRequest({
        topic: request.topic,
        response: {
          id: request.id,
          error: {
            code: 5000,
            message: 'Internal error',
          },
          jsonrpc: '2.0',
        },
      })
    }
  }

  private async handleTransaction(txParams: any): Promise<string> {
    // Implement transaction handling logic
    // This is a placeholder - you should implement actual transaction signing
    console.log('Transaction params:', txParams)
    
    // For demo purposes, return a mock transaction hash
    // In a real implementation, you would:
    // 1. Show transaction details to user
    // 2. Get user approval
    // 3. Sign and broadcast the transaction
    // 4. Return the transaction hash
    
    return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  }

  private async handlePersonalSign(params: any[]): Promise<string> {
    // Implement message signing logic
    console.log('Personal sign params:', params)
    
    // For demo purposes, return a mock signature
    // In a real implementation, you would:
    // 1. Show message to user
    // 2. Get user approval
    // 3. Sign the message
    // 4. Return the signature
    
    return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  }

  private async handleTypedDataSign(params: any[]): Promise<string> {
    // Implement typed data signing logic
    console.log('Typed data sign params:', params)
    
    // For demo purposes, return a mock signature
    // In a real implementation, you would:
    // 1. Show typed data to user
    // 2. Get user approval
    // 3. Sign the typed data
    // 4. Return the signature
    
    return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  }

  // Utility methods
  getActiveSessions() {
    return this.walletKit?.getActiveSessions() || {}
  }

  async disconnectSession(topic: string) {
    if (!this.walletKit) throw new Error('WalletKit not initialized')
    
    await this.walletKit.disconnectSession({
      topic,
      reason: {
        code: 6000,
        message: 'User disconnected session',
      },
    })
  }

  async pair(uri: string) {
    if (!this.core) throw new Error('Core not initialized')
    
    await this.core.pairing.pair({ uri })
  }

  getWalletKit() {
    return this.walletKit
  }
}

// Export singleton instance
export const walletKitService = new WalletKitService()