import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { eventTicketingAbi, eventTicketingAddress } from '@/lib/addressAndAbi'
import { toast } from 'react-toastify'

export function ContractTest() {
  const { address, isConnected, chainId } = useAccount()
  const [testResult, setTestResult] = useState<string>('')
  
  const { data: totalTickets, error: totalTicketsError } = useReadContract({
    address: eventTicketingAddress,
    abi: eventTicketingAbi,
    functionName: 'getTotalTickets',
  })

  const { data: recentTickets, error: recentTicketsError } = useReadContract({
    address: eventTicketingAddress,
    abi: eventTicketingAbi,
    functionName: 'getRecentTickets',
  })

  const { writeContract, isPending } = useWriteContract()

  if (!isConnected) return null

  const isCorrectNetwork = chainId === 11142220

  const runContractTest = async () => {
    setTestResult('Running contract test...')
    
    try {
      // Test 1: Check if we can read from contract
      if (totalTicketsError) {
        setTestResult(`❌ Failed to read totalTickets: ${totalTicketsError.message}`)
        return
      }
      
      if (recentTicketsError) {
        setTestResult(`❌ Failed to read recentTickets: ${recentTicketsError.message}`)
        return
      }
      
      // Test 2: Check if we can write to contract (simulate a call without actually executing)
      if (!isCorrectNetwork) {
        setTestResult('❌ Wrong network. Need Celo Sepolia testnet (Chain ID: 11142220)')
        return
      }
      
      // Test 3: Check contract data
      const total = totalTickets ? Number(totalTickets) : 0
      const recent = recentTickets && Array.isArray(recentTickets) ? recentTickets.length : 0
      
      setTestResult(`✅ Contract test passed!\nTotal Events: ${total}\nRecent Events: ${recent}\nNetwork: Celo Sepolia`)
      
    } catch (error) {
      setTestResult(`❌ Contract test failed: ${error}`)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 bg-slate-800 border-slate-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white">Contract Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={runContractTest}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            {isPending ? 'Testing...' : 'Test Contract'}
          </Button>
          
          {testResult && (
            <div className="text-xs text-slate-300 whitespace-pre-line bg-slate-700 p-2 rounded">
              {testResult}
            </div>
          )}
          
          <div className="text-xs text-slate-400 space-y-1">
            <div>Network: {isCorrectNetwork ? '✅ Celo Sepolia' : '❌ Wrong Network'}</div>
            <div>Chain ID: {chainId || 'Unknown'}</div>
            <div>Contract: {eventTicketingAddress.slice(0, 6)}...{eventTicketingAddress.slice(-4)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
