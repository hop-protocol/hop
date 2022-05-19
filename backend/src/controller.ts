import Db, { getInstance } from './Db'
import { DateTime } from 'luxon'

export class Controller {
  db : Db = getInstance()

  async getTransfers (params: any) {
    let page = Number(params.page || 0)
    let perPage = Number(params.perPage || 100)
    const sourceChainSlug = params.sourceChainSlug
    const destinationChainSlug = params.destinationChainSlug
    const token = params.token
    let bonded = params.bonded
    const bonderAddress = params.bonderAddress
    const accountAddress = params.accountAddress
    const amountFormatted = Number(params.amountFormatted)
    const amountFormattedCmp = params.amountFormattedCmp
    const amountUsd = Number(params.amountUsd)
    const amountUsdCmp = params.amountUsdCmp
    const transferId = params.transferId
    const date = params.date

    if (bonded === 'pending') {
      bonded = false
    }
    if (bonded === 'bonded') {
      bonded = true
    }

    if (page <= 0) {
      page = 0
    }

    if (perPage <= 0) {
      perPage = 0
    }

    if (perPage > 10000) {
      perPage = 10000
    }

    let endTimestamp :any
    if (date) {
      endTimestamp = DateTime.fromFormat(date, 'yyyy-MM-dd').endOf('day').toUTC().toSeconds()
    }

    const transfers = await this.db.getTransfers({
      page,
      perPage,
      sourceChainSlug,
      destinationChainSlug,
      token,
      bonded,
      bonderAddress,
      accountAddress,
      amountFormatted,
      amountFormattedCmp,
      amountUsd,
      amountUsdCmp,
      transferId,
      endTimestamp
    })
    const data = (transfers as any[]).map((x: any, i: number) => {
      x.sourceChainId = Number(x.sourceChainId)
      x.destinationChainId = Number(x.destinationChainId)
      x.amountFormatted = Number(x.amountFormatted)
      x.amountUsd = Number(x.amountUsd)
      x.deadline = x.deadline ? Number(x.deadline) : null
      x.bonderFeeFormatted = x.bonderFeeFormatted ? Number(x.bonderFeeFormatted) : null
      x.bonderFeeUsd = x.bonderFeeUsd ? Number(x.bonderFeeUsd) : null
      x.bondTimestamp = x.bondTimestamp ? Number(x.bondTimestamp) : null
      x.bondWithinTimestamp = x.bondWithinTimestamp ? Number(x.bondWithinTimestamp) : null
      x.tokenPriceUsd = x.tokenPriceUsd ? Number(x.tokenPriceUsd) : null
      x.timestamp = x.timestamp ? Number(x.timestamp) : null

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
