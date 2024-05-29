import { Event, EventBase } from '#events/index.js';
import { Event as EthersEvent, EventFilter } from 'ethers';
export interface MessageBundled extends EventBase {
    bundleId: string;
    treeIndex: number;
    messageId: string;
}
export declare class MessageBundledEventFetcher extends Event<MessageBundled> {
    eventName: string;
    getFilter(): EventFilter;
    getBundleIdFilter(bundleId: string): EventFilter;
    getMessageIdFilter(messageId: string): EventFilter;
    toTypedEvent(ethersEvent: EthersEvent): MessageBundled;
}
//# sourceMappingURL=MessageBundled.d.ts.map