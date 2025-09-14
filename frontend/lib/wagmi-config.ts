import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http, type Chain } from 'viem'
import { celoSepolia } from 'wagmi/chains'

// Type-safe environment variable access
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2f05a7cac472734e5e09745c8b4a9c5e'

// Explicitly type the chains array
const chains: [Chain, ...Chain[]] = [celoSepolia]

export const config = getDefaultConfig({
  appName: 'Tixora - Decentralized Event Ticketing',
  projectId,
  chains,
  transports: {
    [celoSepolia.id]: http('https://rpc.ankr.com/celo_sepolia', {
      retryCount: 2, // Add retry logic
      retryDelay: 1000, // 1 second delay between retries
    }), 
  },
  ssr: true,
})