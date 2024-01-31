import { Addressish } from 'src/models/Address'
import { ChainId, Token } from '@hop-protocol/sdk'
import { Contract } from 'ethers'
import { StakingRewards } from '@hop-protocol/core/contracts'
import { useQuery } from 'react-query'

type ContractType = Token | StakingRewards   | Contract

async function fetchBalance(token: ContractType, address: string) {
  return token.balanceOf(address)
}

const useBalance = (token?: ContractType, address?: Addressish, chainId?: ChainId) => {
  chainId = token instanceof Token ? token.chain.chainId : chainId

  const queryKey = `balance:${chainId}:${token?.address}:${address?.toString()}`

  const { isLoading, isError, data, error } = useQuery(
    [queryKey, chainId, token?.address, address?.toString()],
    async () => {
      if (token && address) {
        return fetchBalance(token, address.toString())
      }
    },
    {
      enabled: !!chainId && !!token?.address && !!address?.toString(),
      refetchInterval: 10 * 1000,
    }
  )

  return { loading: isLoading, isError, balance: data, error }
}

export default useBalance
