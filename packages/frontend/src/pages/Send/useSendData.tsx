import Network from '#models/Network.js'
import { BigNumber } from 'ethers'
import { Token } from '@hop-protocol/sdk'
import { useApp } from '#contexts/AppContext/index.js'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useWeb3Context } from '#contexts/Web3Context.js'

const useSendData = (
  token?: Token,
  slippageTolerance?: number,
  fromNetwork?: Network,
  toNetwork?: Network,
  fromAmount?: BigNumber
) => {
  const { sdk } = useApp()
  const { provider } = useWeb3Context()

  const queryKey = `sendData:${token?.symbol}:${fromNetwork?.slug}:${
    toNetwork?.slug
  }:${fromAmount?.toString()}`

  const { isLoading, data, error } = useQuery(
    [queryKey, token?.address, fromNetwork?.slug, toNetwork?.slug, fromAmount?.toString()],
    async () => {
      if (!(token && fromNetwork && toNetwork && fromAmount?.gt(0))) {
        return
      }

      const signer = provider?.getSigner()
      let bridge = sdk.bridge(token?.symbol)
      if (signer) {
        bridge = bridge.connect(signer)
      }

      const isDeprecatedRoute = fromNetwork && toNetwork && ['USDC', 'USDC.e', 'MAGIC'].includes(token?.symbol) && !bridge?.getIsSupportedCctpRoute(fromNetwork?.slug, toNetwork?.slug)
      if (isDeprecatedRoute) {
        return
      }

      const sendData = await bridge.getSendData(fromAmount, fromNetwork.slug, toNetwork.slug)
      console.log('sendData', sendData)
      if (sendData?.isSocket) {
        console.log('sendData.originalSocketResponse', sendData.originalSocketResponse)
      }
      return sendData
    },
    {
      enabled: !!token?.address && !!fromNetwork?.slug && !!toNetwork?.slug && !!fromAmount?.toString(),
      refetchInterval: 5 * 1000,
      staleTime: 5 * 1000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      keepPreviousData: true,
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
