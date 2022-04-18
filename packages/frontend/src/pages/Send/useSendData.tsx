import { useMemo } from 'react'
import { BigNumber } from 'ethers'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Chain from 'src/models/Chain'
import { useQuery } from 'react-query'
import { defaultRefetchInterval } from 'src/utils'

const useSendData = (
  token?: Token,
  slippageTolerance?: number,
  sourceChain?: Chain,
  destinationChain?: Chain,
  fromAmount?: BigNumber
) => {
  const { sdk } = useApp()

  const queryKey = `sendData:${token?.symbol}:${sourceChain?.slug}:${
    destinationChain?.slug
  }:${fromAmount?.toString()}`

  const { isLoading, data, error } = useQuery(
    [queryKey, token?.address, sourceChain?.slug, destinationChain?.slug, fromAmount?.toString()],
    async () => {
      if (!(token && sourceChain && destinationChain && fromAmount)) {
        return
      }

      const bridge = sdk.bridge(token?.symbol)
      return bridge.getSendData(fromAmount, sourceChain.slug, destinationChain.slug)
    },
    {
      enabled:
        !!token?.address &&
        !!sourceChain?.slug &&
        !!destinationChain?.slug &&
        !!fromAmount?.toString(),
      refetchInterval: defaultRefetchInterval,
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
