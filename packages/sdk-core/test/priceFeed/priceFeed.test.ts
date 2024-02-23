import {
  CoinCodexPriceFeed,
  CoinGeckoPriceFeed,
  CoinbasePriceFeed,
  CoinpaprikaPriceFeed,
  S3PriceFeed
} from '#priceFeed/index.js'

// skipped since it might trigger rate limits and cause test suite to fail
describe.skip('PriceFeed', () => {
  describe.skip('CoinGecko', () => {
    it('ETH', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('ETH')
      console.log('ETH', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(10000)
    })
    it('BTC', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('BTC')
      console.log('BTC', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(100000)
    })
    it('USDC', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('USDC')
      console.log('USDC', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('DAI', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('DAI')
      console.log('DAI', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('USDT', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('USDT')
      console.log('DAI', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('MATIC', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('MATIC')
      console.log('MATIC', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('HOP', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('HOP')
      console.log('HOP', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('SNX', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('SNX')
      console.log('SNX', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(5)
    })
    it('sUSD', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('sUSD')
      console.log('SUSD', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('rETH', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('rETH')
      console.log('rETH', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(10000)
    })
    it('GNO', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('GNO')
      console.log('GNO', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(10000)
    })
    it('TUSD', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('TUSD')
      console.log('TUSD', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('sETH', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('sETH')
      console.log('sETH', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(10000)
    })
    it('sBTC', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('sBTC')
      console.log('sBTC', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(100000)
    })
    it('FRAX', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('FRAX')
      console.log('FRAX', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('ARB', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('ARB')
      console.log('ARB', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(10)
    })
    it('OP', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('OP')
      console.log('OP', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(10)
    })
    it('MAGIC', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('MAGIC')
      console.log('MAGIC', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(10)
    })
    it('UNI', async () => {
      const priceFeed = new CoinGeckoPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('UNI')
      console.log('UNI', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(50)
    }, 60 * 1000)
  })

  describe.skip('Coinbase', () => {
    it('ETH', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('ETH')
      console.log('ETH', price)
      expect(price).toBeGreaterThan(0)
    })
    it('BTC', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('BTC')
      console.log('BTC', price)
      expect(price).toBeGreaterThan(0)
    })
    // USDC is unsupported
    it.skip('USDC', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('USDC')
      console.log('USDC', price)
      expect(price).toBeGreaterThan(0)
    })
    it('DAI', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('DAI')
      console.log('DAI', price)
      expect(price).toBeGreaterThan(0)
    })
    it('USDT', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('USDT')
      console.log('DAI', price)
      expect(price).toBeGreaterThan(0)
    })
    it('MATIC', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('MATIC')
      console.log('MATIC', price)
      expect(price).toBeGreaterThan(0)
    })
    // HOP is unsupported
    it.skip('HOP', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('HOP')
      console.log('HOP', price)
      expect(price).toBeGreaterThan(0)
    })
    it('SNX', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('SNX')
      console.log('SNX', price)
      expect(price).toBeGreaterThan(0)
    })
    // sUSD is unsupported
    it.skip('sUSD', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('sUSD')
      console.log('SUSD', price)
      expect(price).toBeGreaterThan(0)
    })
    // rETH is unsupported
    it.skip('rETH', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('rETH')
      console.log('rETH', price)
      expect(price).toBeGreaterThan(0)
    })
    it('GNO', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('GNO')
      console.log('GNO', price)
      expect(price).toBeGreaterThan(0)
    })
    // TUSD is unsupported
    it.skip('TUSD', async () => {
      const priceFeed = new CoinbasePriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('TUSD')
      console.log('TUSD', price)
      expect(price).toBeGreaterThan(0)
    })
  })

  describe('Coinpaprika', () => {
    it('ETH', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('ETH')
      console.log('ETH', price)
      expect(price).toBeGreaterThan(0)
    })
    it('BTC', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('BTC')
      console.log('BTC', price)
      expect(price).toBeGreaterThan(0)
    })
    it('USDC', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('USDC')
      console.log('USDC', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('DAI', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('DAI')
      console.log('DAI', price)
      expect(price).toBeGreaterThan(0)
    })
    it('USDT', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('USDT')
      console.log('DAI', price)
      expect(price).toBeGreaterThan(0)
    })
    it('MATIC', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('MATIC')
      console.log('MATIC', price)
      expect(price).toBeGreaterThan(0)
    })
    it('HOP', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('HOP')
      console.log('HOP', price)
      expect(price).toBeGreaterThan(0)
    })
    it('SNX', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('SNX')
      console.log('SNX', price)
      expect(price).toBeGreaterThan(0)
    })
    it('sUSD', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('sUSD')
      console.log('SUSD', price)
      expect(price).toBeGreaterThan(0)
    })
    it('rETH', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('rETH')
      console.log('rETH', price)
      expect(price).toBeGreaterThan(0)
    })
    it('GNO', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('GNO')
      console.log('GNO', price)
      expect(price).toBeGreaterThan(0)
    })
    it('TUSD', async () => {
      const priceFeed = new CoinpaprikaPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('TUSD')
      console.log('TUSD', price)
      expect(price).toBeGreaterThan(0)
    })
  })

  describe('CoinCodex', () => {
    it('ETH', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('ETH')
      console.log('ETH', price)
      expect(price).toBeGreaterThan(0)
    })
    it('BTC', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('BTC')
      console.log('BTC', price)
      expect(price).toBeGreaterThan(0)
    })
    it('USDC', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('USDC')
      console.log('USDC', price)
      expect(price).toBeGreaterThan(0)
      expect(price).toBeLessThan(2)
    })
    it('DAI', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('DAI')
      console.log('DAI', price)
      expect(price).toBeGreaterThan(0)
    })
    it('USDT', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('USDT')
      console.log('DAI', price)
      expect(price).toBeGreaterThan(0)
    })
    it('MATIC', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('MATIC')
      console.log('MATIC', price)
      expect(price).toBeGreaterThan(0)
    })
    it('HOP', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('HOP')
      console.log('HOP', price)
      expect(price).toBeGreaterThan(0)
    })
    it('SNX', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('SNX')
      console.log('SNX', price)
      expect(price).toBeGreaterThan(0)
    })
    it('sUSD', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('sUSD')
      console.log('SUSD', price)
      expect(price).toBeGreaterThan(0)
    })
    it('rETH', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('rETH')
      console.log('rETH', price)
      expect(price).toBeGreaterThan(0)
    })
    it('GNO', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('GNO')
      console.log('GNO', price)
      expect(price).toBeGreaterThan(0)
    })
    it('TUSD', async () => {
      const priceFeed = new CoinCodexPriceFeed()
      const price = await priceFeed.getPriceByTokenSymbol('TUSD')
      console.log('TUSD', price)
      expect(price).toBeGreaterThan(0)
    })
  })
})

