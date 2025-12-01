"use client";

import { useState, useRef, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { base, celo, celoSepolia, baseSepolia } from 'viem/chains';
import { CustomButton } from "./ui/CustomButton";
import Image from "next/image";
import { ChevronDown } from 'lucide-react';
import { networks as supportedChains } from "../config";

const CHAIN_ICONS: Record<number, string> = {
  [base.id]: '/base.png',
  [baseSepolia.id]: '/base.png',
  [celo.id]: '/celo.png',
  [celoSepolia.id]: '/celo.png',
};

const CHAIN_NAMES: Record<number, string> = {
  [base.id]: 'Base',
  [baseSepolia.id]: 'Base Sepolia',
  [celo.id]: 'Celo',
  [celoSepolia.id]: 'Celo Sepolia',
};

export function CustomNetworkButton() {
  const { chain } = useAccount();
  const { chains: availableChains, switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentChain = chain && availableChains.find((c) => c.id === chain.id);
  const isUnsupported = !chain || !availableChains.some((c) => c.id === chain.id);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNetworkChange = async (chainId: number) => {
    try {
      await switchChain({ chainId });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
      // TODO: Add toast notification
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <CustomButton
        onClick={toggleDropdown}
        icon={
          currentChain && CHAIN_ICONS[currentChain.id] ? (
            <Image
              src={CHAIN_ICONS[currentChain.id]}
              alt={currentChain.name}
              width={24}
              height={24}
              className="rounded-full object-contain mr-1"
            />
          ) : null
        }
        variant="secondary"
        className="flex flex-row items-center gap-1"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isUnsupported 
          ? 'Wrong Network' 
          : currentChain 
            ? CHAIN_NAMES[currentChain.id] || currentChain.name
            : 'Select Network'
        }
        <ChevronDown 
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </CustomButton>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          onKeyDown={handleKeyDown}
        >
          <div className="py-1">
            {supportedChains.map((supportedChain) => (
              <button
                key={supportedChain.id}
                onClick={() => handleNetworkChange(supportedChain.id)}
                role="menuitem"
                className={`flex items-center w-full px-4 py-2 text-sm text-left transition-colors ${
                  chain?.id === supportedChain.id
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {CHAIN_ICONS[supportedChain.id] && (
                  <Image
                    src={CHAIN_ICONS[supportedChain.id]}
                    alt={supportedChain.name}
                    width={20}
                    height={20}
                    className="rounded-full mr-2"
                  />
                )}
                <span>{CHAIN_NAMES[supportedChain.id] || supportedChain.name}</span>
                {chain?.id === supportedChain.id && (
                  <span className="ml-auto text-green-500" aria-label="Currently selected">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}