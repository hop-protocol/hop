import { utils, BigNumberish } from 'ethers'

export function getComputedPathId(
  chainId0: BigNumberish,
  token0: string,
  chainId1: BigNumberish,
  token1: string,
  initialReserve: BigNumberish
): string {
  chainId0 = Number(chainId0.toString())
  chainId1 = Number(chainId1.toString())

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