describe.skip('PriceFeed - S3', () => {
  it('should return USDC price', async () => {
    const priceFeed = new S3PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('USDC')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(2)
  }, 60 * 1000)
  it('should return ETH price', async () => {
    const priceFeed = new S3PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('ETH')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(10000)
  }, 60 * 1000)
  it('should return DAI price', async () => {
    const priceFeed = new S3PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('DAI')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(2)
  }, 60 * 1000)
  it('should return USDT price', async () => {
    const priceFeed = new S3PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('USDT')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(2)
  }, 60 * 1000)
  it('should return MATIC price', async () => {
    const priceFeed = new CoinGeckoPriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('MATIC')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(10)
  }, 60 * 1000)
  it('should return HOP price', async () => {
    const priceFeed = new S3PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('HOP')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(50)
  }, 60 * 1000)
  it('should return SNX price', async () => {
    const priceFeed = new S3PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('SNX')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(50)
  }, 60 * 1000)
  it('should return sUSD price', async () => {
    const priceFeed = new S3PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('sUSD')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(2)
  }, 60 * 1000)
  it('should return rETH price', async () => {
    const priceFeed = new S3PriceFeed()
    const price = await priceFeed.getPriceByTokenSymbol('rETH')
    console.log(price)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(10000)
  })
})
