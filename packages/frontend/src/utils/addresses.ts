import { utils } from 'ethers/'

export function isSameAddress(addr1?: string, addr2?: string) {
  if (!addr1 || !addr2 || !utils.isAddress(addr1) || !utils.isAddress(addr2)) {
    throw new Error(`invalid input: isSameAddress(${addr1}, ${addr2})`)
  }

  return utils.getAddress(addr1) === utils.getAddress(addr2)
}
