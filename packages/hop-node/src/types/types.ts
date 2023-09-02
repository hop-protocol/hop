import {
  BigNumber,
  Event as EthersEvent,
  Transaction as EthersTransaction
} from 'ethers'

export type Event = EthersEvent & {
  blockNumber?: number
}

export type Transaction = EthersTransaction & {
  blockNumber?: number
  transactionIndex?: number
}

export type ProxyTransaction = {
  to: string
  data: string
  value: BigNumber
}
