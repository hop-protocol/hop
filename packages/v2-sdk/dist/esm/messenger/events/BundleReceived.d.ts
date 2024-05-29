import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers';
import { Event, EventBase } from '#events/index.js';
export interface BundleReceived extends EventBase {
    bundleId: string;
    bundleRoot: string;
    bundleFees: BigNumber;
    fromChainId: string;
    toChainId: string;
    relayWindowStart: number;
    relayer: string;
}
export declare class BundleReceivedEventFetcher extends Event<BundleReceived> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): BundleReceived;
}
//# sourceMappingURL=BundleReceived.d.ts.map