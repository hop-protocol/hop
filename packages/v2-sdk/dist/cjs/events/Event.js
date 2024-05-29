"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const index_js_1 = require("./eventFetcher/index.js");
const chainSlugMap_js_1 = require("#utils/chainSlugMap.js");
const sdk_1 = require("@hop-protocol/sdk");
class Event {
    constructor(provider, chainId, batchBlocks, address) {
        if (!provider) {
            throw new Error('expected provider');
        }
        this.provider = provider;
        this.chainId = chainId;
        this.batchBlocks = batchBlocks;
        if (this.batchBlocks === 0) {
            this.batchBlocks = 1000000;
        }
        this.address = address;
    }
    getFilter() {
        throw new Error('Not implemented. This should be implemented by child class.');
    }
    getTopic0() {
        const filter = this.getFilter();
        return filter.topics?.[0] ?? null;
    }
    async getEventsWithFilter(filter, fromBlock, toBlock) {
        const eventFetcher = new index_js_1.EventFetcher({
            provider: this.provider,
            batchBlocks: this.batchBlocks
        });
        if (!toBlock) {
            toBlock = await this.provider.getBlockNumber();
        }
        const events = await eventFetcher.fetchEvents([filter], { fromBlock, toBlock });
        console.log(`populating events. count: ${events.length}`);
        return this.populateEvents(events);
    }
    async getEvents(fromBlock, toBlock) {
        const filter = this.getFilter();
        const events = await this.getEventsWithFilter(filter, fromBlock, toBlock);
        return events;
    }
    async populateEvents(inputEvents) {
        const events = inputEvents.map(x => this.toTypedEvent(x));
        const promiseFns = events.map(event => () => this.addContextToEvent(event, this.chainId));
        const populatedEvents = [];
        await (0, sdk_1.promiseQueue)(promiseFns, async (fn) => {
            populatedEvents.push(await fn());
        }, { concurrency: 20 });
        return populatedEvents.map((event) => event);
    }
    toTypedEvent(ethersEvent) {
        throw new Error('Not implemented');
    }
    async addContextToEvent(event, chainId) {
        const context = await this.getEventContext(event.eventLog, chainId);
        event.context = context;
        return event;
    }
    async getEventContext(event, chainId) {
        try {
            const chainSlug = this.getChainSlug(chainId);
            const transactionHash = event.transactionHash;
            const transactionIndex = event.transactionIndex;
            const logIndex = event.logIndex;
            const blockNumber = event.blockNumber;
            const [{ timestamp: blockTimestamp }, { value, nonce, gasLimit, gasPrice, data }, { from, to, gasUsed }] = await Promise.all([
                this.provider.getBlock(blockNumber),
                this.provider.getTransaction(transactionHash),
                this.provider.getTransactionReceipt(transactionHash)
            ]);
            return {
                chainSlug,
                chainId: chainId?.toString(),
                transactionHash,
                transactionIndex,
                logIndex,
                blockNumber,
                blockTimestamp,
                from,
                to,
                value: value.toString(),
                nonce: Number(nonce.toString()),
                gasLimit: Number(gasLimit?.toString()),
                gasUsed: Number(gasUsed?.toString()),
                gasPrice: gasPrice?.toString(),
                data
            };
        }
        catch (err) {
            console.log('getEventContext error:', err, chainId, event);
            throw err;
        }
    }
    getChainSlug(chainId) {
        const chainSlug = chainSlugMap_js_1.chainSlugMap[chainId?.toString()];
        if (!chainSlug) {
            throw new Error(`Invalid chain "${chainId?.toString()}", slug not found`);
        }
        return chainSlug;
    }
    decodeEventsFromTransactionReceipt(receipt) {
        const decodedEvents = [];
        const topic = this.getTopic0();
        for (const log of receipt.logs) {
            if (log.topics[0] === topic) {
                const decoded = this.toTypedEvent(log);
                decodedEvents.push(decoded);
            }
        }
        return decodedEvents;
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map