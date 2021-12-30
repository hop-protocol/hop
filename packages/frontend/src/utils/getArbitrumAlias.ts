import { BigNumber } from 'ethers'

export const getArbitrumAlias = (address: string): string => {
  const addressBn: BigNumber = BigNumber.from(address)
  const aliasMask: string = '0x1111000000000000000000000000000000001111'
  const aliasMaskBn: BigNumber = BigNumber.from(aliasMask)
  const boundary: BigNumber = BigNumber.from('0x10000000000000000000000000000000000000000')
  return addressBn.add(aliasMaskBn).mod(boundary).toHexString()
}
