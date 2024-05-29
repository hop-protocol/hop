import { Event, EventBase } from '#events/index.js';
import { Event as EthersEvent, EventFilter } from 'ethers';
export interface ConfirmationSent extends EventBase {
    tokenId: string;
    toChainId: string;
}
export declare class ConfirmationSentEventFetcher extends Event<ConfirmationSent> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): ConfirmationSent;
}
//# sourceMappingURL=ConfirmationSent.d.ts.map