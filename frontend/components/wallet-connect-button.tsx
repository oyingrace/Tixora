"use client"

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useWeb3Modal } from '@/hooks/useWeb3Modal'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useAsyncOperation } from '@/hooks/use-async-operation'
import { LoadingSpinner } from './ui/loading-spinner'

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request?: (request: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

interface Web3Modal {
  openModal: () => void;
  closeModal: () => void;
}

export function WalletConnectButton() {
  const { isConnected, address } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [modal, setModal] = useState<Web3Modal | null>(null)
  const [isTouching, setIsTouching] = useState(false)
  const { initializeModal } = useWeb3Modal()

  // Handle wallet connection with loading state and error handling
  const { execute: handleConnect, isLoading: isConnectingWallet } = useAsyncOperation(
    async () => {
      // Check if MetaMask is installed
      if (window.ethereum?.isMetaMask) {
        // Request accounts access
        await window.ethereum.request?.({ method: 'eth_requestAccounts' })
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
    },
    {
      loadingMessage: 'Connecting wallet...',
      successMessage: 'Wallet connected successfully',
      errorMessage: 'Failed to connect wallet',
      showToast: true
    }
  )

  // Handle disconnect with loading state and error handling
  const { execute: handleDisconnect, isLoading: isDisconnecting } = useAsyncOperation(
    async () => {
      disconnect()
      if (modal) {
        modal.closeModal()
      }
      router.refresh()
    },
    {
      loadingMessage: 'Disconnecting...',
      successMessage: 'Wallet disconnected',
      showToast: true
    }
  )

  // Handle touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsTouching(true)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsTouching(false)
  }, [])



  // Cleanup modal on unmount
  useEffect(() => {
    return () => {
      if (modal) {
        modal.closeModal()
      }
    }
  }, [modal])

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }


  // Cleanup modal on unmount
  useEffect(() => {
    return () => {
      if (modal) {
        modal.closeModal()
      }
    }
  }, [modal])

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const isLoading = isConnecting || isConnectingWallet || isDisconnecting;

  return (
    <div className="flex items-center gap-2">
      {isConnected && address ? (
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-slate-800/50 text-sm text-slate-200 border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            {formatAddress(address)}
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDisconnect(e);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            variant="outline"
            disabled={isLoading}
            className={`border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 ${
              isTouching ? 'bg-purple-500/20' : ''
            } min-w-[120px] h-10 flex items-center justify-center`}
          >
            {isDisconnecting ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : null}
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </div>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleConnect(e);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={isLoading}
          className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ${
            isTouching ? 'from-purple-700 to-blue-700 scale-95' : ''
          } min-w-[160px] h-10`}
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            minHeight: '44px',
            minWidth: '160px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Connecting...</span>
            </>
          ) : (
            'Connect Wallet'
          )}
        </Button>
      )}
    </div>
  )
}
