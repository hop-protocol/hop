import { ethers } from 'hardhat'
import { L2_NAMES } from './constants'
import { Contract } from 'ethers'

export const getL2CanonicalBridgeId = (l2Name: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(l2Name))
}

export const setBridgeWrapperDefaults = async (
  l2Name: string,
  l1BridgeWrapper: Contract,
  l1CanonicalBridgeAddress: string,
  l2BridgeAddress: string
) => {

  await l1BridgeWrapper.setL1CanonicalBridgeAddress(l1CanonicalBridgeAddress)
  await l1BridgeWrapper.setL2BridgeAddress(l2BridgeAddress)

  if (l2Name === L2_NAMES.ARBITRUM) {
    return setArbitrumBridgeWrapperDefaults(l1BridgeWrapper)
  } else if (l2Name === L2_NAMES.OPTIMISM) {
    return setOptimismBridgeWrapperDefaults(l1BridgeWrapper)
  }

}

export const setArbitrumBridgeWrapperDefaults = async (l1BridgeWrapper: Contract) => {
  const arbChain: string = '0xC34Fd04E698dB75f8381BFA7298e8Ae379bFDA71'
  const defaultGasLimit: number = 1000000
  const defaultGasPrice: number = 0
  const defaultCallValue: number = 0
  const defaultSubMessageType: string = '0x01'

  await l1BridgeWrapper.setArbChain(arbChain)
  await l1BridgeWrapper.setDefaultGasLimit(defaultGasLimit)
  await l1BridgeWrapper.setDefaultGasPrice(defaultGasPrice)
  await l1BridgeWrapper.setDefaultCallValue(defaultCallValue)
  await l1BridgeWrapper.setDefaultSubMessageType(defaultSubMessageType)
}

export const setOptimismBridgeWrapperDefaults = async (l1BridgeWrapper: Contract) => {
  const defaultGasLimit: number = 1000000

  await l1BridgeWrapper.setDefaultGasLimit(defaultGasLimit)
}
