import {
  type providers,
  type BaseContract,
  type utils,
  type ContractInterface,
  Contract
} from 'ethers'
import type { RPC } from '../types.js'

type RailsEvent<T extends BaseContract> = T['interface']['events']
type RailsEventFilter<T extends BaseContract> = T['filters']

export abstract class BaseRailsContract<RailsContract extends BaseContract> {
  protected readonly contract: RailsContract

  constructor(address: string, abi: ContractInterface, rpc: RPC) {
    this.contract = new Contract(address, abi, rpc) as RailsContract
  }

  get filters(): RailsEventFilter<RailsContract> {
    return this.contract.filters
  }

  get events(): RailsEvent<RailsContract> {
    return this.contract.interface.events
  }

  hasEvent(nameOrSignatureOrTopic: string): boolean {
    const event = this.contract.interface.getEvent(nameOrSignatureOrTopic)
    return !!event
  }

  parseLog(log: providers.Log): utils.LogDescription {
    return this.contract.interface.parseLog(log)
  }
}
