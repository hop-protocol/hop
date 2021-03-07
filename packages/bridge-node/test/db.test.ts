require('dotenv').config()
import { promisify } from 'util'
import TransfersDb from 'src/db/TransfersDb'

describe('db', () => {
  test(
    'transfersDb',
    async () => {
      const db = new TransfersDb(`test-${Date.now()}`)
      const transferId = Date.now().toString()
      await db.update(transferId, { foo: 'bar' })
      expect(await db.getById(transferId)).toStrictEqual({ foo: 'bar' })
      expect(await db.getTransferHashes()).toStrictEqual([transferId])
    },
    5 * 1000
  )
})
