import getTransferId from './getTransferId.js'
import { defaultAbiCoder } from 'ethers/lib/utils.js'

const getTransferIdFromCalldata = (data: string, destinationChainId: number) => {
  if (!data || !destinationChainId) {
    return
  }
  let types: string[] | undefined
  if (data.startsWith('0x3d12a85a')) {
    data = data.replace('0x3d12a85a', '')
    types = ['address', 'uint256', 'bytes32', 'uint256', 'uint256', 'uint256']
  } else if (data.startsWith('0x23c452cd')) {
    data = data.replace('0x23c452cd', '')
    types = ['address', 'uint256', 'bytes32', 'uint256']
  }
  if (types === undefined) {
    return
  }
  data = data.replace('0x', '')
  const decoded = defaultAbiCoder.decode(types, `0x${data}`)
  if (!decoded) {
    return
  }
  return getTransferId(destinationChainId, decoded[0], decoded[1], decoded[2], decoded[3], decoded[4] || 0, decoded[5] || 0)
}

export default getTransferIdFromCalldata
