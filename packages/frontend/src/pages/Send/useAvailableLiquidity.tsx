import { ChainSlug, HopBridge } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useQuery } from 'react-query'

function disableNativeAssetTransfers(sourceChain: string, tokenSymbol: string) {
  if (
    (sourceChain === ChainSlug.Polygon && tokenSymbol === 'MATIC') ||
    (sourceChain === ChainSlug.Gnosis && tokenSymbol === 'DAI') ||
    (sourceChain === ChainSlug.Arbitrum && tokenSymbol === 'ETH') ||
    (sourceChain === ChainSlug.Optimism && tokenSymbol === 'ETH') ||
    (sourceChain === ChainSlug.Ethereum && tokenSymbol === 'ETH')
  ) {
    return BigNumber.from(0)
  }
}

const useAvailableLiquidity = (
  bridge?: HopBridge,
  sourceChain?: string,
  destinationChain?: string
) => {
  const tokenSymbol = bridge?.getTokenSymbol()

  const queryKey = `availableLiquidity:${tokenSymbol}:${sourceChain}:${destinationChain}`

  const { isLoading, data, error } = useQuery(
    [queryKey, tokenSymbol, sourceChain, destinationChain],
    async () => {
      if (sourceChain && destinationChain && tokenSymbol) {
        let liquidity = await bridge?.getFrontendAvailableLiquidity(sourceChain, destinationChain)
        liquidity = disableNativeAssetTransfers(sourceChain, tokenSymbol)
        return liquidity
      }
    },
    {
      enabled: !!bridge && !!tokenSymbol && !!sourceChain && !!destinationChain,
      refetchInterval: 7e3,
    }
  )

  return {
    availableLiquidity: data,
    isLoading,
    error,
  }
}

export default useAvailableLiquidity
