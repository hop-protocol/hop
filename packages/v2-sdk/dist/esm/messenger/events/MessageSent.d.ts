import { Event, EventBase } from '#events/index.js';
import { Event as EthersEvent, EventFilter } from 'ethers';
export interface MessageSent extends EventBase {
    messageId: string;
    from: string;
    toChainId: string;
    to: string;
    data: string;
}
export declare class MessageSentEventFetcher extends Event<MessageSent> {
    eventName: string;
    getFilter(): EventFilter;
    getMessageIdFilter(messageId: string): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): MessageSent;
}
//# sourceMappingURL=MessageSent.d.ts.map