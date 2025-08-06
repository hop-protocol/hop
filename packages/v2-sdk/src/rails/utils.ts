import { type BigNumberish, BigNumber, constants, utils } from 'ethers'
import type { HopStruct } from './contracts/index.js'
import {
  type Addressish,
  type Chainish,
  type Tokenish,
  Chain,
  Token
} from '#models/index.js'

export function getHop(
  fromChainId: Chainish,
  fromToken: Tokenish,
  toChainId: Chainish,
  toToken: Tokenish,
  amount: BigNumberish
): HopStruct {
  // TODO: Correct validation??
  if (!fromChainId || !toChainId || !fromToken || !toToken) {
    throw new Error('Invalid parameters for getHop')
  }

  const pathId = getPathId(
    fromChainId,
    fromToken.toString(),
    toChainId,
    toToken.toString(),
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

// TODO: Maybe Path not path params?? oh wait maybe individuals
export function getPathId(fromChainId: Chainish, fromToken: Tokenish, toChainId: Chainish, toToken: Tokenish, initialReserve: BigNumberish): string {
  fromChainId = Chain.getChain(fromChainId).chainId
  toChainId = Chain.getChain(toChainId).chainId
  fromToken = Token.getToken(fromToken).toString()
  toToken = Token.getToken(toToken).toString()

  const chainId0 = Number(fromChainId.toString())
  const chainId1 = Number(toChainId.toString())

  const isAscending = chainId0 < chainId1

  const chainIdA = isAscending ? chainId0 : chainId1
  const chainIdB = isAscending ? chainId1 : chainId0
  const tokenA = isAscending ? fromToken : toToken
  const tokenB = isAscending ? toToken : fromToken

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
