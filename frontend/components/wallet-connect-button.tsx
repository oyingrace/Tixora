"use client";

import {
  AppKitButton,
  AppKitNetworkButton,
  AppKitAccountButton,
} from "@reown/appkit/react";

export function WalletConnectButton() {

  return (
    <div className="flex gap-4">
      <AppKitButton />
      <AppKitNetworkButton />
      <AppKitAccountButton />
    </div>
  );
}
