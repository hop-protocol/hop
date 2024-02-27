import Coinbase from '#priceFeed/Coinbase.js'

describe('coinbase', () => {
  const coinbase = new Coinbase()
  it('ETH price', async () => {
    const ethPrice = await coinbase.getPriceByTokenSymbol('ETH')
    expect(ethPrice).toBeGreaterThan(1000)
    expect(ethPrice).toBeLessThan(10000)
  }, 10 * 1000)
  it('DAI price', async () => {
    const daiPrice = await coinbase.getPriceByTokenSymbol('DAI')
    expect(daiPrice).toBeGreaterThan(0)
    expect(daiPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('USDC price', async () => {
    const usdcPrice = await coinbase.getPriceByTokenSymbol('USDC')
    expect(usdcPrice).toBeGreaterThan(0)
    expect(usdcPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('USDT price', async () => {
    const usdtPrice = await coinbase.getPriceByTokenSymbol('USDT')
    expect(usdtPrice).toBeGreaterThan(0)
    expect(usdtPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('MATIC price', async () => {
    const maticPrice = await coinbase.getPriceByTokenSymbol('MATIC')
    expect(maticPrice).toBeGreaterThan(1)
    expect(maticPrice).toBeLessThan(3)
  }, 10 * 1000)
})
