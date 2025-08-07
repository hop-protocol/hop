import { type GatewayConfig, gateways } from '#config/gateways/index.js'
import { type Chain, getChain } from './Chain.js'
import { type Network, getNetwork } from './Network.js'
import { type Address, getAddress } from './Address.js'

export type Gatewayish = Gateway | GatewayConfig | string

export class Gateway {
  readonly network: Network
  readonly chainId: Chain
  readonly startBlock: number
  readonly transporter: Address
  readonly dispatcher: Address
  readonly executor: Address
  readonly railsGateway: Address
  readonly stakingRegistry: Address
  readonly hopToken: Address

  constructor(config: GatewayConfig) {
    this.network = getNetwork(config.network)
    this.chainId = getChain(config.chainId)
    this.startBlock = config.startBlock
    this.transporter = getAddress(config.transporter)
    this.dispatcher = getAddress(config.dispatcher)
    this.executor = getAddress(config.executor)
    this.railsGateway = getAddress(config.railsGateway)
    this.stakingRegistry = getAddress(config.stakingRegistry)
    this.hopToken = getAddress(config.hopToken)
  }

  static getGateway(gateway: Gatewayish): Gateway {
    if (gateway instanceof Gateway) {
      return gateway
    }
    if (typeof gateway === 'string') {
      const gatewayConfig = gateways[gateway]
      if (!gatewayConfig) {
        throw new Error(`Gateway with chainId "${gateway}" not found`)
      }
      return new Gateway(gatewayConfig)
    }
    return new Gateway(gateway)
  }

  static getGateways(): Gateway[] {
    return Object.values(gateways).map(config => new Gateway(config))
  }
}

export const getGateway = Gateway.getGateway
export const getGateways = Gateway.getGateways
