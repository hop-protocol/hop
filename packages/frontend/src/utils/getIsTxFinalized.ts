import { getFinalityTags } from 'src/utils'
import { getProviderByNetworkName } from 'src/utils/getProvider'
import { ChainFinalityTag } from '@hop-protocol/core/config/types'

export async function getIsTxFinalized (
  txBlockNumber: number | undefined,
  chainSlug: string
) {
  if (!txBlockNumber) return false

  const provider = getProviderByNetworkName(chainSlug)
  const finalityTag: ChainFinalityTag = getFinalityTags(chainSlug)

  if (typeof finalityTag.finalized === 'number') {
    const latestBlock = await provider.getBlock('latest')
    const waitConfirmations = finalityTag.finalized
    return waitConfirmations ? latestBlock.number - txBlockNumber > waitConfirmations : false
  }

  const finalizedBlock = await provider.getBlock(finalityTag.finalized)
  return txBlockNumber < finalizedBlock.number
}
