import { ethers } from 'hardhat'

export const getL2BridgeId = (l2Name: string) => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(l2Name))
}
