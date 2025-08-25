import { useAccount, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { celoSepolia } from 'wagmi/chains'

export function NetworkSwitcher() {
  const { chainId, isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  
  if (!isConnected) return null
  
  const isCorrectNetwork = chainId === 11142220 // Celo Sepolia testnet
  
  if (isCorrectNetwork) return null
  
  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: celoSepolia.id })
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }
  
  return (
    <div className="fixed top-20 left-4 z-50">
      <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">Wrong Network</span>
        </div>
        <p className="text-sm mb-3">
          You need to be on Celo Sepolia testnet to purchase tickets.
        </p>
        <Button
          onClick={handleSwitchNetwork}
          disabled={isPending}
          className="w-full bg-white text-red-600 hover:bg-gray-100"
        >
          {isPending ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Switching...
            </>
          ) : (
            'Switch to Celo Sepolia'
          )}
        </Button>
      </div>
    </div>
  )
}

