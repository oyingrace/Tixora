"use client";

import { useAccount, useConnect } from 'wagmi';
import { Button } from './ui/button';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';

export function WalletConnectButton() {
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();
  const { isPending: isConnecting } = useConnect();
  const { isConnected: isAppKitAccountConnected } = useAppKitAccount();


  // Handle wallet connection
  const handleConnect = () => {
    if (!isConnected && !isAppKitAccountConnected) {
      open({ view: "Connect" });
    } else {
      open({ view: "Account" });
    }
  };

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const isWalletConnected = isConnected || isAppKitAccountConnected;

  return (
    <div className="flex items-center gap-2">
      {isWalletConnected && address ? (
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
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}
