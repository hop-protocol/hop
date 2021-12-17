import { useQuery } from 'react-query'
import { Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import { Addressish } from 'src/models/Address'

async function fetchBalance(token: Token, address: Addressish) {
  return token.balanceOf(address?.toString())
}

const useBalance = (token?: Token, network?: Network, address?: Addressish) => {
  const { isLoading, isError, data, error } = useQuery(
    ['balance', token?.symbol, network?.slug, address?.toString],
    () => {
      if (token && address) {
        return fetchBalance(token, address)
      }
    },
    {
      enabled: !!token?.symbol && !!address?.toString,
      refetchInterval: 5e3,
    }
  )

  // TODO: use react-query naming conventions (data, isLoading, isError, error)
  return { loading: isLoading, isError, balance: data, error }
}

export default useBalance
