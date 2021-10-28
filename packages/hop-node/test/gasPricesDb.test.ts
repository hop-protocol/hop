import GasPricesDb, { varianceSeconds } from 'src/db/GasPricesDb'
import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
import { expectDefined } from './helpers'

describe('gasPricesDb', () => {
  it('should get item nearest to specified datetime', async () => {
    const db = new GasPricesDb(`gasPrices-test-${Date.now()}`)
    const timestamp = Math.floor(Date.now() / 1000)
    await db.addGasPrice({
      chain: 'polygon',
      gasPrice: BigNumber.from('100'),
      timestamp
    })
    await db.addGasPrice({
      chain: 'polygon',
      gasPrice: BigNumber.from('200'),
      timestamp: timestamp + 1
    })

    await wait(2 * 1000)
    const now = Math.floor(Date.now() / 1000)
    let item = await db.getNearest('polygon', now)
    expectDefined(item)
    expect(item.gasPrice.toString()).toBe('200')

    item = await db.getNearest('polygon', now - 3)
    expectDefined(item)
    expect(item.gasPrice.toString()).toBe('100')

    item = await db.getNearest('polygon', timestamp - varianceSeconds)
    expectDefined(item)
    expect(item.gasPrice.toString()).toBe('100')

    item = await db.getNearest('polygon', timestamp - varianceSeconds - 1)
    expect(item).toBeUndefined()
  })
})
