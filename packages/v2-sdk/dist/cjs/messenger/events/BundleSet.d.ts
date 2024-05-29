import { Event, EventBase } from '#events/index.js';
import { Event as EthersEvent, EventFilter } from 'ethers';
export interface BundleSet extends EventBase {
    bundleId: string;
    bundleRoot: string;
    fromChainId: string;
}
export declare class BundleSetEventFetcher extends Event<BundleSet> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): BundleSet;
}
//# sourceMappingURL=BundleSet.d.ts.map