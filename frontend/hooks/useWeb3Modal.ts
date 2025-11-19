import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId } from '@/config';
import { celoSepolia, baseSepolia } from '@reown/appkit/networks';

export const useWeb3Modal = () => {
  const initializeModal = () => {
    if (typeof window === 'undefined') return null;

    const modal = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: [celoSepolia, baseSepolia],
      defaultNetwork: celoSepolia,
      features: {
        analytics: true
      }
    });

    return modal;
  };

  return { initializeModal };
};
