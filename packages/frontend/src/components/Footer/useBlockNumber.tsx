import { ethers } from 'ethers'
import { useQuery } from 'react-query'
import { reactAppNetwork } from '#config/index.js'
import { getChain, ChainSlug, NetworkSlug } from '@hop-protocol/sdk'

export function useBlockNumber() {

  const { data: blockNumber } = useQuery(
    [
      'useBlockNumber',
    ],
    async () => {
      const publicRpcUrl = getChain(reactAppNetwork as NetworkSlug, ChainSlug.Ethereum).publicRpcUrl
      const provider = new ethers.providers.JsonRpcProvider({ allowGzip: true, url: publicRpcUrl })
      const blockNumber = await provider.getBlockNumber()
      return blockNumber.toString()
    },
    {
      enabled: true,
      refetchInterval: 10 * 1000
    }
  )

  return {
    blockNumber
  }
}
