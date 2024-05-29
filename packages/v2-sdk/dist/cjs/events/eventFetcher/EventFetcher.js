"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventFetcher = void 0;
const sdk_1 = require("@hop-protocol/sdk");
const ethers_1 = require("ethers");
const { getAddress: checksumAddress } = ethers_1.utils;
const DefaultBatchBlocks = 2000;
class EventFetcher {
    constructor(options) {
        this.batchBlocks = DefaultBatchBlocks;
        if (!options.provider) {
            throw new Error('provider is required');
        }
        this.provider = options.provider;
        if (options.batchBlocks) {
            this.batchBlocks = options.batchBlocks;
        }
    }
    async fetchEvents(filters, options) {
        const blockRanges = this.getChunkedBlockRanges(options.fromBlock, options.toBlock);
        const promiseFns = []; // TODO: type
        for (const [batchStart, batchEnd] of blockRanges) {
            const batchOptions = {
                fromBlock: batchStart,
                toBlock: batchEnd
            };
            const aggregatedFilters = this.aggregateFilters(filters, batchOptions);
            const batchedEventsFn = () => this.fetchEventsWithAggregatedFilters(aggregatedFilters);
            promiseFns.push(batchedEventsFn);
        }
        const events = await this.parallelFetch(promiseFns);
        return this.normalizeEvents(events);
    }
    getChunkedBlockRanges(fromBlock, toBlock) {
        fromBlock = Math.min(fromBlock, toBlock);
        let batchStart = fromBlock;
        let batchEnd = Math.min(batchStart + this.batchBlocks, toBlock);
        const blockRanges = [];
        while (batchEnd <= toBlock) {
            blockRanges.push([batchStart, batchEnd]);
            if (batchEnd === toBlock) {
                break;
            }
            batchStart = batchEnd;
            batchEnd = Math.min(batchStart + this.batchBlocks, toBlock);
        }
        return blockRanges;
    }
    aggregateFilters(filters, options) {
        const fromBlock = options.fromBlock;
        const toBlock = options.toBlock;
        const filtersByAddress = {};
        if (filters.length === 1) {
            const filter = filters[0];
            const address = checksumAddress(filter.address);
            filter.address = address;
            filtersByAddress[address] = filter;
        }
        else if (filters.length > 1) {
            for (const filter of filters) {
                if (filter.address) {
                    const address = checksumAddress(filter.address);
                    if (!filtersByAddress[address]) {
                        filtersByAddress[address] = {};
                    }
                    const obj = filtersByAddress[address];
                    if (!obj.address) {
                        obj.address = address;
                    }
                    const topics = (obj.topics ?? []);
                    if (filter.topics) {
                        for (let i = 0; i < filter.topics.length; i++) {
                            const topic = filter.topics[i];
                            if (!topics[i]) {
                                topics[i] = [];
                            }
                            if (!topics[i].includes(topic)) {
                                topics[i].push(topic);
                            }
                        }
                    }
                    obj.topics = topics;
                    filtersByAddress[address] = obj;
                }
            }
        }
        const aggregatedFilters = [];
        for (const address in filtersByAddress) {
            const filter = filtersByAddress[address];
            aggregatedFilters.push({ ...filter, fromBlock, toBlock });
        }
        return aggregatedFilters;
    }
    async fetchEventsWithAggregatedFilters(aggregatedFilters) {
        const promises = [];
        for (const filter of aggregatedFilters) {
            promises.push(this.provider.getLogs({ ...filter }));
        }
        const promiseResults = await Promise.all(promises);
        const result = [];
        for (const events of promiseResults) {
            result.push(...events);
        }
        return result;
    }
    normalizeEvents(events) {
        const filteredEvents = [];
        const seen = {};
        for (const event of events) {
            const key = `${event.transactionHash}-${event.logIndex}`;
            if (!seen[key]) {
                seen[key] = true;
                filteredEvents.push(event);
            }
        }
        return filteredEvents.sort((a, b) => this.sortByBlockNumber(a, b));
    }
    async parallelFetch(promiseFns) {
        const events = [];
        let i = 1;
        await (0, sdk_1.promiseQueue)(promiseFns, async (fn) => {
            const batchedEvents = await fn();
            console.log(`got batch ${i++}/${promiseFns.length}`);
            events.push(...batchedEvents);
        }, { concurrency: 20 });
        return events;
    }
    sortByBlockNumber(a, b) {
        if (a.blockNumber > b.blockNumber)
            return 1;
        if (a.blockNumber < b.blockNumber)
            return -1;
        if (a.logIndex > b.logIndex)
            return 1;
        if (a.logIndex < b.logIndex)
            return -1;
        return 0;
    }
}
exports.EventFetcher = EventFetcher;
//# sourceMappingURL=EventFetcher.js.map