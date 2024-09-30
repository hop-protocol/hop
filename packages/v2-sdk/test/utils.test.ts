import { getComputedPathId } from '#utils/index.js'
import { ethers } from 'ethers'

describe('getComputedPathId', () => {
  it('should return the correct keccak256 hash', () => {
    const chainId0 = 1
    const chainId1 = 2
    const token0 = ethers.constants.AddressZero
    const token1 = ethers.constants.AddressZero

    const result = getComputedPathId(chainId0, token0, chainId1, token1)

    const expected = ethers.utils.keccak256(
      ethers.utils.solidityPack(['uint256', 'address', 'uint256', 'address'], [
        chainId0,
        token0,
        chainId1,
        token1
      ])
    )

    expect(result).toBe(expected)
  })

  it('should handle reversed chainIds', () => {
    const chainId0 = 2
    const chainId1 = 1
    const token0 = ethers.constants.AddressZero
    const token1 = ethers.constants.AddressZero

    const result = getComputedPathId(chainId0, token0, chainId1, token1)

    const expected = ethers.utils.keccak256(
      ethers.utils.solidityPack(['uint256', 'address', 'uint256', 'address'], [
        chainId1,
        token0,
        chainId0,
        token1
      ])
    )

    expect(result).toBe(expected)
  })

  it('should compute a known path id', () => {
    const chainId0 = '11155111'
    const chainId1 = '11155420'
    const token0 = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const token1 = '0xaca72c8d5360dc237001cd963566f411732980b0'

    const result = getComputedPathId(chainId0, token0, chainId1, token1)
    const expected = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'

    expect(result).toBe(expected)
  })


  // TODO: generateZeroBytes32
})
