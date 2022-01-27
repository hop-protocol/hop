import { useQuery } from 'react-query'
import { Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import { Addressish } from 'src/models/Address'

async function fetchBalance(token: Token, address: Addressish) {
  return token.balanceOf(address?.toString())
}

const useBalance = (token?: Token, network?: Network, address?: Addressish) => {
  const queryKey = `balance:${network?.slug}:${address?.toString()}`

  const { isLoading, isError, data, error } = useQuery(
    [queryKey, token?.symbol, network?.slug, address?.toString()],
    () => {
      if (token && address) {
        return fetchBalance(token, address)
      }
    },
    {
      enabled: !!token?.symbol && !!network?.slug && !!address?.toString(),
      refetchInterval: 5e3,
    }
  )

  return { loading: isLoading, isError, balance: data, error }
}

export default useBalance
