import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers';
import { Event, EventBase } from '#events/index.js';
export interface BundleCommitted extends EventBase {
    bundleId: string;
    bundleRoot: string;
    bundleFees: BigNumber;
    toChainId: string;
    commitTime: number;
}
export declare class BundleCommittedEventFetcher extends Event<BundleCommitted> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): BundleCommitted;
}
//# sourceMappingURL=BundleCommitted.d.ts.map