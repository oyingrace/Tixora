"use client";

import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAppKit, useAppKit } from '@reown/appkit/react';
import { celo } from '@reown/appkit/networks';

type AppKitInstance = ReturnType<typeof createAppKit>;

export function WalletConnectButton() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [appKit, setAppKit] = useState<AppKitInstance | null>(null);
  const { connect, isConnected: isAppKitConnected } = useAppKit();

  // Initialize AppKit
  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') return;

    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId) {
      console.error('WalletConnect project ID is not set');
      return;
    }

    const appKitInstance = createAppKit({
      projectId,
      networks: [celo],
      theme: 'dark',
      appMetadata: {
        name: 'Tixora',
        description: 'Decentralized Event Ticketing Platform',
        url: window.location.origin,
        icons: [`${window.location.origin}/favicon.ico`],
      },
    });

    setAppKit(appKitInstance);
    setMounted(true);

    // Cleanup on unmount
    return () => {
      if (appKitInstance) {
        appKitInstance.disconnect();
      }
    };
  }, []);

  // Handle wallet connection
  const handleConnect = async () => {
    if (!appKit) return;
    
    try {
      setIsConnecting(true);
      const result = await appKit.connect();
      
      if (result) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      if (appKit) {
        await appKit.disconnect();
      }
      disconnect();
      router.refresh();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (!mounted) {
    return (
      <Button disabled className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        Loading...
      </Button>
    );
  }

  const isWalletConnected = isConnected || isAppKitConnected;

  return (
    <div className="flex items-center gap-2">
      {isWalletConnected && address ? (
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-slate-800/50 text-sm text-slate-200 border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            {formatAddress(address)}
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            disabled={isConnecting}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isConnecting || !appKit}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}
