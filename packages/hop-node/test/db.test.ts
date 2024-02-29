import TransfersDb from '#db/TransfersDb.js'
import dotenv from 'dotenv'

dotenv.config()

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
  it.only(
    'multiple updates',
    async () => {
      const max = 1000
      const ids = []
      const prefix = `test-${Date.now()}`
      const _namespace = `testns-${Date.now()}`
      const db = new TransfersDb(prefix, _namespace)
      const promises: Array<Promise<any>> = []
      for (let i = 0; i < max; i++) {
        const transferId = i.toString()
        ids.push(transferId)
        promises.push(db.update(transferId, { transferSentTimestamp: i }))
        promises.push(db.update(transferId, { bondWithdrawalAttemptedAt: i }))
      }
      await Promise.all(promises)
      const items = await db.getTransfers()
      expect(items.length).toStrictEqual(ids.length)

      for (let i = 1; i < items.length; i++) {
        const transfer = items[i]
        const ok = (transfer.transferSentTimestamp && transfer.bondWithdrawalAttemptedAt)
        expect(ok).toBeTruthy()
      }
    },
    60 * 1000
  )
})
