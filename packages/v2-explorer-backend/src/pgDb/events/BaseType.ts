export type EventContext = {
  chainId: string
  transactionHash: string
  transactionIndex: number
  logIndex: number
  blockNumber: number
  blockTimestamp: number
  from: string
  to: string
  value: string
  nonce: number
  gasLimit: number
  gasUsed: number
  gasPrice: string
  status: number
  data: string
}

export type BaseType = {
  txHash: string
  timestamp: number

  context: EventContext
}

export abstract class BaseDb {
  db: any
  constructor (db: any) {
    this.db = db
  }

  async createTable(): Promise<void> {
    throw new Error('Not implemented')
  }

  async createIndexes (): Promise<void> {
    throw new Error('Not implemented')
  }

  async getItems (opts: any): Promise<any[]> {
    throw new Error('Not implemented')
  }

  async upsertItem (item: any): Promise<void> {
    throw new Error('Not implemented')
  }
}

export abstract class EventDb extends BaseDb {
}
