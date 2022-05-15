import { providers, Signer } from 'ethers'
import { Delegate, TokenClaim } from 'src/pages/Claim/useClaim'
import { getClaimTokenContract } from 'src/utils/contracts'
import { getEntryProofIndex, ShardedMerkleTree } from './merkle'
import Address from 'src/models/Address'
import { claimTokenAddress, claimChainId } from './config'

const claimChains = {
  1: {
    id: 1,
    name: 'Ethereum Main'
  },
  31337: {
    id: 31337,
    name: 'Hardhat (31337)'
  },
  5: {
    id: 5,
    name: 'Goerli'
  }
}

export const correctClaimChain = claimChains[claimChainId]

export async function fetchClaim(provider: providers.Provider, address: Address) {
  const ensToken = await getClaimTokenContract(provider, claimTokenAddress)
  // const merkleRoot = await ensToken.merkleRoot()
  // console.log(`merkleRoot:`, merkleRoot)

  const shardedMerkleTree = await ShardedMerkleTree.fetchTree()
  const [entry, proof] = await shardedMerkleTree.getProof(address?.address)
  console.log(`entry, proof:`, entry, proof)

  const idx = getEntryProofIndex(address?.address, entry, proof)
  console.log(`idx:`, idx)

  if (typeof idx !== 'undefined') {
    const isClaimed = await ensToken.isClaimed(idx)
    console.log(`isClaimed(${idx}):`, isClaimed)

    return { entry, proof, address, isClaimed }
  }
}

export async function claimTokens(signer: Signer, claim: TokenClaim, delegate: Delegate) {
  const ensToken = await getClaimTokenContract(signer, claimTokenAddress)

  // Claim tokens tx
  return ensToken.claimTokens(claim.entry.balance, delegate.address!.address, claim.proof)
}

export async function getVotes(provider: any, delegateAddress: string) {
  const ensToken = await getClaimTokenContract(provider, claimTokenAddress)
  return ensToken.getVotes(delegateAddress)
}
