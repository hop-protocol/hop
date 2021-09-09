import { BigNumber, utils } from 'ethers'

const getTransferRootId = (rootHash: string, totalAmount: BigNumber) => {
  return utils.solidityKeccak256(
    ['bytes32', 'uint256'],
    [rootHash, totalAmount]
  )
}

export default getTransferRootId
