import Db, { getInstance } from './Db'
import { DateTime } from 'luxon'

export class Controller {
  db : Db = getInstance()

  async getTransfers () {
    const transfers = await this.db.getTransfers()
    const data = (transfers as any[]).map((x: any) => {
      x.bonded = !!x.bonded
      x.timestampRelative = DateTime.fromSeconds(x.timestamp).toRelative()
      x.receiveStatusUnknown = undefined
      x.preregenesis = false
      x.bondTimestampRelative = x.bondTimestamp ? DateTime.fromSeconds(x.bondTimestamp).toRelative() : ''
      return x
    })
    return data
  }
}
