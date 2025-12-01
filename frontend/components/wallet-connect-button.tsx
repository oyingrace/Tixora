"use client"

import { useConnection, useConnect } from 'wagmi';
import { Button } from './ui/button';
import { useAppKit } from '@reown/appkit/react';
import { LoadingSpinner } from './ui/loading-spinner';

export default function WalletConnectButton() {
  const { isConnected, address } = useConnection();
  const { open } = useAppKit();
  const { isPending: isConnecting } = useConnect();


  // Handle wallet connection
  const handleConnect = () => {
    if (!isConnected) {
      open({ view: "Connect" });
    } else {
      open({ view: "Account" });
    }
  }

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const isLoading = isConnecting;

  return (
    <div className="flex items-center gap-2">
      {isConnected && address ? (
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-slate-800/50 text-sm text-slate-200 border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            {formatAddress(address)}
          </div>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white`}
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
      <appkit-modal />
    </div>
  )
}
