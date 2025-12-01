import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { Address } from 'viem';
import { getContractAddresses, ChainId, resaleMarketAbi } from '@/lib/addressAndAbi';

// Types
interface Listing {
  ticketId: bigint;
  tokenId: bigint;
  seller: Address;
  price: bigint;
  active: boolean;
}

export function useResaleMarketGetters() {
  const { chain } = useAccount();
  const chainId = chain?.id || ChainId.CELO_SEPOLIA;
  
  const { resaleMarket } = getContractAddresses(chainId);

  // Get event ticketing contract address
  const useEventTicketing = () => {
    return useReadContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'eventTicketing',
      chainId,
    });
  };

  // Get fee recipient
  const useFeeRecipient = () => {
    return useReadContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'feeRecipient',
      chainId,
    });
  };

  // Get listing details by token ID
  const useGetListing = (tokenId?: bigint) => {
    return useReadContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'getListing',
      args: tokenId !== undefined ? [tokenId] : undefined,
      chainId,
      query: {
        enabled: tokenId !== undefined,
      },
    }) as ReturnType<typeof useReadContract> & { 
      data?: [bigint, bigint, Address, bigint, boolean] 
    };
  };

  // Get listing by token ID (mapping access)
  const useListings = (tokenId?: bigint) => {
    return useReadContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'listings',
      args: tokenId !== undefined ? [tokenId] : undefined,
      chainId,
      query: {
        enabled: tokenId !== undefined,
      },
    }) as ReturnType<typeof useReadContract> & { data?: Listing };
  };

  // Get maximum listing price
  const useMaxPrice = () => {
    return useReadContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'maxPrice',
      chainId,
    });
  };

  // Get contract owner
  const useOwner = () => {
    return useReadContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'owner',
      chainId,
    });
  };

  // Get royalty basis points
  const useRoyaltyBps = () => {
    return useReadContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'royaltyBps',
      chainId,
    });
  };

  // Get ticket NFT contract address
  const useTicketNft = () => {
    return useReadContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'ticketNft',
      chainId,
    });
  };

  return {
    useEventTicketing,
    useFeeRecipient,
    useGetListing,
    useListings,
    useMaxPrice,
    useOwner,
    useRoyaltyBps,
    useTicketNft,
  };
}

export function useResaleMarketSetters() {
  const { chain } = useAccount();
  const chainId = chain?.id || ChainId.CELO_SEPOLIA;
  
  const { resaleMarket } = getContractAddresses(chainId);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId,
  });

  // Buy ticket (payable)
  const buyTicket = (tokenId: bigint, value?: bigint) => {
    writeContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'buyTicket',
      args: [tokenId],
      value,
      chainId,
    });
  };

  // Cancel listing
  const cancelListing = (tokenId: bigint) => {
    writeContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'cancelListing',
      args: [tokenId],
      chainId,
    });
  };

  // List ticket for sale (handles approval internally in the smart contract)
  const listTicket = (tokenId: bigint, price: bigint) => {
    writeContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'listTicket',
      args: [tokenId, price],
      chainId,
    });
  };

  // Set fee recipient
  const setFeeRecipient = (newRecipient: Address) => {
    writeContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'setFeeRecipient',
      args: [newRecipient],
      chainId,
    });
  };

  // Set maximum price
  const setMaxPrice = (newMaxPrice: bigint) => {
    writeContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'setMaxPrice',
      args: [newMaxPrice],
      chainId,
    });
  };

  // Set royalty
  const setRoyalty = (newRoyaltyBps: number) => {
    writeContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'setRoyalty',
      args: [newRoyaltyBps],
      chainId,
    });
  };

  // Transfer ownership
  const transferOwnership = (newOwner: Address) => {
    writeContract({
      address: resaleMarket as Address,
      abi: resaleMarketAbi,
      functionName: 'transferOwnership',
      args: [newOwner],
      chainId,
    });
  };

  return {
    // Transaction state
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,

    // Write functions
    buyTicket,
    cancelListing,
    listTicket,
    setFeeRecipient,
    setMaxPrice,
    setRoyalty,
    transferOwnership,
  };
}
