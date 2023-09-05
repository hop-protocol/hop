import { BigNumber } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'

export const getEncodedBlockHashValidatorData = (
  blockhashValidatorAddress: string,
  blockHash: string,
  blockNumber: number
): string => {
  return defaultAbiCoder.encode(
    ['address', 'bytes32', 'uint40'],
    [blockhashValidatorAddress, blockHash, blockNumber]
  )
}

export default getEncodedBlockHashValidatorData
