import { useConnection, useBalance, useDisconnect } from 'wagmi'

export function useWallet() {
  const { address, isConnected, chain } = useConnection()
  const { data: balance } = useBalance({
    address,
  })
  const { disconnect } = useDisconnect()

  return {
    address,
    isConnected,
    chainId: chain?.id,
    balance: balance ? `${parseFloat(balance.value.toString()).toFixed(4)} ${balance.symbol}` : null,
    disconnect,
  }
}
