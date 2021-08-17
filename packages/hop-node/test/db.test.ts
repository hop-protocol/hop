import TransfersDb from 'src/db/TransfersDb'
require('dotenv').config()

describe('db', () => {
  test(
    'transfersDb',
    async () => {
      const db = new TransfersDb(`test-${Date.now()}`)
      const transferId = Date.now().toString()
      await db.update(transferId, { withdrawalBonded: true })
      expect(await db.getByTransferId(transferId)).toStrictEqual({
        foo: 'bar'
      })
      expect(await db.getTransferIds()).toStrictEqual([transferId])
    },
    5 * 1000
  )
})
