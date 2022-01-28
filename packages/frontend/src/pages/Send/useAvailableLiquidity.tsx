import React, { useEffect, useState } from 'react'
import { ChainSlug, HopBridge, NetworkSlug, TChain, Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useQuery } from 'react-query'
import { hopAppNetwork } from 'src/config'
import Network from 'src/models/Network'
import { toTokenDisplay } from 'src/utils'
import InfoTooltip from 'src/components/InfoTooltip'

function disableNativeAssetTransfers(sourceChain: string, tokenSymbol: string) {
  if (
    (sourceChain === ChainSlug.Polygon && tokenSymbol === 'MATIC') ||
    (sourceChain === ChainSlug.Gnosis && tokenSymbol === 'DAI') ||
    (sourceChain === ChainSlug.Arbitrum && tokenSymbol === 'ETH') ||
    (sourceChain === ChainSlug.Optimism && tokenSymbol === 'ETH') ||
    (sourceChain === ChainSlug.Ethereum && tokenSymbol === 'ETH')
  ) {
    return true
  }
  return false
}

const useAvailableLiquidity = (
  bridge?: HopBridge,
  sourceToken?: Token,
  sourceChain?: Network,
  destinationChain?: Network,
  requiredLiquidity?: BigNumber
) => {
  const [sufficientLiquidity, setSufficientLiquidity] = useState(false)
  const [warning, setWarning] = useState<any>()

  const queryKey = `availableLiquidity:${sourceToken?.symbol}:${sourceChain?.slug}:${destinationChain?.slug}`
  const tokenSymbol = sourceToken?.symbol

  const { isLoading, data, error } = useQuery(
    [queryKey, sourceToken?.symbol, sourceChain?.slug, destinationChain?.slug],
    async () => {
      if (sourceChain && destinationChain && tokenSymbol) {
        const liquidity = await bridge?.getFrontendAvailableLiquidity(
          sourceChain.slug,
          destinationChain.slug
        )
        const shouldDisableNativeAssetTransfers =
          process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS === 'true' &&
          disableNativeAssetTransfers(sourceChain.slug, tokenSymbol)
        return shouldDisableNativeAssetTransfers ? BigNumber.from(0) : liquidity
      }
    },
    {
      enabled: !!bridge && !!sourceToken?.symbol && !!sourceChain?.slug && !!destinationChain?.slug,
      refetchInterval: 7e3,
    }
  )

  useEffect(() => {
    if (!destinationChain || !data || !requiredLiquidity || !sourceToken) {
      setSufficientLiquidity(false)
      return setWarning('')
    }

    const isAvailable = BigNumber.from(data).gte(requiredLiquidity)
    const formattedAmount = toTokenDisplay(data, sourceToken.decimals)

    if (sourceChain?.isLayer1 || isAvailable) {
      setSufficientLiquidity(true)
      return setWarning('')
    }

    const warningMessage = (
      <>
        Insufficient liquidity. There is {formattedAmount} {sourceToken.symbol} bonder liquidity
        available on {destinationChain.name}. Please try again in a few minutes when liquidity
        becomes available again.{' '}
        <InfoTooltip
          title={
            <>
              <div>
                The Bonder does not have enough liquidity to bond the transfer at the destination.
                Liquidity will become available again after the bonder has settled any bonded
                transfers.
              </div>
              <div>Available liquidity: {formattedAmount}</div>
              <div>
                Required liquidity: {toTokenDisplay(requiredLiquidity, sourceToken.decimals)}
              </div>
            </>
          }
        />
      </>
    )

    if (hopAppNetwork !== NetworkSlug.Staging) {
      setSufficientLiquidity(false)
      setWarning(warningMessage)
    }
  }, [sourceChain, sourceToken, destinationChain, data, requiredLiquidity])

  return {
    availableLiquidity: !sourceChain?.isLayer1 && !data,
    sufficientLiquidity,
    warning,
    isLoading,
    error,
  }
}

export default useAvailableLiquidity
