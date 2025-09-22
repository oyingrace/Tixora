'use client'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { celoSepolia, celoAlfajores } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const projectId = '505bbca624bfefde94e149726255a254';

// Configure the chains you want to support
const chains = [celoSepolia, celoAlfajores] as const;

// Set up the config with your WalletConnect project ID
const config = getDefaultConfig({
  appName: 'Tixora',
  projectId: projectId,
  chains: chains as any, // Type assertion to handle readonly arrays
  ssr: true, // If your app uses Server Side Rendering
});

// Create a React Query client
const queryClient = new QueryClient();

export { config, queryClient };

// Create a custom theme if needed
const customLightTheme = lightTheme({
  accentColor: '#4f46e5',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

const customDarkTheme = darkTheme({
  accentColor: '#818cf8',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: customLightTheme,
            darkMode: customDarkTheme,
          }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}