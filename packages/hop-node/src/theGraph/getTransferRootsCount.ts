import getTransferRoots from './getTransferRoots'

async function getTransferRootsCount (
  chain: string,
  token: string
) {
  const transferRoots = await getTransferRoots(chain, token)
  return transferRoots.length
}

export default getTransferRootsCount
