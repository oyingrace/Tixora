"use client"

import { useConnection } from 'wagmi';
import { Button } from './ui/button';
import { useAppKit } from '@reown/appkit/react';

export function CustomConnectButton() {
  const { isConnected, address } = useConnection()
  const { open } = useAppKit();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';


  function handleCOnnectWallet() {
    if (!isConnected) {
      open({view: "Connect"})
    } else {
      open({view: "Account"})
    }
  }

  // If wallet is connected, show disconnect button
  if (isConnected && address) {
    return (
      <Button
        onClick={handleCOnnectWallet}
        variant="secondary"
      >
        {shortAddress}
      </Button>
    );
  }

  // If wallet is not connected, show RainbowKit connect modal
  return (
    <Button
      onClick={handleCOnnectWallet}
      variant="secondary"
    >
      Connect Wallet
    </Button>
  );
}