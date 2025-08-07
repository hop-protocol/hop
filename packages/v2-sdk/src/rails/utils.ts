import { type BigNumberish, BigNumber, constants, utils } from 'ethers'
import type { HopStruct } from './contracts/index.js'
import {
  type Addressish,
  type Chainish,
  type Tokenish,
  getChain,
  getToken
} from '#models/index.js'

export function getHop(
  fromChainId: Chainish,
  fromToken: Tokenish,
  toChainId: Chainish,
  toToken: Tokenish,
  amount: BigNumberish
): HopStruct {
  const pathId = getPathId(
    fromChainId,
    fromToken,
    toChainId,
    toToken,
    BigNumber.from(amount)
  )

  return {
    pathId,
    maxBonderFee: BigNumber.from(0),
    maxTotalSent: BigNumber.from(0),
    attestedClaimId: constants.HashZero,
    updater: constants.AddressZero
  }
}

export function getNextHopsHash(nextHops: HopStruct[]): string {
  if (!nextHops || !Array.isArray(nextHops)) {
    throw new Error('Invalid nextHops')
  }

  let nextHopsHash = constants.HashZero

  if (nextHops.length === 0) {
    return nextHopsHash
  }

  // Loop through the hops in reverse order (excluding the first one, like Solidity)
  for (let i = nextHops.length - 1; i > 0; i--) {
    const hop = nextHops[i]

    // Encode the current hop and combine it with the previous hash
    const encodedHop = utils.defaultAbiCoder.encode(
      ['bytes32', 'uint256', 'uint256', 'bytes32', 'address'],
      [hop.pathId, hop.maxBonderFee, hop.maxTotalSent, hop.attestedClaimId, hop.updater]
    )

    nextHopsHash = utils.keccak256(utils.defaultAbiCoder.encode(['bytes', 'bytes32'], [encodedHop, nextHopsHash]))
  }

  return nextHopsHash
}

export function getPathId(fromChain: Chainish, fromToken: Tokenish, toChain: Chainish, toToken: Tokenish, initialReserve: BigNumberish): string {
  const fromChainId = getChain(fromChain).chainId
  const toChainId = getChain(toChain).chainId
  const fromTokenAddress = getToken(fromToken).addresses[fromChainId]
  const toTokenAddress = getToken(toToken).addresses[toChainId]

  const chainId0 = Number(fromChainId)
  const chainId1 = Number(toChainId)

  const isAscending = chainId0 < chainId1

  const chainIdA = isAscending ? chainId0 : chainId1
  const chainIdB = isAscending ? chainId1 : chainId0
  const tokenA = isAscending ? fromTokenAddress : toTokenAddress
  const tokenB = isAscending ? toTokenAddress : fromTokenAddress

  return utils.keccak256(
    utils.solidityPack(['uint256', 'address', 'uint256', 'address', 'uint256'], [
      chainIdA,
      tokenA,
      chainIdB,
      tokenB,
      initialReserve
    ])
  )
}

export function getTransferDataHash(
  to: Addressish,
  amount: BigNumberish,
  maxBonderFee: BigNumberish,
  attestedClaimId: string,
  sourcePool: BigNumberish,
  sourceTotalFraudulent: BigNumberish,
  hops: HopStruct[]
): string {
  return utils.keccak256(
    utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint256', 'bytes32', 'uint256', 'bytes32'],
      [
        to,
        amount,
        maxBonderFee,
        attestedClaimId,
        sourcePool,
        sourceTotalFraudulent,
        getNextHopsHash(hops)
      ]
    )
  )
}

export function getTransferId(
  previousTransferId: string,
  transferDataHash: string
): string {
  if (previousTransferId.length !== 66 || transferDataHash.length !== 66) {
    throw new Error("Input should be a 32-byte hex string (bytes32)")
  }

  const transferId = utils.keccak256(
    utils.defaultAbiCoder.encode(
      ['bytes32', 'bytes32'],
      [previousTransferId, transferDataHash]
    )
  )

  return transferId
}
