import { HopBridge } from '@hop-protocol/sdk'
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
        return bridge?.getFrontendAvailableLiquidity(sourceChain, destinationChain)
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
