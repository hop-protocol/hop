import { Event as EthersEvent, EventFilter } from 'ethers';
import { Event, EventBase } from '#events/index.js';
export interface ConnectorDeployed extends EventBase {
    connector: string;
    target: string;
    counterpartChainId: string;
    counterpartConnector: string;
    counterpartTarget: string;
}
export declare class ConnectorDeployedEventFetcher extends Event<ConnectorDeployed> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): ConnectorDeployed;
}
//# sourceMappingURL=ConnectorDeployed.d.ts.map