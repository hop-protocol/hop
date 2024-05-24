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
  override eventName = 'ConnectorDeployed'

  override getFilter (): EventFilter {
    const contract = HubERC5164ConnectorFactory__factory.connect(this.address, this.provider)
    const filter = contract.filters.ConnectorDeployed()
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ConnectorDeployed {
    const iface = new ethers.utils.Interface(HubERC5164ConnectorFactory__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const connector = decoded.args.connector.toString()
    const target = decoded.args.target.toString()
    const counterpartChainId = decoded.args.counterpartChainId.toString()
    const counterpartConnector = decoded.args.counterpartConnector.toString()
    const counterpartTarget = decoded.args.counterpartTarget.toString()

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
