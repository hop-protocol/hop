import { getAddress, isAddress } from 'ethers/lib/utils'

export function isSameAddress(addr1?: string, addr2?: string) {
  if (!addr1 || !addr2 || !isAddress(addr1) || !isAddress(addr2)) {
    throw new Error(`invalid input: isSameAddress(${addr1}, ${addr2})`)
  }

  return getAddress(addr1) === getAddress(addr2)
}
