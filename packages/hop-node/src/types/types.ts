import { BigNumber, Event as EthersEvent } from 'ethers'

export type Event = EthersEvent & {
  blockNumber?: number
}

export type ProxyTransaction = {
  to: string
  data: string
  value: BigNumber
}
