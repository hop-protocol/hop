import { ethers, Event as EthersEvent, EventFilter } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { HubERC5164ConnectorFactory__factory } from '#contracts/factories/HubERC5164ConnectorFactory__factory.js'

// event from HubERC5164ConnectorFactory
export interface ConnectorDeployed extends EventBase {
  connector: string
  target: string
  counterpartChainId: string
  counterpartConnector: string
  counterpartTarget: string
}

export class ConnectorDeployedEventFetcher extends Event<ConnectorDeployed> {
  static override eventName = 'ConnectorDeployed'
  static override abi = HubERC5164ConnectorFactory__factory.abi
  static override factory = HubERC5164ConnectorFactory__factory

  override toTypedEvent (ethersEvent: EthersEvent): ConnectorDeployed {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const connector = parsed.args.connector.toString()
    const target = parsed.args.target.toString()
    const counterpartChainId = parsed.args.counterpartChainId.toString()
    const counterpartConnector = parsed.args.counterpartConnector.toString()
    const counterpartTarget = parsed.args.counterpartTarget.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      connector,
      target,
      counterpartChainId,
      counterpartConnector,
      counterpartTarget
    }
  }
}
