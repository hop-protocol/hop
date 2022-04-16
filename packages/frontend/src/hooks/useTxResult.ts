import { useQuery } from 'react-query'
import { Token } from '@hop-protocol/sdk'
import Chain from 'src/models/Chain'
import { BigNumber } from 'ethers'
import { defaultRefetchInterval } from 'src/utils'

export function useTxResult(
  token?: Token,
  sourceChain?: Chain,
  destinationChain?: Chain,
  amount?: BigNumber,
  cb?: (opts: any) => any,
  opts?: any
) {
  const queryKey = `txResult:${token?.symbol}:${sourceChain?.slug}:${
    destinationChain?.slug
  }:${amount?.toString()}`
  const { interval = defaultRefetchInterval, ...rest } = opts

  const {
    isLoading,
    isError,
    data: estimatedGasCost,
    error,
  } = useQuery(
    [queryKey, sourceChain?.slug, token?.symbol, amount?.toString()],
    async () => {
      if (!(token && sourceChain?.slug && destinationChain?.slug && amount && cb)) {
        return
      }

      console.log(`rest:`, rest)
      const options = {
        token: token,
        sourceChain: sourceChain,
        destinationChain: destinationChain,
        ...rest,
      }
      console.log(`cb:`, cb)

      try {
        return cb(options)
      } catch (error) {
        // noop
        console.log(`error:`, error)
      }
    },
    {
      enabled: !!token?.symbol && !!sourceChain?.slug && !!amount?.toString(),
      refetchInterval: interval,
    }
  )

  return {
    estimatedGasCost,
    isLoading,
    isError,
    error,
  }
}
