"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from 'react-toastify'
import { createConfig, http, useAccount, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
// import { mainnet, celoAlfajores, celo } from 'wagmi/chains';
// import { InjectedConnector } from 'wagmi/connectors/injected';
import { parseEther } from 'viem';

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
  isConnecting: boolean
  isTransacting: boolean
}

interface WalletContextType extends WalletState {
  connectWallet: (walletType: WalletType) => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
  sendTransaction: (to: string, value: string, data?: string) => Promise<string>
  purchaseTicket: (eventId: number, price: string, eventTitle: string) => Promise<boolean>
}

type WalletType = "metamask" | "walletconnect" | "coinbase"

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
  isConnecting: false,
  isTransacting: false,
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>(initialState)
  const router = useRouter()

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setWalletState((prev) => ({ ...prev, address: accounts[0] }))
          updateBalance(accounts[0])
        }
      }

      const handleChainChanged = (chainId: string) => {
        setWalletState((prev) => ({ ...prev, chainId: Number.parseInt(chainId, 16) }))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setWalletState({
            isConnected: true,
            address: accounts[0],
            balance: null,
            chainId: Number.parseInt(chainId, 16),
            isConnecting: false,
            isTransacting: false,
          })
          updateBalance(accounts[0])
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const updateBalance = async (address: string) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
        const balanceInEth = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
        setWalletState((prev) => ({ ...prev, balance: balanceInEth }))
      } catch (error) {
        console.error("Error fetching balance:", error)
      }
    }
  }

  const connectWallet = async (walletType: WalletType) => {
    try {
      setWalletState((prev) => ({ ...prev, isConnecting: true }))
      
      if (walletType === "metamask") {
        if (typeof window === "undefined") {
          throw new Error("Please use a Web3-enabled browser")
        }

        if (!window.ethereum) {
          throw new Error("MetaMask not detected. Please install MetaMask extension.")
        }

        // Check if MetaMask is the active provider
        if (!window.ethereum.isMetaMask) {
          throw new Error("MetaMask not found. Please make sure MetaMask is your active wallet.")
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const chainId = await window.ethereum.request({ method: "eth_chainId" })

        setWalletState({
          isConnected: true,
          address: accounts[0],
          balance: null,
          chainId: Number.parseInt(chainId, 16),
          isConnecting: false,
          isTransacting: false,
        })

        updateBalance(accounts[0])

        router.push("/dashboard")
        toast.success('Wallet connected successfully!');
      } else {
        // For demo purposes, simulate other wallet connections
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
        setWalletState({
          isConnected: true,
          address: mockAddress,
          balance: "1.2345",
          chainId: 1,
          isConnecting: false,
          isTransacting: false,
        })

        router.push("/dashboard")
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setWalletState((prev) => ({ ...prev, isConnecting: false }))
      toast.error(error instanceof Error ? error.message : 'Failed to connect wallet');
      throw error
    }
  }

  const disconnectWallet = () => {
    setWalletState(initialState)
    router.push("/")
    toast.info('Wallet disconnected');
  }

  const switchNetwork = async (chainId: number) => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        })
        toast.success(`Switched to network ${chainId}`);
      }
    } catch (error) {
      console.error("Error switching network:", error)
      toast.error('Failed to switch network');
      throw error
    }
  }

  const sendTransaction = async (to: string, value: string, data?: string): Promise<string> => {
    try {
      setWalletState((prev) => ({ ...prev, isTransacting: true }))
      
      if (!walletState.isConnected || !walletState.address) {
        throw new Error("Wallet not connected")
      }

      if (typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask) {
        // Real MetaMask transaction
        const transactionParameters = {
          to,
          from: walletState.address,
          value: `0x${(Number.parseFloat(value) * Math.pow(10, 18)).toString(16)}`,
          data: data || "0x",
        }

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })

        // Simulate transaction confirmation delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        toast.success('Transaction sent successfully!', {
          onClick: () => {
            // Add block explorer URL if available
            const explorerUrl = `https://explorer.celo.org/tx/${txHash}`;
            window.open(explorerUrl, '_blank');
          }
        });
        
        return txHash
      } else {
        // Simulate transaction for demo/preview environment
        console.log("[v0] Simulating transaction:", { to, value, data })

        // Simulate transaction processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Generate mock transaction hash
        const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64)
        console.log("[v0] Mock transaction hash:", mockTxHash)

        toast.success('Transaction sent successfully!', {
          onClick: () => {
            // Add block explorer URL if available
            const explorerUrl = `https://explorer.celo.org/tx/${mockTxHash}`;
            window.open(explorerUrl, '_blank');
          }
        });
        
        return mockTxHash
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      toast.error(error instanceof Error ? error.message : 'Transaction failed');
      throw error
    } finally {
      setWalletState((prev) => ({ ...prev, isTransacting: false }))
    }
  }

  const purchaseTicket = async (eventId: number, price: string, eventTitle: string): Promise<boolean> => {
    let toastId: string | number = '';
    try {
      setWalletState((prev) => ({ ...prev, isTransacting: true }));
      
      // Show initial toast
      toastId = toast.loading("Preparing transaction...");
      
      try {
        // Convert price to wei for the transaction
        const value = parseEther(price.replace(" CELO", ""));
        
        // Update toast for wallet confirmation
        toast.update(toastId, { 
          render: "Please confirm the transaction in your wallet",
          type: "info",
          isLoading: true,
          autoClose: false,
          closeButton: false
        });

        // Use wagmi's useSendTransaction hook
        const { sendTransactionAsync } = useSendTransaction();
        
        // Contract address and ABI
        const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE" as `0x${string}`;
        
        // Send transaction to purchase ticket
        const hash = await sendTransactionAsync({
          to: contractAddress,
          value,
          data: "0x", // Add your function data here if needed
        });

        // On success
        toast.dismiss(toastId);
        toast.success(
          <div 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const explorerUrl = `https://explorer.celo.org/tx/${hash}`;
              window.open(explorerUrl, '_blank');
            }}
          >
            <div>Ticket purchased successfully!</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Click to view on explorer</div>
          </div>,
          {
            autoClose: 5000,
            closeButton: true,
            closeOnClick: true,
            pauseOnHover: true
          }
        );
        
        return true;
      } catch (error) {
        console.error("Purchase failed:", error);
        if (toastId) {
          toast.dismiss(toastId);
        }
        toast.error(error instanceof Error ? error.message : 'Failed to purchase ticket', {
          autoClose: 5000,
          closeOnClick: true
        });
        return false;
      }
    } catch (error) {
      console.error("Purchase error:", error);
      if (toastId) {
        toast.dismiss(toastId);
      }
      toast.error(error instanceof Error ? error.message : 'An error occurred', {
        autoClose: 5000,
        closeOnClick: true
      });
      return false;
    } finally {
      setWalletState((prev) => ({ ...prev, isTransacting: false }));
    }
  }
  
  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        sendTransaction,
        purchaseTicket,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}

export function getWalletAvailability() {
  if (typeof window === "undefined") {
    return {
      metamask: false,
      walletconnect: true, // Always available as it's a protocol
      coinbase: true, // Assume available for demo
    }
  }

  return {
    metamask: !!(window.ethereum && window.ethereum.isMetaMask),
    walletconnect: true,
    coinbase: true,
  }
}
