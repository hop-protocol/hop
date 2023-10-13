import { defaultAbiCoder } from 'ethers/lib/utils'

type DecodedValidationData = {
  blockHash: string
  blockNumber: number
}

// TODO: Better decoding
const getDecodedValidationData = (data: string): DecodedValidationData => {
  if (!data.startsWith('0x')) {
    data = `0x${data}`
  }

  if (data.length !== 178) {
    throw new Error('invalid call data length')
  }

  // Remove the leading address
  data = data.substring(42)
  if (data.startsWith('8003405b')) {
    data = data.replace('8003405b', '')
  } else {
    throw new Error('invalid call data')
  }

  const types: string[] = ['bytes32', 'uint256']
  const decoded = defaultAbiCoder.decode(types, `0x${data}`)
  return {
    blockHash: decoded[0],
    blockNumber: decoded[1]
  }
}

export default getDecodedValidationData
