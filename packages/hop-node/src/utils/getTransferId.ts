import { BigNumber } from 'ethers'
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils.js'

const getTransferId = (chainId: number, recipient: string, amount: BigNumber, transferNonce: string, bonderFee: BigNumber, amountOutMin: BigNumber, deadline: BigNumber) => {
  const types = ['uint256', 'address', 'uint256', 'bytes32', 'uint256', 'uint256', 'uint256']
  const values = [chainId, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline]
  return keccak256(defaultAbiCoder.encode(types, values))
}

export default getTransferId
