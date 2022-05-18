import Db, { getInstance } from './Db'
import { DateTime } from 'luxon'

export class Controller {
  db : Db = getInstance()

  async getTransfers (params: any) {
    let page = Number(params.page || 0)
    let perPage = Number(params.perPage || 100)

    if (page <= 0) {
      page = 0
    }

    if (perPage <= 0) {
      perPage = 0
    }

    if (perPage > 10000) {
      perPage = 10000
    }

    const transfers = await this.db.getTransfers({
      page,
      perPage
    })
    const data = (transfers as any[]).map((x: any, i: number) => {
      x.i = i
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
