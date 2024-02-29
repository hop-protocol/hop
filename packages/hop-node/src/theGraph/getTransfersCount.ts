import getTransferIds from './getTransferIds.js'

async function getTransfersCount (
  chain: string,
  token: string
) {
  const transferIds = await getTransferIds(chain, token)
  return transferIds.length
}

export default getTransfersCount
