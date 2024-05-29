import { EventContext, EventBase, Filter } from './types.js';
import { providers, BigNumberish, Event as EthersEvent } from 'ethers';
export declare class Event<T> {
    provider: providers.Provider;
    chainId: BigNumberish;
    batchBlocks: number;
    address: string;
    eventName: string;
    constructor(provider: providers.Provider, chainId: BigNumberish, batchBlocks: number, address: string);
    getFilter(): Filter;
    getTopic0(): string | string[] | null;
    getEventsWithFilter(filter: Filter, fromBlock: number, toBlock?: number): Promise<T[]>;
    getEvents(fromBlock: number, toBlock?: number): Promise<T[]>;
    populateEvents<T>(inputEvents: EthersEvent[]): Promise<T[]>;
    toTypedEvent(ethersEvent: EthersEvent): T;
    addContextToEvent(event: EventBase, chainId: BigNumberish): Promise<T>;
    getEventContext(event: EthersEvent, chainId: BigNumberish): Promise<EventContext>;
    getChainSlug(chainId: BigNumberish): string;
    decodeEventsFromTransactionReceipt(receipt: providers.TransactionReceipt): T[];
}
//# sourceMappingURL=Event.d.ts.map