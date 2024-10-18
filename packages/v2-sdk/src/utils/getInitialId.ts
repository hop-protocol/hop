import { ethers, BigNumberish } from 'ethers'

const RAILS_VERSION_STRING = "RAILS_VERSION_0.0"
const RAILS_VERSION = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(RAILS_VERSION_STRING))
const PREFIX = 'RAILS_INITIAL_CHECKPOINT'

// Function to compute the initial ID
export function getInitialId(chainId: BigNumberish, pathId: string): string {
  // Perform the equivalent of keccak256(abi.encodePacked(PREFIX, RAILS_VERSION, chainId, pathId))
  const encoded = ethers.utils.solidityPack(
      ["string", "string", "uint256", "bytes32"],
      [PREFIX, RAILS_VERSION, chainId, pathId]
  )

  const hash = ethers.utils.keccak256(encoded)
  return hash
}
