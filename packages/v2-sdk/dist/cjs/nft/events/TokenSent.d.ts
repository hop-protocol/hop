import { Event, EventBase } from '#events/index.js';
import { Event as EthersEvent, EventFilter } from 'ethers';
export interface TokenSent extends EventBase {
    toChainId: string;
    to: string;
    tokenId: string;
    newTokenId: string;
}
export declare class TokenSentEventFetcher extends Event<TokenSent> {
    eventName: string;
    getFilter(): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): TokenSent;
}
//# sourceMappingURL=TokenSent.d.ts.map