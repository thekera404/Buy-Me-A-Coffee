import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import type { Chain } from 'viem'

// Support either NEXT_PUBLIC_PROJECT_ID (TRAERULS) or legacy NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined. Set NEXT_PUBLIC_PROJECT_ID in .env.local')
}

// Choose networks; prefer Base mainnet or Sepolia based on env flag
const isTestnet = (process.env.NEXT_PUBLIC_BASEPAY_TESTNET || 'false') === 'true'
export const networks: [Chain, ...Chain[]] = isTestnet ? [baseSepolia] : [base]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig