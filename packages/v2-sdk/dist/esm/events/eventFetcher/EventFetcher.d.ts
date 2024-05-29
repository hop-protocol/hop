import { Filter } from '@ethersproject/abstract-provider';
import { providers, Event as EthersEvent } from 'ethers';
export type Options = {
    provider: providers.Provider;
    batchBlocks?: number;
};
export type FetchOptions = {
    fromBlock: number;
    toBlock: number;
};
export type InputFilter = {
    address: string;
    topics: (string | string[])[];
};
export declare class EventFetcher {
    provider: providers.Provider;
    batchBlocks: number;
    constructor(options: Options);
    fetchEvents(filters: InputFilter[], options: FetchOptions): Promise<EthersEvent[]>;
    getChunkedBlockRanges(fromBlock: number, toBlock: number): number[][];
    aggregateFilters(filters: InputFilter[], options: FetchOptions): Filter[];
    private fetchEventsWithAggregatedFilters;
    private normalizeEvents;
    private parallelFetch;
    private sortByBlockNumber;
}
//# sourceMappingURL=EventFetcher.d.ts.map