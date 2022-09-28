import { PriceFeed } from 'src/priceFeed'

describe('priceFeed', () => {
  const priceFeed = new PriceFeed()
  it('ETH price', async () => {
    const ethPrice = await priceFeed.getPriceByTokenSymbol('ETH')
    expect(ethPrice).toBeGreaterThan(1000)
    expect(ethPrice).toBeLessThan(10000)
  }, 10 * 1000)
  it('DAI price', async () => {
    const daiPrice = await priceFeed.getPriceByTokenSymbol('DAI')
    expect(daiPrice).toBeGreaterThan(0)
    expect(daiPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('XDAI price', async () => {
    const daiPrice = await priceFeed.getPriceByTokenSymbol('XDAI')
    expect(daiPrice).toBeGreaterThan(0)
    expect(daiPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('USDC price', async () => {
    const usdcPrice = await priceFeed.getPriceByTokenSymbol('USDC')
    expect(usdcPrice).toBeGreaterThan(0)
    expect(usdcPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('USDT price', async () => {
    const usdtPrice = await priceFeed.getPriceByTokenSymbol('USDT')
    expect(usdtPrice).toBeGreaterThan(0)
    expect(usdtPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('MATIC price', async () => {
    const maticPrice = await priceFeed.getPriceByTokenSymbol('MATIC')
    expect(maticPrice).toBeGreaterThan(1)
    expect(maticPrice).toBeLessThan(3)
  }, 10 * 1000)
  it('SNX price', async () => {
    const snxPrice = await priceFeed.getPriceByTokenSymbol('SNX')
    expect(snxPrice).toBeGreaterThan(0)
    expect(snxPrice).toBeLessThan(5)
  }, 10 * 1000)
})
