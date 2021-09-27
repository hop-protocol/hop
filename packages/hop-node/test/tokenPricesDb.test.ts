import TokenPricesDb, { varianceSeconds } from 'src/db/TokenPricesDb'
import wait from 'src/utils/wait'

describe('tokenPricesDb', () => {
  it('should get item nearest to specified datetime', async () => {
    const db = new TokenPricesDb(`tokenPrices-test-${Date.now()}`)
    const timestamp = Math.floor(Date.now() / 1000)
    await db.addTokenPrice({
      token: 'MATIC',
      price: 1.22,
      timestamp
    })
    await db.addTokenPrice({
      token: 'MATIC',
      price: 1.30,
      timestamp: timestamp + 1
    })

    await wait(2 * 1000)
    const now = Math.floor(Date.now() / 1000)
    let item = await db.getNearest('MATIC', now)
    expect(item).toBeTruthy()
    expect(item.price).toBe(1.30)

    item = await db.getNearest('MATIC', now - 3)
    expect(item).toBeTruthy()
    expect(item.price).toBe(1.22)

    item = await db.getNearest('MATIC', timestamp - varianceSeconds)
    expect(item).toBeTruthy()
    expect(item.price).toBe(1.22)

    item = await db.getNearest('MATIC', timestamp - varianceSeconds - 1)
    expect(item).toBeFalsy()
  })
})
