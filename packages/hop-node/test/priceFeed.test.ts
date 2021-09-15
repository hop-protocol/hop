import { PriceFeed } from 'src/priceFeed'

test('priceFeed', async () => {
  const priceFeed = new PriceFeed()
  const maticPrice = await priceFeed.getPriceByTokenSymbol('MATIC')
  expect(maticPrice).toBeGreaterThan(1)
  expect(maticPrice).toBeLessThan(3)
}, 10 * 1000)
