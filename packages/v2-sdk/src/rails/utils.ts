import { type BigNumberish, BigNumber, constants, utils } from 'ethers'
import type { HopStruct, RailsPath } from './types.js'
import type { Chain, Token } from './types.js'

export function getHop(
  fromChainId: Chain,
  fromToken: Token,
  toChainId: Chain,
  toToken: Token,
  amount: BigNumberish
): HopStruct {
  if (!fromChainId || !toChainId || !fromToken || !toToken) {
    throw new Error('Invalid parameters for getHop')
  }

  return {
    pathId: getPathId({
      chainId: fromChainId.chainId,
      token: fromToken.address,
      counterpartChainId: toChainId.chainId,
      counterpartToken: toToken.address,
      initialReserve: BigNumber.from(amount)
    }),
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

export function getPathId(path: RailsPath): string {
  const { chainId, token: token0, counterpartChainId, counterpartToken: token1, initialReserve } = path

  const chainId0 = Number(chainId.toString())
  const chainId1 = Number(counterpartChainId.toString())

  const isAscending = chainId0 < chainId1

  const chainIdA = isAscending ? chainId0 : chainId1
  const chainIdB = isAscending ? chainId1 : chainId0
  const tokenA = isAscending ? token0 : token1
  const tokenB = isAscending ? token1 : token0

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
  to: string,
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
