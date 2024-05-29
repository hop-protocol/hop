import { Event, EventBase } from '#events/index.js';
import { Event as EthersEvent, EventFilter } from 'ethers';
export interface MessageExecuted extends EventBase {
    messageId: string;
    fromChainId: string;
}
export declare class MessageExecutedEventFetcher extends Event<MessageExecuted> {
    eventName: string;
    getFilter(): EventFilter;
    getMessageIdFilter(messageId: string): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): MessageExecuted;
}
//# sourceMappingURL=MessageExecuted.d.ts.map