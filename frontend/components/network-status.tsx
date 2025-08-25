import { useAccount } from 'wagmi'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle } from 'lucide-react'

export function NetworkStatus() {
  const { chainId, isConnected } = useAccount()
  
  if (!isConnected) return null
  
  const isCorrectNetwork = chainId === 11142220 // Celo Sepolia testnet
  
  return (
    <div className="fixed top-20 right-4 z-50">
      {isCorrectNetwork ? (
        <Badge className="bg-green-600 text-white flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Celo Sepolia
        </Badge>
      ) : (
        <Badge className="bg-red-600 text-white flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Wrong Network
        </Badge>
      )}
    </div>
  )
}

