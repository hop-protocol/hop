import { ChainSlug } from '@hop-protocol/sdk'
import { getProviderByNetworkName } from './getProvider.js'

const provider = getProviderByNetworkName(ChainSlug.Ethereum)

export async function getEnsName(address: string) {
  try {
    const ens = await provider.lookupAddress(address)
    return ens
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
  try {
    const address = await provider.resolveName(ensName)
    return address
  } catch (error) {
    // noop
  }
}
