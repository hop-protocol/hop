import { providers, Signer } from 'ethers'
import { Delegate, TokenClaim } from 'src/pages/Claim/useClaim'
import { getEnsToken } from './contracts'
import { getEntryProofIndex, ShardedMerkleTree } from './merkle'

export const correctClaimChain = {
  // id: '1',
  // name: 'Ethereum Main',
  // id: '31337',
  // name: 'Hardhat (31337)',
  id: '5',
  name: 'Goerli',
}

export async function fetchClaim(provider: providers.Web3Provider, address: string) {
  try {
    const ensToken = await getEnsToken(provider)
    // const merkleRoot = await ensToken.merkleRoot()
    // console.log(`merkleRoot:`, merkleRoot)

    const shardedMerkleTree = ShardedMerkleTree.fromFiles()
    const [entry, proof] = await shardedMerkleTree.getProof(address)
    console.log(`entry, proof:`, entry, proof)

    const idx = getEntryProofIndex(address, entry, proof)
    console.log(`idx:`, idx)

    if (typeof idx !== 'undefined') {
      const isClaimed = await ensToken.isClaimed(idx)
      console.log(`isClaimed(${idx}):`, isClaimed)

      return { entry, proof, address, isClaimed }
    }
  } catch (error: any) {
    console.log(`error:`, error)
    throw new Error(error.message)
  }
}

export async function claimTokens(signer: Signer, claim: TokenClaim, delegate: Delegate) {
  try {
    const ensToken = await getEnsToken(signer)

    // Claim tokens tx
    return ensToken.claimTokens(claim.entry.balance, delegate.address, claim.proof)
  } catch (error: any) {
    console.log(`error:`, error)
    // TODO: catch replaced txs
    throw new Error(error.message)
  }
}
