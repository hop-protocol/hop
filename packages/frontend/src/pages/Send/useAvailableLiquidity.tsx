import { ChainSlug, HopBridge } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useQuery } from 'react-query'
import { getNativeTokenSymbol } from 'src/utils/getNativeTokenSymbol'

function disableNativeAssetTransfers(sourceChain: string, tokenSymbol: string) {
  const nativeTokenSymbol = getNativeTokenSymbol(sourceChain)
  if (tokenSymbol === nativeTokenSymbol) {
    return true
  }

  // check for both XDAI and DAI on Gnosis chain
  if (sourceChain === ChainSlug.Gnosis && tokenSymbol === 'DAI') {
    return true
  }

  return false
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
        const liquidity = await bridge?.getFrontendAvailableLiquidity(sourceChain, destinationChain)
        const shouldDisableNativeAssetTransfers =
          process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS === 'true' &&
          disableNativeAssetTransfers(sourceChain, tokenSymbol)
        return shouldDisableNativeAssetTransfers ? BigNumber.from(0) : liquidity
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
