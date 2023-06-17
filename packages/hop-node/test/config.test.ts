import { Chain } from 'src/constants'
import { getFinalityTimeSeconds } from 'src/config'

describe.only('Config', () => {
  it('getFinalityTimeSeconds', () => {
    let finalityTimeSeconds = getFinalityTimeSeconds(Chain.Polygon)
    expect(finalityTimeSeconds).toBe(1024)
    finalityTimeSeconds = getFinalityTimeSeconds(Chain.Gnosis)
    expect(finalityTimeSeconds).toBe(60)
    finalityTimeSeconds = getFinalityTimeSeconds(Chain.Optimism)
    expect(finalityTimeSeconds).toBe(1)
    finalityTimeSeconds = getFinalityTimeSeconds(Chain.Arbitrum)
    expect(finalityTimeSeconds).toBe(20)
  })
})
