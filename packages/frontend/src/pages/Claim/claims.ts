import { providers, Signer } from 'ethers'
import { Delegate, TokenClaim } from 'src/pages/Claim/useClaim'
import { getEnsToken } from 'src/utils/contracts'
import { getEntryProofIndex, ShardedMerkleTree } from './merkle'
import Address from 'src/models/Address'

export const correctClaimChain = {
  // id: '1',
  // name: 'Ethereum Main',
  // id: '31337',
  // name: 'Hardhat (31337)',
  id: '5',
  name: 'Goerli',
}

export async function fetchClaim(provider: providers.Web3Provider, address: Address) {
  const ensToken = await getEnsToken(provider)
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
  const ensToken = await getEnsToken(signer)

  // Claim tokens tx
  return ensToken.claimTokens(claim.entry.balance, delegate.address!.address, claim.proof)
}

export async function getVotes(provider: any, delegateAddress: string) {
  const ensToken = await getEnsToken(provider)
  return ensToken.getVotes(delegateAddress)
}
