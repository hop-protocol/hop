import { type GatewayConfig, allGateways } from '#config/gateways/index.js'

export type Gatewayish = Gateway | GatewayConfig | string

export class Gateway {
  readonly chainId: string
  readonly startBlock: number
  readonly transporter: string
  readonly dispatcher: string
  readonly executor: string
  readonly railsGateway: string
  readonly stakingRegistry: string
  readonly hopToken: string

  constructor(config: GatewayConfig) {
    this.chainId = config.chainId
    this.startBlock = config.startBlock
    this.transporter = config.transporter
    this.dispatcher = config.dispatcher
    this.executor = config.executor
    this.railsGateway = config.railsGateway
    this.stakingRegistry = config.stakingRegistry
    this.hopToken = config.hopToken
  }

  static getGateway(gateway: Gatewayish): Gateway {
    if (gateway instanceof Gateway) {
      return gateway
    }
    if (typeof gateway === 'string') {
      const gatewayConfig = allGateways[gateway]
      if (!gatewayConfig) {
        throw new Error(`Gateway with chainId "${gateway}" not found`)
      }
      return new Gateway(gatewayConfig)
    }
    return new Gateway(gateway)
  }

  static getGateways(): Gateway[] {
    return Object.values(allGateways).map(config => new Gateway(config))
  }
}

export const getGateway = Gateway.getGateway
export const getGateways = Gateway.getGateways
