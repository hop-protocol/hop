import { utils } from 'ethers'
import type { BigNumber } from 'ethers'

const getTransferId = (chainId: number, recipient: string, amount: BigNumber, transferNonce: string, bonderFee: BigNumber, amountOutMin: BigNumber, deadline: BigNumber) => {
  const types = ['uint256', 'address', 'uint256', 'bytes32', 'uint256', 'uint256', 'uint256']
  const values = [chainId, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline]
  return utils.keccak256(utils.defaultAbiCoder.encode(types, values))
}

export default getTransferId
