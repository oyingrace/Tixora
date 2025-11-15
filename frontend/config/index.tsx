import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celoSepolia, baseSepolia } from '@reown/appkit/networks'

// WalletConnect Project ID (from https://dashboard.reown.com)
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [celoSepolia, baseSepolia]

// ✅ Correctly create the Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

// Optional convenience export
export const config = wagmiAdapter.wagmiConfig
