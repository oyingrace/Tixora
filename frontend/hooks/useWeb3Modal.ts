import { createAppKit, type AppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId } from '@/config';
import { celoSepolia, baseSepolia } from '@reown/appkit/networks';

export const useWeb3Modal = () => {
  const initializeModal = (): AppKit | null => {
    if (typeof window === 'undefined') return null;
    if (!projectId) {
      console.error('Project ID is not defined');
      return null;
    }

    try {
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
    } catch (error) {
      console.error('Failed to initialize Web3Modal:', error);
      return null;
    }
  };

  return { initializeModal };
};
