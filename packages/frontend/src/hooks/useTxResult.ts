import { useQuery } from 'react-query'
import { Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import { BigNumber } from 'ethers'

export function useTxResult(
  token?: Token,
  srcNetwork?: Network,
  destNetwork?: Network,
  amount?: BigNumber,
  cb?: (opts: any) => any,
  opts?: any
) {
  const queryKey = `txResult:${token?.symbol}:${srcNetwork?.slug}:${
    destNetwork?.slug
  }:${amount?.toString()}`
  const { interval = 10e3, ...rest } = opts

  const { isLoading, isError, data, error } = useQuery(
    [queryKey, srcNetwork?.slug, token?.symbol, amount?.toString()],
    async () => {
      if (!(token && srcNetwork?.slug && destNetwork?.slug && amount && cb)) {
        return
      }

      const options = {
        token: token,
        fromNetwork: srcNetwork,
        toNetwork: destNetwork,
        ...rest,
      }

      try {
        return cb(options)
      } catch (error) {
        // noop
      }
    },
    {
      enabled: !!token?.symbol && !!srcNetwork?.slug && !!amount?.toString(),
      refetchInterval: interval,
    }
  )

  return {
    data,
    isLoading,
    isError,
    error,
  }
}
