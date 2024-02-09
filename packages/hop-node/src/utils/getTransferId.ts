
import { defaultAbiCoder, keccak256 } from 'ethers'

const getTransferId = (chainId: number, recipient: string, amount: bigint, transferNonce: string, bonderFee: bigint, amountOutMin: bigint, deadline: bigint) => {
  const types = ['uint256', 'address', 'uint256', 'bytes32', 'uint256', 'uint256', 'uint256']
  const values = [chainId, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline]
  return keccak256(defaultAbiCoder.encode(types, values))
}

export default getTransferId
