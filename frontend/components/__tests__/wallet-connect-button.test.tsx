import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WalletConnectButton } from '../wallet-connect-button';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// Mock the required hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
}));

// Mock the useWeb3Modal hook
jest.mock('@/hooks/useWeb3Modal', () => ({
  useWeb3Modal: () => ({
    initializeModal: jest.fn().mockReturnValue({
      open: jest.fn(),
      close: jest.fn(),
    }),
  }),
}));

describe('WalletConnectButton', () => {
  const mockConnect = jest.fn();
  const mockDisconnect = jest.fn();
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementations
    (useConnect as jest.Mock).mockReturnValue({
      connect: mockConnect,
      connectors: [{}, {}],
      isPending: false,
    });
    
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: mockDisconnect,
    });
  });

  it('renders connect button when not connected', () => {
    (useAccount as jest.Mock).mockReturnValue({
      isConnected: false,
      address: undefined,
    });

    render(<WalletConnectButton />);
    
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    expect(connectButton).toBeInTheDocument();
  });

  it('shows wallet address when connected', () => {
    const mockAddress = '0x1234...abcd';
    (useAccount as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
    });

    render(<WalletConnectButton />);
    
    const addressDisplay = screen.getByText(/0x1234...bcde/i);
    expect(addressDisplay).toBeInTheDocument();
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    expect(disconnectButton).toBeInTheDocument();
  });

  it('calls connect when connect button is clicked', async () => {
    (useAccount as jest.Mock).mockReturnValue({
      isConnected: false,
      address: undefined,
    });

    render(<WalletConnectButton />);
    
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    fireEvent.click(connectButton);
    
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('calls disconnect when disconnect button is clicked', async () => {
    (useAccount as jest.Mock).mockReturnValue({
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
    });

    render(<WalletConnectButton />);
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    fireEvent.click(disconnectButton);
    
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when connecting', () => {
    (useAccount as jest.Mock).mockReturnValue({
      isConnected: false,
      address: undefined,
    });
    
    (useConnect as jest.Mock).mockReturnValue({
      connect: mockConnect,
      connectors: [{}, {}],
      isPending: true, // Simulate connecting state
    });

    render(<WalletConnectButton />);
    
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeInTheDocument();
    
    const connectButton = screen.getByRole('button', { name: /connecting.../i });
    expect(connectButton).toBeInTheDocument();
    expect(connectButton).toBeDisabled();
  });
});
