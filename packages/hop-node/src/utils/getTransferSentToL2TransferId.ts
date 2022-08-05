import { BigNumber } from 'ethers'
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils'

const getTransferSentToL2TransferId = (chainId: number, recipient: string, amount: BigNumber, amountOutMin: BigNumber, deadline: BigNumber, relayer: string, relayerFee: BigNumber, transferSentTxHash: string) => {
  const types = ['uint256', 'address', 'uint256', 'uint256', 'uint256', 'address', 'uint256', 'bytes32']
  const values = [chainId, recipient, amount, amountOutMin, deadline, relayer, relayerFee, transferSentTxHash]
  return keccak256(defaultAbiCoder.encode(types, values))
}

export default getTransferSentToL2TransferId
