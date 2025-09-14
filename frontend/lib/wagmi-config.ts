import { getDefaultConfig, htpp } from '@rainbow-me/rainbowkit'
import { celoSepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Tixora - Decentralized Event Ticketing',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2f05a7cac472734e5e09745c8b4a9c5e', // Use a valid project ID
  chains: [celoSepolia],
  transport: [http('https://rpc.ankr.com/celo_sepolia')]
  ssr: true, // If your dApp uses server side rendering (SSR)
})
