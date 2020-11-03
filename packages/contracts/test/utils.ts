import { ethers } from 'hardhat'
import { L2_CHAIN_DATA } from './constants'

export const getL2BridgeId = (l2Name: string) => {
  return ethers.utils.keccak256(l2Name)
}

export const getL2ChainData = (l2Name: string) => {
  return L2_CHAIN_DATA[l2Name]
}
