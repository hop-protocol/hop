import { Interface, solidityPack } from 'ethers/lib/utils'

const getEncodedValidationData = (
  validatorAddress: string,
  blockHash: string,
  blockNumber: number
): string => {
  // Get validation calldata
  const abi = ['function validateBlockHash(bytes32,uint256) external view']
  const iface = new Interface(abi)
  const data = iface.encodeFunctionData(
    'validateBlockHash', [blockHash, blockNumber]
  )

  // Format into hidden calldata
  return solidityPack(
    ['address', 'bytes'],
    [validatorAddress, data]
  )
}

export default getEncodedValidationData
