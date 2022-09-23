import CoinGecko from 'src/priceFeed/CoinGecko'

describe('coinGecko', () => {
  const coinGecko = new CoinGecko()
  it('ETH price', async () => {
    const ethPrice = await coinGecko.getPriceByTokenSymbol('ETH')
    expect(ethPrice).toBeGreaterThan(1000)
    expect(ethPrice).toBeLessThan(10000)
  }, 10 * 1000)
  it('DAI price', async () => {
    const daiPrice = await coinGecko.getPriceByTokenSymbol('DAI')
    expect(daiPrice).toBeGreaterThan(0)
    expect(daiPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('USDC price', async () => {
    const usdcPrice = await coinGecko.getPriceByTokenSymbol('USDC')
    expect(usdcPrice).toBeGreaterThan(0)
    expect(usdcPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('USDT price', async () => {
    const usdtPrice = await coinGecko.getPriceByTokenSymbol('USDT')
    expect(usdtPrice).toBeGreaterThan(0)
    expect(usdtPrice).toBeLessThan(2)
  }, 10 * 1000)
  it('MATIC price', async () => {
    const maticPrice = await coinGecko.getPriceByTokenSymbol('MATIC')
    expect(maticPrice).toBeGreaterThan(0)
    expect(maticPrice).toBeLessThan(3)
  }, 10 * 1000)
  it('HOP price', async () => {
    const hopPrice = await coinGecko.getPriceByTokenSymbol('HOP')
    expect(hopPrice).toBeGreaterThan(0)
    expect(hopPrice).toBeLessThan(1000)
  }, 10 * 1000)
})
