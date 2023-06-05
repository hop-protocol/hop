import { orusThatRelyOnL1ConfirmationsForFinality } from 'src/config'
import { getProviderByNetworkName } from 'src/utils/getProvider'
import { getNetworkWaitConfirmations } from 'src/utils/networks'

export async function getIsTxFinalized (
  txBlockNumber: number | undefined,
  chainSlug: string
) {
  if (!txBlockNumber) return false

  const provider = getProviderByNetworkName(chainSlug)
  if (orusThatRelyOnL1ConfirmationsForFinality.includes(chainSlug)) {
    const finalizedBlock = await provider.getBlock('safe')
    return txBlockNumber < finalizedBlock.number
  } else {
    const latestBlock = await provider.getBlock('latest')
    const waitConfirmations = getNetworkWaitConfirmations(chainSlug)
    return waitConfirmations ? latestBlock.number - txBlockNumber > waitConfirmations : false
  }
}
