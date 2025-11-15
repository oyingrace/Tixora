"use client";

import {
  AppKitButton,
  AppKitNetworkButton,
} from "@reown/appkit/react";

export function WalletConnectButton() {

  return (
    <div className="flex gap-4">
      {/* <AppKitButton 
        balance="hide" 
        className="bg-gray-200 px-3 py-2 rounded-lg text-gray-900"
      />
      
      <AppKitNetworkButton
        className="bg-gray-200 px-3 py-2 rounded-lg text-gray-900"
      /> */}


      <appkit-account-button />
      <appkit-button />
      <appkit-connect-button />
      <appkit-modal />
      <appkit-network-button />
    </div>
  );
}
