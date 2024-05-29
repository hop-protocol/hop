"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hop = void 0;
const index_js_1 = require("#common/index.js");
const ethers_1 = require("ethers");
const BundleCommitted_js_1 = require("#messenger/events/BundleCommitted.js");
const BundleForwarded_js_1 = require("#messenger/events/BundleForwarded.js");
const BundleReceived_js_1 = require("#messenger/events/BundleReceived.js");
const BundleSet_js_1 = require("#messenger/events/BundleSet.js");
const ConfirmationSent_js_1 = require("#nft/events/ConfirmationSent.js");
const index_js_2 = require("#events/index.js");
const FeesSentToHub_js_1 = require("#messenger/events/FeesSentToHub.js");
const index_js_3 = require("#gasPriceOracle/index.js");
const MessageBundled_js_1 = require("#messenger/events/MessageBundled.js");
const MessageExecuted_js_1 = require("#messenger/events/MessageExecuted.js");
const MessageSent_js_1 = require("#messenger/events/MessageSent.js");
const TokenConfirmed_js_1 = require("#nft/events/TokenConfirmed.js");
const TokenSent_js_1 = require("#nft/events/TokenSent.js");
const TransferBonded_js_1 = require("#railsGateway/events/TransferBonded.js");
const TransferSent_js_1 = require("#railsGateway/events/TransferSent.js");
const index_js_4 = require("#messenger/index.js");
const index_js_5 = require("#hubConnector/index.js");
const index_js_6 = require("#railsGateway/index.js");
const index_js_7 = require("#nft/index.js");
const index_js_8 = require("#error/index.js");
class Hop extends index_js_1.Base {
    constructor(options) {
        if (!options) {
            throw new index_js_8.ConfigError('options is required');
        }
        const { network } = options;
        super({ network, signer: options?.signer });
        this.batchBlocks = 1000;
        this.providers = {};
        if (!['mainnet', 'sepolia'].includes(network)) {
            throw new index_js_8.ConfigError(`Invalid network: ${network}`);
        }
        this.network = network;
        if (options?.batchBlocks) {
            this.batchBlocks = options.batchBlocks;
        }
        this.gasPriceOracle = new index_js_3.GasPriceOracle(this.network);
        this.messenger = new index_js_4.Messenger({ network, signer: this.signer, contractAddresses: this.contractAddresses });
        this.hubConnector = new index_js_5.HubConnector({ network, signer: this.signer, contractAddresses: this.contractAddresses });
        this.railsGateway = new index_js_6.RailsGateway({ network, signer: this.signer, contractAddresses: this.contractAddresses });
        this.nft = new index_js_7.Nft({ network, signer: this.signer, contractAddresses: this.contractAddresses });
    }
    connect(signer) {
        return new Hop({ network: this.network, signer, contractAddresses: this.contractAddresses });
    }
    get version() {
        return ''; // TODO
    }
    getSupportedChainIds() {
        const keys = Object.keys(this.contractAddresses[this.network]);
        return keys.map((chainId) => Number(chainId));
    }
    getHubConnectorContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_8.InputError(`Invalid chainId: ${chainId}`);
        }
        return this.hubConnector.getHubConnectorContractAddress(chainId);
    }
    getRailsGatewayContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_8.InputError(`Invalid chainId: ${chainId}`);
        }
        return this.railsGateway.getRailsGatewayContractAddress(chainId);
    }
    getNftBridgeContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_8.InputError(`Invalid chainId: ${chainId}`);
        }
        return this.nft.getNftBridgeContractAddress(chainId);
    }
    get populateTransaction() {
        return {
            sendTokens: async (input) => {
                const { fromChainId, toChainId, fromToken, toToken, amount, minAmountOut } = input;
                let { to } = input;
                if (!this.utils.isValidChainId(fromChainId)) {
                    throw new index_js_8.InputError(`Invalid fromChainId "${fromChainId}"`);
                }
                if (!this.utils.isValidChainId(toChainId)) {
                    throw new index_js_8.InputError(`Invalid toChainId "${toChainId}"`);
                }
                if (!this.utils.isValidAddress(fromToken)) {
                    throw new index_js_8.InputError(`Invalid fromToken "${fromToken}"`);
                }
                if (!this.utils.isValidAddress(toToken)) {
                    throw new index_js_8.InputError(`Invalid toToken "${toToken}"`);
                }
                if (!this.utils.isValidNumericValue(minAmountOut)) {
                    throw new index_js_8.InputError(`Invalid minAmountOut "${minAmountOut}"`);
                }
                if (!to) {
                    to = (await this.getSignerAddress());
                }
                if (!this.utils.isValidAddress(to)) {
                    throw new index_js_8.InputError(`Invalid "to" address "${to}"`);
                }
                const pathId = await this.railsGateway.getPathId({
                    chainId0: fromChainId,
                    token0: fromToken,
                    chainId1: toChainId,
                    token1: toToken
                });
                console.log('pathId', pathId);
                const lastCheckpoint = await this.railsGateway.getLatestClaim({
                    chainId: fromChainId,
                    pathId
                });
                console.log('lastCheckpoint', lastCheckpoint);
                let isCheckpointValid = await this.railsGateway.getIsCheckpointValid({
                    chainId: toChainId,
                    pathId,
                    checkpoint: lastCheckpoint
                });
                console.log('isCheckpointValid', isCheckpointValid);
                // new path without checkpoints will return 0 bytes32
                if (!isCheckpointValid && ethers_1.BigNumber.from(lastCheckpoint).eq(0)) {
                    isCheckpointValid = true;
                }
                if (!isCheckpointValid) {
                    throw new Error('Latest checkpoint is invalid');
                }
                const populatedTx = await this.railsGateway.populateTransaction.send({
                    chainId: fromChainId,
                    pathId,
                    to,
                    amount,
                    minAmountOut,
                    attestedCheckpoint: lastCheckpoint
                });
                console.log('populatedTx', populatedTx);
                return populatedTx;
            },
            approveSendTokens: async (input) => {
                const { fromChainId, toChainId, fromToken, toToken, amount } = input;
                const pathId = await this.railsGateway.getPathId({
                    chainId0: fromChainId,
                    token0: fromToken,
                    chainId1: toChainId,
                    token1: toToken
                });
                const populatedTx = await this.railsGateway.populateTransaction.approveSend({
                    chainId: fromChainId,
                    pathId,
                    amount
                });
                return populatedTx;
            }
        };
    }
    async sendTokens(input) {
        const populatedTx = await this.populateTransaction.sendTokens(input);
        return this.sendTransaction(populatedTx);
    }
    async approveSendTokens(input) {
        const populatedTx = await this.populateTransaction.approveSendTokens(input);
        return this.sendTransaction(populatedTx);
    }
    async getNeedsApprovalForSendTokens(input) {
        const { fromChainId, fromToken, toChainId, toToken, amount } = input;
        const pathId = await this.railsGateway.getPathId({
            chainId0: fromChainId,
            token0: fromToken,
            chainId1: toChainId,
            token1: toToken
        });
        console.log('getPathId', pathId);
        return this.railsGateway.getNeedsApprovalForSend({ chainId: fromChainId, pathId, amount });
    }
    async getPathInfo(input) {
        return this.railsGateway.getPathInfo(input);
    }
    async connectTargets(input) {
        const tx = await this.hubConnector.connectTargets(input);
        const connectorAddress = await this.hubConnector.getConnectorAddressFromTx(tx);
        return { tx, connectorAddress };
    }
    async switchChain(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new index_js_8.InputError(`Invalid chainId: ${chainId}`);
        }
        if (!this.signer) {
            throw new index_js_8.ConfigError('No signer connected to switch chains');
        }
        if (!this.signer.provider) {
            throw new index_js_8.ConfigError('No provider connected to signer');
        }
        await this.utils.switchChain(chainId, this.signer.provider);
    }
    // used by v2-explorer backend
    async getEvents(input) {
        let { eventName, eventNames, chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new index_js_8.InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new index_js_8.InputError('fromBlock is required');
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new Error(`Provider not found for chainId: ${chainId}`);
        }
        const latestBlock = await provider.getBlockNumber();
        if (latestBlock) {
            if (!toBlock) {
                toBlock = latestBlock;
            }
            if (!fromBlock) {
                const start = latestBlock - 1000;
                fromBlock = start;
            }
            if (toBlock && fromBlock < 0) {
                fromBlock = toBlock + fromBlock;
            }
        }
        if (eventName) {
            eventNames = [eventName];
        }
        if (!eventNames?.length) {
            throw new index_js_8.InputError('expected eventName or eventNames');
        }
        const filters = [];
        const eventFetcher = new index_js_2.EventFetcher({
            provider,
            batchBlocks: this.batchBlocks
        });
        const map = {}; // TODO: type
        for (const eventName of eventNames) {
            if (eventName === 'BundleCommitted') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new BundleCommitted_js_1.BundleCommittedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'BundleForwared') {
                const address = this.messenger.getHubMessageBridgeContractAddress(chainId);
                const eventFetcher = new BundleForwarded_js_1.BundleForwardedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'BundleReceived') {
                const address = this.messenger.getHubMessageBridgeContractAddress(chainId);
                const eventFetcher = new BundleReceived_js_1.BundleReceivedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'BundleSet') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new BundleSet_js_1.BundleSetEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'FeesSentToHub') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new FeesSentToHub_js_1.FeesSentToHubEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'MessageBundled') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new MessageBundled_js_1.MessageBundledEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'MessageExecuted') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new MessageExecuted_js_1.MessageExecutedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'MessageSent') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new MessageSent_js_1.MessageSentEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'ConfirmationSent') { // nft
                const address = this.getNftBridgeContractAddress(chainId);
                const eventFetcher = new ConfirmationSent_js_1.ConfirmationSentEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'TokenConfirmed') { // nft
                const address = this.getNftBridgeContractAddress(chainId);
                const eventFetcher = new TokenConfirmed_js_1.TokenConfirmedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'TokenSent') { // nft
                const address = this.getNftBridgeContractAddress(chainId);
                const eventFetcher = new TokenSent_js_1.TokenSentEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'TransferSent') { // RailsGateway
                const address = this.getRailsGatewayContractAddress(chainId);
                const eventFetcher = new TransferSent_js_1.TransferSentEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'TransferBonded') { // RailsGateway
                const address = this.getRailsGatewayContractAddress(chainId);
                const eventFetcher = new TransferBonded_js_1.TransferBondedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
        }
        const options = {
            fromBlock: fromBlock,
            toBlock: toBlock
        };
        const events = await eventFetcher.fetchEvents(filters, options);
        const decoded = [];
        for (const event of events) {
            const res = await map[event.topics[0]].populateEvents([event]);
            decoded.push(...res);
        }
        return decoded;
    }
    // used by v2-explorer backend
    getEventNames() {
        return this.messenger.getEventNames();
    }
}
exports.Hop = Hop;
//# sourceMappingURL=Hop.js.map