import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
import { getGasPricesDb } from 'src/db'

describe('gasPricesDb', () => {
  it('should get item nearest to specified datetime', async () => {
    const db = getGasPricesDb()
    const timestamp = Math.floor(Date.now() / 1000)
    await db.addGasPrice({
      chain: 'polygon',
      gasPrice: BigNumber.from('200'),
      timestamp: timestamp + 1
    })
    await db.addGasPrice({
      chain: 'polygon',
      gasPrice: BigNumber.from('100'),
      timestamp
    })

    await wait(2 * 1000)
    const now = Math.floor(Date.now() / 1000)
    let item = await db.getNearest('polygon', now)
    expect(item).toBeTruthy()
    expect(item.gasPrice.toString()).toBe('200')

    const oneHourSeconds = (60 * 60)
    item = await db.getNearest('polygon', now + oneHourSeconds)
    expect(item).toBeFalsy()
  })
})
