import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils'

type DecodedValidationData = {
  blockHash: string
  blockNumber: number
}

const getDecodedValidationData = (data: string): DecodedValidationData => {
  if (!data.startsWith('0x')) {
    data = `0x${data}`
  }
  let types: string[] = ['bytes32', 'uint256']

  if (data.startsWith('0x3d12a85a')) {
    data = data.replace('0x3d12a85a', '')
  } else {
    throw new Error('invalid call data')
  }
  const decoded = defaultAbiCoder.decode(types, `0x${data}`)
  return {
    blockHash: decoded[0],
    blockNumber: decoded[1]
  }
}

export default getDecodedValidationData 
