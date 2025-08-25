import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { eventTicketingAbi, eventTicketingAddress } from '@/lib/addressAndAbi'
import { toast } from 'react-toastify'

export function DebugPanel() {
  const { address, isConnected, chainId } = useAccount()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const { data: totalTickets } = useReadContract({
    address: eventTicketingAddress,
    abi: eventTicketingAbi,
    functionName: 'getTotalTickets',
  })

  const { data: recentTickets } = useReadContract({
    address: eventTicketingAddress,
    abi: eventTicketingAbi,
    functionName: 'getRecentTickets',
  })

  if (!isConnected) return null

  const isCorrectNetwork = chainId === 11142220

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-slate-800 hover:bg-slate-700 text-white"
        size="sm"
      >
        {isExpanded ? 'Hide Debug' : 'Debug'}
      </Button>
      
      {isExpanded && (
        <Card className="mt-2 w-80 bg-slate-800 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-300 space-y-2">
            <div>
              <strong>Network:</strong> {isCorrectNetwork ? '✅ Celo Sepolia' : '❌ Wrong Network'}
              <br />
              <span className="text-slate-400">Chain ID: {chainId || 'Unknown'}</span>
            </div>
            
            <div>
              <strong>Wallet:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
              <Button
                size="sm"
                variant="outline"
                className="ml-2 h-5 text-xs"
                onClick={() => copyToClipboard(address || '')}
              >
                Copy
              </Button>
            </div>
            
            <div>
              <strong>Contract:</strong> {eventTicketingAddress.slice(0, 6)}...{eventTicketingAddress.slice(-4)}
              <Button
                size="sm"
                variant="outline"
                className="ml-2 h-5 text-xs"
                onClick={() => copyToClipboard(eventTicketingAddress)}
              >
                Copy
              </Button>
            </div>
            
            <div>
              <strong>Total Events:</strong> {totalTickets ? Number(totalTickets) : 'Loading...'}
            </div>
            
            <div>
              <strong>Recent Events:</strong> {recentTickets ? recentTickets.length : 'Loading...'}
            </div>
            
            {!isCorrectNetwork && (
              <div className="mt-3 p-2 bg-red-600/20 border border-red-500/50 rounded text-red-300">
                <strong>⚠️ Network Issue:</strong>
                <br />
                Switch to Celo Sepolia testnet (Chain ID: 11142220)
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
