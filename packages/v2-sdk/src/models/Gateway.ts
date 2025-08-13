import { type GatewayConfig, allGateways } from '#config/gateways/index.js'
import { utils } from 'ethers'
import { getChain } from './Chain.js'
import { Path } from './Path.js'

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
  readonly railsPathImplementation: string

  constructor(config: GatewayConfig) {
    this.chainId = config.chainId
    this.startBlock = config.startBlock
    this.transporter = config.transporter
    this.dispatcher = config.dispatcher
    this.executor = config.executor
    this.railsGateway = config.railsGateway
    this.stakingRegistry = config.stakingRegistry
    this.hopToken = config.hopToken
    this.railsPathImplementation = config.railsPathImplementation
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

  get pathIds(): string[] {
    const chain = getChain(this.chainId)
    const pathIds: string[] = []
    for (const path of Path.getPaths()) {
      if (chain.eq(path.chain0.chainId) || chain.eq(path.chain1.chainId)) {
        pathIds.push(path.pathId)
      }
    }

    return pathIds
  }

  getPathContractAddress(pathId: string): string {
    // The deployer is the factory contract, not an EOA
    const deployer = this.railsGateway
    const initCode = this.#getMinimalProxyBytecode(this.railsPathImplementation)
    return utils.getCreate2Address(
      deployer,
      utils.solidityPack(['bytes32'], [pathId]),
      utils.keccak256(initCode),
    )
  }

  // Calculate the bytecode for a minimal proxy contract
  // https://blog.openzeppelin.com/deep-dive-into-the-minimal-proxy-contract
  // Can be verified by comparing against a debug_traceTransaction RPC call of the creation tx.
  #getMinimalProxyBytecode(implementationAddress: string): string {
    return (
      '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' +
      implementationAddress.slice(2).toLowerCase() +
      '5af43d82803e903d91602b57fd5bf3'
    )
  }
}

export const getGateway = Gateway.getGateway
export const getGateways = Gateway.getGateways
