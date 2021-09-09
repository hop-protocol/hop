import TransfersDb from 'src/db/TransfersDb'
require('dotenv').config()

describe('db', () => {
  it(
    'transfersDb',
    async () => {
      const prefix = `test-${Date.now()}`
      const _namespace = `testns-${Date.now()}`
      const db = new TransfersDb(prefix, _namespace)
      const transferId = Date.now().toString()
      await db.update(transferId, { withdrawalBonded: true })
      expect(await db.getByTransferId(transferId)).toStrictEqual({
        transferId,
        withdrawalBonded: true
      })
      expect(await db.getTransferIds()).toStrictEqual([transferId])
    },
    5 * 1000
  )
  it(
    'multiple updates',
    async () => {
      const max = 1000
      const ids = []
      const prefix = `test-${Date.now()}`
      const _namespace = `testns-${Date.now()}`
      const db = new TransfersDb(prefix, _namespace)
      const promises : Promise<any>[] = []
      for (let i = 0; i < max; i++) {
        const transferId = i.toString()
        ids.push(transferId)
        promises.push(db.update(transferId, { withdrawalBonded: true }))
      }
      await Promise.all(promises)
      expect((await db.getTransferIds()).length).toStrictEqual(ids.length)
    },
    60 * 1000
  )
})
