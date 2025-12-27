"use client";

import { useSwitchChain, useChainId } from 'wagmi';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ChainId } from '@/lib/addressAndAbi';
import { toast } from 'react-toastify';
import Image from 'next/image';

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const networks = [
    { id: ChainId.BASE, name: 'Base', icon: '/base.jpeg' },
    { id: ChainId.CELO, name: 'Celo', icon: '/celo.png' },
  ];

  const currentNetwork = networks.find((n) => n.id === chainId) || networks[0];

  const handleNetworkSwitch = async (networkId: number) => {
    try {
      await switchChain({ chainId: networkId });
      toast.success(`Switched to ${networkId === ChainId.BASE ? 'Base' : networkId === ChainId.CELO ? 'Celo' : 'Unknown Network'}`);
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error(
        <div>
          <p>Failed to switch network</p>
          <p className="text-sm text-gray-300">Please make sure you have the network added to your wallet</p>
        </div>
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-slate-700 hover:bg-slate-800/50 text-slate-200 hover:text-white"
        >
          <Image
            src={currentNetwork.icon}
            alt={currentNetwork.name}
            width={20}
            height={20}
            className="rounded-full mr-2"
          />
          {currentNetwork.name}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-slate-800 border-slate-700">
        {networks.map((network) => (
          <DropdownMenuItem
            key={network.id}
            onClick={() => handleNetworkSwitch(network.id)}
            className={`cursor-pointer ${
              currentNetwork.id === network.id
                ? 'bg-slate-700 text-white'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <Image
              src={network.icon}
              alt={network.name}
              width={20}
              height={20}
              className="rounded-full mr-2"
            />
            {network.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
