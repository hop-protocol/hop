import { HopBridge } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useQuery } from 'react-query'

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
      if (sourceChain && destinationChain) {
        let liquidity = await bridge?.getFrontendAvailableLiquidity(sourceChain, destinationChain)
        if (
          (sourceChain === 'polygon' && tokenSymbol === 'MATIC') ||
          (sourceChain === 'gnosis' && tokenSymbol === 'DAI') ||
          (sourceChain === 'arbitrum' && tokenSymbol === 'ETH') ||
          (sourceChain === 'optimism' && tokenSymbol === 'ETH') ||
          (sourceChain === 'mainnet' && tokenSymbol === 'ETH')
        ) {
          liquidity = BigNumber.from(0)
        }
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
