import * as ethers from 'ethers'

export const getL2MessengerId = (L2Name: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(L2Name))
}
