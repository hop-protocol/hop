import { Event, EventBase } from '#events/index.js';
import { Event as EthersEvent, EventFilter } from 'ethers';
export interface BundleForwarded extends EventBase {
    bundleId: string;
    bundleRoot: string;
    fromChainId: string;
    toChainId: string;
}
export declare class BundleForwardedEventFetcher extends Event<BundleForwarded> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): BundleForwarded;
}
//# sourceMappingURL=BundleForwarded.d.ts.map