import { Event as EthersEvent, Transaction as EthersTransaction } from 'ethers'

export type Event = EthersEvent & {
  blockNumber?: number
}

export type Transaction = EthersTransaction & {
  blockNumber?: number
  transactionIndex?: number
}
