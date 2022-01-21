import { useQuery } from 'react-query'
import { Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import { BigNumber } from 'ethers'

export function useTxResult(
  token?: Token,
  srcNetwork?: Network,
  destNetwork?: Network,
  amount?: BigNumber,
  fn?: (opts: any) => any,
  opts?: any
) {
  const queryKey = `txResult:${srcNetwork?.slug}:${destNetwork?.slug}:${amount?.toString()}`
  const { interval = 5e3, ...rest } = opts

  const { isLoading, isError, data, error } = useQuery(
    [queryKey, srcNetwork?.slug, token?.symbol, amount?.toString()],
    async () => {
      if (!(token && srcNetwork?.slug && destNetwork?.slug && amount && fn)) {
        return
      }

      const options = {
        token: token,
        fromNetwork: srcNetwork,
        toNetwork: destNetwork,
        ...rest,
      }

      const res = await fn(options)
      return res
    },
    {
      enabled: !!token?.address && !!srcNetwork?.slug && !!destNetwork?.slug && !!amount,
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
