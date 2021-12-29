import { getProviderByNetworkName } from './getProvider'

const provider = getProviderByNetworkName('ethereum')

export async function getEnsName(address: string) {
  try {
    const ensName = await provider.lookupAddress(address)
    return ensName ?? address
  } catch (error) {
    // noop
  }

  return address
}

export async function getEnsAvatar(address: string) {
  try {
    const ensAvatar = await provider.getAvatar(address)
    if (ensAvatar != null) {
      return ensAvatar
    }
  } catch (error) {
    // noop
  }
}
