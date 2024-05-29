import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers';
import { Event, EventBase } from '#events/index.js';
export interface FeesSentToHub extends EventBase {
    amount: BigNumber;
}
export declare class FeesSentToHubEventFetcher extends Event<FeesSentToHub> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): FeesSentToHub;
}
//# sourceMappingURL=FeesSentToHub.d.ts.map