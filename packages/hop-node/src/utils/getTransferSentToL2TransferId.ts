import { BigNumber } from 'ethers'
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils.js'

const getTransferSentToL2TransferId = (
  chainId: number,
  recipient: string,
  amount: BigNumber,
  amountOutMin: BigNumber,
  deadline: BigNumber,
  relayer: string,
  relayerFee: BigNumber,
  transferSentTxHash: string,
  logIndex: number
) => {
  // transferSentTxHash and logIndex are required for uniqueness since there is no nonce from L1 to L2
  const types = ['uint256', 'address', 'uint256', 'uint256', 'uint256', 'address', 'uint256', 'bytes32', 'uint256']
  const values = [chainId, recipient, amount, amountOutMin, deadline, relayer, relayerFee, transferSentTxHash, logIndex]
  return keccak256(defaultAbiCoder.encode(types, values))
}

export default getTransferSentToL2TransferId
