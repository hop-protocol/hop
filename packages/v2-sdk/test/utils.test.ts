import { getPathId, getTransferId } from '#utils/index.js'
import { ethers } from 'ethers'

describe('getTransferId', () => {
  it('should get computed transfer id', () => {
    const previousTransferId = '0xc64dab8cc70c0ed2984629666162f66c2d9ba4da013363f3c984394ea1b70ab0'
    const transferDataHash = '0x44e7bea20009f633938896ec4dd9e6982576b0e35d34ff88d2096bdda2082efa'
    const result = getTransferId(previousTransferId, transferDataHash)
    console.log(result)
    expect(result).toBe('0x55d71bbb1e0f5f297dabb748558edc0eb79c6e9fa41346f34121fc31cbcb1203')
  })
})

describe.skip('getPathId', () => {
  it('should return the correct keccak256 hash', () => {
    const chainId0 = 1
    const chainId1 = 2
    const token0 = ethers.constants.AddressZero
    const token1 = ethers.constants.AddressZero
    const initialReserve = 'TODO'

    const result = getPathId(chainId0, token0, chainId1, token1, initialReserve)

    const expected = ethers.utils.keccak256(
      ethers.utils.solidityPack(['uint256', 'address', 'uint256', 'address', 'uint256'], [
        chainId0,
        token0,
        chainId1,
        token1,
        initialReserve
      ])
    )

    expect(result).toBe(expected)
  })

  it('should handle reversed chainIds', () => {
    const chainId0 = 2
    const chainId1 = 1
    const token0 = ethers.constants.AddressZero
    const token1 = ethers.constants.AddressZero
    const initialReserve = 'TODO'

    const result = getPathId(chainId0, token0, chainId1, token1, initialReserve)

    const expected = ethers.utils.keccak256(
      ethers.utils.solidityPack(['uint256', 'address', 'uint256', 'address', 'uint256'], [
        chainId1,
        token0,
        chainId0,
        token1,
        initialReserve
      ])
    )

    expect(result).toBe(expected)
  })

  it('should compute a known path id', () => {
    const chainId0 = '11155111'
    const chainId1 = '11155420'
    const token0 = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const token1 = '0xaca72c8d5360dc237001cd963566f411732980b0'
    const initialReserve = 'TODO'

    const result = getPathId(chainId0, token0, chainId1, token1, initialReserve)
    const expected = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'

    expect(result).toBe(expected)
  })


  // TODO: generateZeroBytes32
})
