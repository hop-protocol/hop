import { PriceFeed } from '../src/priceFeed.js'

describe('PriceFeed', () => {
  it('should return ETH price', async () => {
    const priceFeed = new PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('ETH')
    console.log(price)
    expect(price).toBeGreaterThan(500)
    expect(price).toBeLessThan(10000)
  })
})
