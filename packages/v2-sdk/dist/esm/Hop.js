import { Base } from '#common/index.js';
import { BigNumber } from 'ethers';
import { BundleCommittedEventFetcher } from '#messenger/events/BundleCommitted.js';
import { BundleForwardedEventFetcher } from '#messenger/events/BundleForwarded.js';
import { BundleReceivedEventFetcher } from '#messenger/events/BundleReceived.js';
import { BundleSetEventFetcher } from '#messenger/events/BundleSet.js';
import { ConfirmationSentEventFetcher } from '#nft/events/ConfirmationSent.js';
import { EventFetcher } from '#events/index.js';
import { FeesSentToHubEventFetcher } from '#messenger/events/FeesSentToHub.js';
import { GasPriceOracle } from '#gasPriceOracle/index.js';
import { MessageBundledEventFetcher } from '#messenger/events/MessageBundled.js';
import { MessageExecutedEventFetcher } from '#messenger/events/MessageExecuted.js';
import { MessageSentEventFetcher } from '#messenger/events/MessageSent.js';
import { TokenConfirmedEventFetcher } from '#nft/events/TokenConfirmed.js';
import { TokenSentEventFetcher } from '#nft/events/TokenSent.js';
import { TransferBondedEventFetcher } from '#railsGateway/events/TransferBonded.js';
import { TransferSentEventFetcher } from '#railsGateway/events/TransferSent.js';
import { Messenger } from '#messenger/index.js';
import { HubConnector } from '#hubConnector/index.js';
import { RailsGateway } from '#railsGateway/index.js';
import { Nft } from '#nft/index.js';
import { ConfigError, InputError } from '#error/index.js';
export class Hop extends Base {
    constructor(options) {
        if (!options) {
            throw new ConfigError('options is required');
        }
        const { network } = options;
        super({ network, signer: options?.signer });
        this.batchBlocks = 1000;
        this.providers = {};
        if (!['mainnet', 'sepolia'].includes(network)) {
            throw new ConfigError(`Invalid network: ${network}`);
        }
        this.network = network;
        if (options?.batchBlocks) {
            this.batchBlocks = options.batchBlocks;
        }
        this.gasPriceOracle = new GasPriceOracle(this.network);
        this.messenger = new Messenger({ network, signer: this.signer, contractAddresses: this.contractAddresses });
        this.hubConnector = new HubConnector({ network, signer: this.signer, contractAddresses: this.contractAddresses });
        this.railsGateway = new RailsGateway({ network, signer: this.signer, contractAddresses: this.contractAddresses });
        this.nft = new Nft({ network, signer: this.signer, contractAddresses: this.contractAddresses });
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
            throw new InputError(`Invalid chainId: ${chainId}`);
        }
        return this.hubConnector.getHubConnectorContractAddress(chainId);
    }
    getRailsGatewayContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId: ${chainId}`);
        }
        return this.railsGateway.getRailsGatewayContractAddress(chainId);
    }
    getNftBridgeContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId: ${chainId}`);
        }
        return this.nft.getNftBridgeContractAddress(chainId);
    }
    get populateTransaction() {
        return {
            sendTokens: async (input) => {
                const { fromChainId, toChainId, fromToken, toToken, amount, minAmountOut } = input;
                let { to } = input;
                if (!this.utils.isValidChainId(fromChainId)) {
                    throw new InputError(`Invalid fromChainId "${fromChainId}"`);
                }
                if (!this.utils.isValidChainId(toChainId)) {
                    throw new InputError(`Invalid toChainId "${toChainId}"`);
                }
                if (!this.utils.isValidAddress(fromToken)) {
                    throw new InputError(`Invalid fromToken "${fromToken}"`);
                }
                if (!this.utils.isValidAddress(toToken)) {
                    throw new InputError(`Invalid toToken "${toToken}"`);
                }
                if (!this.utils.isValidNumericValue(minAmountOut)) {
                    throw new InputError(`Invalid minAmountOut "${minAmountOut}"`);
                }
                if (!to) {
                    to = (await this.getSignerAddress());
                }
                if (!this.utils.isValidAddress(to)) {
                    throw new InputError(`Invalid "to" address "${to}"`);
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
                if (!isCheckpointValid && BigNumber.from(lastCheckpoint).eq(0)) {
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
            throw new InputError(`Invalid chainId: ${chainId}`);
        }
        if (!this.signer) {
            throw new ConfigError('No signer connected to switch chains');
        }
        if (!this.signer.provider) {
            throw new ConfigError('No provider connected to signer');
        }
        await this.utils.switchChain(chainId, this.signer.provider);
    }
    // used by v2-explorer backend
    async getEvents(input) {
        let { eventName, eventNames, chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
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
            throw new InputError('expected eventName or eventNames');
        }
        const filters = [];
        const eventFetcher = new EventFetcher({
            provider,
            batchBlocks: this.batchBlocks
        });
        const map = {}; // TODO: type
        for (const eventName of eventNames) {
            if (eventName === 'BundleCommitted') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new BundleCommittedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'BundleForwared') {
                const address = this.messenger.getHubMessageBridgeContractAddress(chainId);
                const eventFetcher = new BundleForwardedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'BundleReceived') {
                const address = this.messenger.getHubMessageBridgeContractAddress(chainId);
                const eventFetcher = new BundleReceivedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'BundleSet') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new BundleSetEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'FeesSentToHub') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new FeesSentToHubEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'MessageBundled') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new MessageBundledEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'MessageExecuted') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new MessageExecutedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'MessageSent') {
                const address = this.messenger.getSpokeMessageBridgeContractAddress(chainId);
                const eventFetcher = new MessageSentEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'ConfirmationSent') { // nft
                const address = this.getNftBridgeContractAddress(chainId);
                const eventFetcher = new ConfirmationSentEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'TokenConfirmed') { // nft
                const address = this.getNftBridgeContractAddress(chainId);
                const eventFetcher = new TokenConfirmedEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'TokenSent') { // nft
                const address = this.getNftBridgeContractAddress(chainId);
                const eventFetcher = new TokenSentEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'TransferSent') { // RailsGateway
                const address = this.getRailsGatewayContractAddress(chainId);
                const eventFetcher = new TransferSentEventFetcher(provider, chainId, this.batchBlocks, address);
                const filter = eventFetcher.getFilter();
                filters.push(filter);
                map[filter?.topics?.[0]] = eventFetcher;
            }
            else if (eventName === 'TransferBonded') { // RailsGateway
                const address = this.getRailsGatewayContractAddress(chainId);
                const eventFetcher = new TransferBondedEventFetcher(provider, chainId, this.batchBlocks, address);
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
//# sourceMappingURL=Hop.js.map