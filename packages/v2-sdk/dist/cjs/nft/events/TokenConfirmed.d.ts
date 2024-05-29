import { Event, EventBase } from '#events/index.js';
import { Event as EthersEvent, EventFilter } from 'ethers';
export interface TokenConfirmed extends EventBase {
    tokenId: string;
}
export declare class TokenConfirmedEventFetcher extends Event<TokenConfirmed> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): TokenConfirmed;
}
//# sourceMappingURL=TokenConfirmed.d.ts.map