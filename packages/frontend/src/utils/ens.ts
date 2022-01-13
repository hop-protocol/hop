import { getProviderByNetworkName } from './getProvider'

const provider = getProviderByNetworkName('ethereum')

export async function getEnsName(address: string) {
  try {
    return provider.lookupAddress(address)
  } catch (error) {
    // noop
  }

  return address
}

export async function getEnsAvatar(ensNameOrAddress: string) {
  try {
    const ensAvatar = await provider.getAvatar(ensNameOrAddress)
    if (ensAvatar != null) {
      return ensAvatar
    }
  } catch (error) {
    // noop
  }
}

export async function getEnsAddress(ensName: string) {
  if (!ensName.endsWith('.eth')) {
    return
  }

  try {
    return provider.resolveName(ensName)
  } catch (error) {
    // noop
  }
}
