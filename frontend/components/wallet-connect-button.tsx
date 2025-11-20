"use client"

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'react-toastify';

export function WalletConnectButton() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { isConnected: isAppKitAccountConnected } = useAppKitAccount();


  // Handle wallet connection
  const handleConnect = useCallback(async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // Check if MetaMask is installed
      if (window.ethereum?.isMetaMask) {
        // Request accounts access
        await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
        // Connect using the injected connector
        await connect({ connector: connectors[0] })
        router.refresh()
      } else {
        // Use Web3Modal for other wallets
        if (!modal) {
          const newModal = initializeModal()
          if (newModal) {
            setModal({
              openModal: () => newModal.openModal(),
              closeModal: () => newModal.closeModal()
            })
            newModal.openModal()
          }
        } else {
          modal.openModal()
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet. Please try again.')
    }
  }, [connect, connectors, initializeModal, modal, router])

  // Handle disconnect
  const handleDisconnect = useCallback(async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      disconnect()
      if (modal) {
        modal.closeModal()
      }
      router.refresh()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }, [disconnect, modal, router])

  // Cleanup modal on unmount
  useEffect(() => {
    return () => {
      if (modal) {
        modal.closeModal()
      }
    }
  }, [modal])

  // Cleanup modal on unmount
  useEffect(() => {
    return () => {
      if (modal) {
        modal.closeModal();
      }
    };
  }, [modal]);

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const isWalletConnected = isConnected || isAppKitAccountConnected;

  return (
    <div className="flex items-center gap-2">
      {isConnected && address ? (
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-slate-800/50 text-sm text-slate-200 border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            {formatAddress(address)}
          </div>
          <Button
            onClick={handleDisconnect}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            variant="outline"
            className={`border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 ${
              isTouching ? 'bg-purple-500/20' : ''
            }`}
            disabled={isConnecting}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={isConnecting}
          className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ${
            isTouching ? 'from-purple-700 to-blue-700 scale-95' : ''
          }`}
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            minHeight: '44px',
            minWidth: '44px',
            padding: '0.5rem 1rem'
          }}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  )
}
