import Network from '#models/Network.js'
import { BigNumber } from 'ethers'
import { Token } from '@hop-protocol/sdk'
import { useApp } from '#contexts/AppContext/index.js'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

const useSendData = (
  token?: Token,
  slippageTolerance?: number,
  fromNetwork?: Network,
  toNetwork?: Network,
  fromAmount?: BigNumber
) => {
  const { sdk } = useApp()

  const queryKey = `sendData:${token?.symbol}:${fromNetwork?.slug}:${
    toNetwork?.slug
  }:${fromAmount?.toString()}`

  const { isLoading, data, error } = useQuery(
    [queryKey, token?.address, fromNetwork?.slug, toNetwork?.slug, fromAmount?.toString()],
    async () => {
      if (!(token && fromNetwork && toNetwork && fromAmount)) {
        return
      }

      const bridge = sdk.bridge(token?.symbol)

      const isDeprecatedRoute = fromNetwork && toNetwork && ['USDC', 'USDC.e', 'MAGIC'].includes(token?.symbol) && !bridge?.getIsSupportedCctpRoute(fromNetwork?.slug, toNetwork?.slug)
      if (isDeprecatedRoute) {
        return
      }

      return bridge.getSendData(fromAmount, fromNetwork.slug, toNetwork.slug)
    },
    {
      enabled:
        !!token?.address && !!fromNetwork?.slug && !!toNetwork?.slug && !!fromAmount?.toString(),
      refetchInterval: 5 * 1000,
    }
  )

  const amountOutMin = useMemo(() => {
    if (slippageTolerance && data?.amountOut) {
      const slippageToleranceBps = slippageTolerance * 100
      const minBps = Math.ceil(10000 - slippageToleranceBps)
      return data.amountOut.mul(minBps).div(10000)
    }
  }, [data?.amountOut, slippageTolerance])

  const intermediaryAmountOutMin = useMemo(() => {
    if (slippageTolerance && data?.requiredLiquidity) {
      const slippageToleranceBps = slippageTolerance * 100
      const minBps = Math.ceil(10000 - slippageToleranceBps)
      return data.requiredLiquidity.mul(minBps).div(10000)
    }
  }, [data?.requiredLiquidity, slippageTolerance])

  return {
    ...data,
    amountOutMin,
    intermediaryAmountOutMin,
    loading: isLoading,
    error,
  }
}

export default useSendData
