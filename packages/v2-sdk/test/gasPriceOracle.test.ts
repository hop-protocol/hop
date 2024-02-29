import { GasPriceOracle } from '../src/GasPriceOracle.js'

describe('GasPriceOracle Integration Tests', () => {
  let gasPriceOracle: GasPriceOracle

  beforeEach(() => {
    const url = 'https://v2-gas-price-oracle-goerli.hop.exchange'
    gasPriceOracle = new GasPriceOracle(url)
  })

  it('fetches gas fee data correctly', async () => {
    const chain = 'optimism'
    const timestamp = 1695439134
    const response = await gasPriceOracle.getGasFeeData(chain, timestamp)
    console.log('response', response)

    expect(response.status).toBe('ok')
    expect(response.data).toHaveProperty('expiration')
    expect(response.data).toHaveProperty('chainSlug', chain)
  })

  it('verifies gas price correctly', async () => {
    const chain = 'optimism'
    const timestamp = 1695439134
    const gasPrice = '50'
    const response = await gasPriceOracle.verifyGasPrice(chain, timestamp, gasPrice)
    console.log('response', response)

    expect(response.data.valid).toBe(true)
    expect(response.data.timestamp).toBeGreaterThanOrEqual(timestamp)
  })

  it('estimates gas cost', async () => {
    const chain = 'optimism'
    const timestamp = 1695439134
    const gasLimit = 200000
    const txData = '0x01de8001328252089400000000000000000000000000000000000000008080c0'
    const response = await gasPriceOracle.estimateGasCost(chain, timestamp, gasLimit, txData)
    console.log('response', response)

    expect(response.status).toBe('ok')
    expect(response.data).toHaveProperty('l1Fee')
  })

  it('verifies gas cost estimate correctly', async () => {
    const chain = 'optimism'
    const timestamp = 1695439134
    const gasLimit = 200000
    const txData = '0x01de8001328252089400000000000000000000000000000000000000008080c0'
    const targetGasCost = '0.000300000010026348'
    const response = await gasPriceOracle.verifyGasCostEstimate(chain, timestamp, gasLimit, txData, targetGasCost)
    console.log('response', response)

    expect(response.status).toBe('ok')
    expect(response.data).toHaveProperty('valid')
  })
})
