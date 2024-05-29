import { Base } from '#common/index.js';
import { BigNumber, utils } from 'ethers';
import { BundleCommittedEventFetcher } from '#messenger/events/BundleCommitted.js';
import { BundleForwardedEventFetcher } from '#messenger/events/BundleForwarded.js';
import { BundleReceivedEventFetcher } from '#messenger/events/BundleReceived.js';
import { BundleSetEventFetcher } from '#messenger/events/BundleSet.js';
import { DateTime } from 'luxon';
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js';
import { MerkleTree } from '#utils/MerkleTree.js';
import { MessageBundledEventFetcher } from '#messenger/events/MessageBundled.js';
import { MessageExecutedEventFetcher } from '#messenger/events/MessageExecuted.js';
import { MessageSentEventFetcher } from '#messenger/events/MessageSent.js';
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js';
import { MockExecutor__factory } from '#contracts/factories/MockExecutor__factory.js';
import { FeesSentToHubEventFetcher } from '#messenger/events/FeesSentToHub.js';
import { GasPriceOracle } from '#gasPriceOracle/index.js';
import { ConfigError, InputError } from '#error/index.js';
const { formatEther, formatUnits, parseEther } = utils;
export class Messenger extends Base {
    constructor(config) {
        super({ network: config.network, signer: config.signer, contractAddresses: config.contractAddresses });
        this.batchBlocks = 1000;
        this.gasPriceOracle = new GasPriceOracle(this.network);
    }
    connect(signer) {
        return new Messenger({ network: this.network, signer, contractAddresses: this.contractAddresses });
    }
    getSpokeMessageBridgeContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        return this.getConfigAddress(chainId, 'spokeCoreMessenger');
    }
    getHubMessageBridgeContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        return this.getConfigAddress(chainId, 'hubCoreMessenger');
    }
    getExecutorContractAddress(chainId) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        return this.getConfigAddress(chainId, 'executor');
    }
    async getBundleCommittedEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
            throw new InputError(`Invalid toBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new BundleCommittedEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getBundleForwardedEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
            throw new InputError(`Invalid toBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getHubMessageBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new BundleForwardedEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getBundleReceivedEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
            throw new InputError(`Invalid toBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getHubMessageBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new BundleReceivedEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getBundleSetEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
            throw new InputError(`Invalid toBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new BundleSetEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getFeesSentToHubEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
            throw new InputError(`Invalid toBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new FeesSentToHubEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getMessageBundledEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
            throw new InputError(`Invalid toBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new MessageBundledEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getMessageExecutedEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
            throw new InputError(`Invalid toBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new MessageExecutedEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getMessageSentEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        if (!this.utils.isValidFilterBlock(fromBlock)) {
            throw new InputError(`Invalid fromBlock "${fromBlock}"`);
        }
        if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
            throw new InputError(`Invalid toBlock "${toBlock}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new MessageSentEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getHasAuctionStarted(input) {
        const { fromChainId, bundleCommittedEvent } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!bundleCommittedEvent) {
            throw new InputError('bundleCommittedEvent is required');
        }
        const { commitTime, toChainId } = bundleCommittedEvent;
        const exitTime = await this.getSpokeExitTime({ fromChainId, toChainId });
        return commitTime + exitTime < DateTime.utc().toSeconds();
    }
    async getSpokeExitTime(input) {
        const { fromChainId, toChainId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId "${toChainId}"`);
        }
        const provider = this.getRpcProviderForChainId(toChainId);
        if (!provider) {
            throw new InputError(`Invalid chainId "${toChainId}", provider not found`);
        }
        const address = this.getHubMessageBridgeContractAddress(toChainId);
        if (!address) {
            throw new InputError(`Invalid chain: ${toChainId}`);
        }
        const hubMessageBridge = HubMessageBridge__factory.connect(address, provider);
        const exitTime = await hubMessageBridge.getSpokeExitTime(fromChainId);
        const exitTimeSeconds = Number(exitTime.toString());
        return exitTimeSeconds;
    }
    // relayReward = (block.timestamp - relayWindowStart) * feesCollected / relayWindow
    // reference: https://github.com/hop-protocol/contracts-v2/blob/master/contracts/bridge/FeeDistributor/FeeDistributor.sol#L83-L106
    async getRelayReward(input) {
        const { fromChainId, bundleCommittedEvent } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new InputError(`Invalid chainId "${fromChainId}", provider not found`);
        }
        const { commitTime, bundleFees, toChainId } = bundleCommittedEvent;
        const feesCollected = Number(formatEther(bundleFees));
        const { timestamp: blockTimestamp } = await provider.getBlock('latest');
        const spokeExitTime = await this.getSpokeExitTime({ fromChainId, toChainId });
        const relayWindowStart = commitTime + spokeExitTime;
        const relayWindow = await this.getRelayWindowHours() * 60 * 60;
        const relayReward = (blockTimestamp - relayWindowStart) * feesCollected / relayWindow;
        return relayReward;
    }
    async getEstimatedTxCostForForwardMessage(input) {
        const { chainId } = input;
        if (!this.utils.isValidChainId(chainId)) {
            throw new InputError(`Invalid chainId "${chainId}"`);
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new InputError(`Invalid chainId "${chainId}", provider not found`);
        }
        const estimatedGas = BigNumber.from(1000000); // TODO
        const gasPrice = await provider.getGasPrice();
        const estimatedTxCost = estimatedGas.mul(gasPrice);
        return Number(formatUnits(estimatedTxCost, 9));
    }
    async getShouldAttemptForwardMessage(input) {
        const { fromChainId, bundleCommittedEvent } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (!bundleCommittedEvent) {
            throw new InputError('bundleCommittedEvent is required');
        }
        const estimatedTxCost = await this.getEstimatedTxCostForForwardMessage({ chainId: fromChainId });
        const relayReward = await this.getRelayReward({ fromChainId, bundleCommittedEvent });
        const txOk = relayReward > estimatedTxCost;
        const timeOk = await this.getHasAuctionStarted({ fromChainId, bundleCommittedEvent });
        const shouldAttempt = txOk && timeOk;
        return shouldAttempt;
    }
    async exitBundle(input) {
        let { fromChainId, bundleCommittedEvent, bundleCommittedTransactionHash, signer } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (bundleCommittedTransactionHash) {
            if (!this.utils.isValidTxHash(bundleCommittedTransactionHash)) {
                throw new InputError(`Invalid transaction hash "${bundleCommittedTransactionHash}"`);
            }
        }
        else if (bundleCommittedEvent) {
            const { eventLog, context } = bundleCommittedEvent;
            if (!eventLog) {
                throw new InputError('eventLog is required');
            }
            bundleCommittedTransactionHash = eventLog.transactionHash ?? context?.transactionHash;
        }
        else {
            throw new InputError('bundleCommittedEvent or bundleCommittedTransactionHash is required');
        }
        if (!bundleCommittedTransactionHash) {
            throw new InputError('expected bundle comitted transaction hash');
        }
        const l1Provider = this.getRpcProviderForChainId(this.l1ChainId);
        const l2Provider = this.getRpcProviderForChainId(fromChainId);
        let exitRelayer = undefined;
        if (['420', '10'].includes(fromChainId?.toString())) {
            const { OptimismRelayer } = await import('../exitRelayers/OptimismRelayer.js');
            exitRelayer = new OptimismRelayer(this.network, signer, l2Provider);
        }
        else if (['421613', '42161', '42170'].includes(fromChainId?.toString())) {
            // const { ArbitrumRelayer } = await import('../exitRelayers/ArbitrumRelayer.js')
            // exitRelayer = new ArbitrumRelayer(this.network, l1Provider, l2Provider)
        }
        else if (['80001', '137'].includes(fromChainId?.toString())) {
            // const { PolygonRelayer } = await import('../exitRelayers/PolygonRelayer.js')
            // exitRelayer = new PolygonRelayer(this.network, l1Provider, l2Provider)
        }
        else if (['100'].includes(fromChainId?.toString())) {
            // const { GnosisChainRelayer } = await import('../exitRelayers/GnosisChainRelayer.js')
            // exitRelayer = new GnosisChainRelayer(this.network, l1Provider, l2Provider)
        }
        if (!exitRelayer) {
            throw new ConfigError(`Exit relayer not found for chainId "${fromChainId}"`);
        }
        const tx = await exitRelayer.exitTx(bundleCommittedTransactionHash);
        return tx;
    }
    async getIsL2TxHashExited(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new InputError(`Invalid transaction hash "${transactionHash}"`);
        }
        const l1Provider = this.getRpcProviderForChainId(this.l1ChainId);
        const l2Provider = this.getRpcProviderForChainId(fromChainId);
        let exitRelayer;
        if (['420', '10'].includes(fromChainId?.toString())) {
            const { OptimismRelayer } = await import('../exitRelayers/OptimismRelayer.js');
            exitRelayer = new OptimismRelayer(this.network, l1Provider, l2Provider);
        }
        else {
            throw new ConfigError(`Exit relayer not found for chainId "${fromChainId}"`);
        }
        return exitRelayer.getIsL2TxHashExited(transactionHash);
    }
    get populateTransaction() {
        return {
            sendMessage: async (input) => {
                let { fromChainId, toChainId, toAddress, toCalldata = '0x' } = input;
                if (!this.utils.isValidChainId(fromChainId)) {
                    throw new InputError(`Invalid fromChainId "${fromChainId}"`);
                }
                if (!this.utils.isValidChainId(toChainId)) {
                    throw new InputError(`Invalid toChainId "${toChainId}"`);
                }
                if (fromChainId?.toString() === toChainId?.toString()) {
                    throw new InputError('fromChainId and toChainId must be different');
                }
                if (!toAddress) {
                    throw new InputError('toAddress is required');
                }
                if (!this.utils.isValidAddress(toAddress)) {
                    throw new InputError(`Invalid toAddress "${toAddress}"`);
                }
                if (!toCalldata) {
                    toCalldata = '0x';
                }
                if (!this.utils.isValidBytes(toCalldata)) {
                    throw new InputError(`Invalid toCalldata "${toCalldata}"`);
                }
                const provider = this.getRpcProviderForChainId(fromChainId);
                if (!provider) {
                    throw new InputError(`Invalid chainId, "${fromChainId}", provider not found`);
                }
                const address = this.getSpokeMessageBridgeContractAddress(fromChainId);
                if (!address) {
                    throw new ConfigError(`Invalid address, not found for chainId "${fromChainId}"`);
                }
                const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider);
                const txData = await spokeMessageBridge.populateTransaction.dispatchMessage(toChainId, toAddress, toCalldata);
                const value = await this.getMessageFee({ fromChainId, toChainId });
                return {
                    ...txData,
                    chainId: Number(fromChainId),
                    value: value.toString()
                };
            },
            relayMessage: async (input) => {
                const { fromChainId, toChainId, fromAddress, toAddress, toCalldata, bundleProof } = input;
                if (!this.utils.isValidChainId(fromChainId)) {
                    throw new InputError(`Invalid fromChainId "${fromChainId}"`);
                }
                if (!this.utils.isValidChainId(toChainId)) {
                    throw new InputError(`Invalid toChainId "${toChainId}"`);
                }
                if (!this.utils.isValidAddress(toAddress)) {
                    throw new InputError(`Invalid toAddress "${toAddress}"`);
                }
                if (!this.utils.isValidBytes(toCalldata)) {
                    throw new InputError(`Invalid toCalldata "${toCalldata}"`);
                }
                if (!bundleProof) {
                    throw new InputError('bundleProof is required');
                }
                if (!this.isValidBundleProof(bundleProof)) {
                    throw new InputError('Invalid bundleProof');
                }
                const provider = this.getRpcProviderForChainId(toChainId);
                if (!provider) {
                    throw new InputError(`Invalid chainId "${toChainId}", provider not found`);
                }
                const address = this.getHubMessageBridgeContractAddress(toChainId);
                if (!address) {
                    throw new InputError(`Invalid chainId "${toChainId}", address not found`);
                }
                const hubMessageBridge = HubMessageBridge__factory.connect(address, provider);
                const txData = await hubMessageBridge.populateTransaction.executeMessage(fromChainId, fromAddress, toAddress, toCalldata, bundleProof);
                return {
                    ...txData,
                    chainId: Number(toChainId)
                };
            },
            bundleExit: async (input) => {
                let { fromChainId, bundleCommittedEvent, bundleCommittedTransactionHash } = input;
                if (!this.utils.isValidChainId(fromChainId)) {
                    throw new InputError(`Invalid fromChainId "${fromChainId}"`);
                }
                if (bundleCommittedTransactionHash) {
                    if (!this.utils.isValidTxHash(bundleCommittedTransactionHash)) {
                        throw new InputError(`Invalid transaction hash "${bundleCommittedTransactionHash}"`);
                    }
                }
                else if (bundleCommittedEvent) {
                    const { eventLog, context } = bundleCommittedEvent;
                    if (!eventLog) {
                        throw new InputError('eventLog is required');
                    }
                    bundleCommittedTransactionHash = eventLog.transactionHash ?? context?.transactionHash;
                }
                else {
                    throw new InputError('bundleCommittedEvent or bundleCommittedTransactionHash is required');
                }
                if (!bundleCommittedTransactionHash) {
                    throw new InputError('expected bundle comitted transaction hash');
                }
                const l1Provider = this.getRpcProviderForChainId(this.l1ChainId);
                const l2Provider = this.getRpcProviderForChainId(fromChainId);
                let exitRelayer = undefined;
                if (['420', '10'].includes(fromChainId?.toString())) {
                    const { OptimismRelayer } = await import('../exitRelayers/OptimismRelayer.js');
                    exitRelayer = new OptimismRelayer(this.network, l1Provider, l2Provider);
                }
                else if (['421613', '42161', '42170'].includes(fromChainId?.toString())) {
                    // const { ArbitrumRelayer } = await import('../exitRelayers/ArbitrumRelayer.js')
                    // exitRelayer = new ArbitrumRelayer(this.network, l1Provider, l2Provider)
                }
                else if (['80001', '137'].includes(fromChainId?.toString())) {
                    // const { PolygonRelayer } = await import('../exitRelayers/PolygonRelayer.js')
                    // exitRelayer = new PolygonRelayer(this.network, l1Provider, l2Provider)
                }
                else if (['100'].includes(fromChainId?.toString())) {
                    // const { GnosisChainRelayer } = await import('../exitRelayers/GnosisChainRelayer.js')
                    // exitRelayer = new GnosisChainRelayer(this.network, l1Provider, l2Provider)
                }
                if (!exitRelayer) {
                    throw new ConfigError(`Exit relayer not found for chainId "${fromChainId}"`);
                }
                const txData = await exitRelayer.getExitPopulatedTx(bundleCommittedTransactionHash);
                return {
                    ...txData,
                    chainId: Number(fromChainId)
                };
            },
            execute: async (input) => {
                const { fromChainId, toChainId, messageId, fromAddress, toAddress, toCalldata } = input;
                if (!this.utils.isValidChainId(fromChainId)) {
                    throw new InputError(`Invalid fromChainId "${fromChainId}"`);
                }
                if (!this.utils.isValidChainId(toChainId)) {
                    throw new InputError(`Invalid toChainId "${toChainId}"`);
                }
                if (!this.utils.isValidBytes32(messageId)) {
                    throw new InputError(`Invalid messageId "${messageId}"`);
                }
                if (!this.utils.isValidAddress(fromAddress)) {
                    throw new InputError(`Invalid fromAddress "${fromAddress}"`);
                }
                if (!this.utils.isValidAddress(toAddress)) {
                    throw new InputError(`Invalid toAddress "${toAddress}"`);
                }
                if (!this.utils.isValidBytes(toCalldata)) {
                    throw new InputError(`Invalid calldata "${toCalldata}"`);
                }
                const address = this.getExecutorContractAddress(toChainId);
                if (!address) {
                    throw new InputError(`Invalid address, not found for chainId "${toChainId}"`);
                }
                const provider = this.getRpcProviderForChainId(toChainId);
                const mockExecutor = MockExecutor__factory.connect(address, provider);
                const txData = await mockExecutor.populateTransaction.execute(messageId, fromChainId, fromAddress, toAddress, toCalldata);
                return {
                    ...txData,
                    chainId: Number(toChainId)
                };
            }
        };
    }
    async sendMessage(input) {
        const populatedTx = await this.populateTransaction.sendMessage(input);
        const tx = await this.sendTransaction(populatedTx);
        return tx;
    }
    async relayMessage(input) {
        const populatedTx = await this.populateTransaction.relayMessage(input);
        const tx = await this.sendTransaction(populatedTx);
        return tx;
    }
    async bundleExit(input) {
        const populatedTx = await this.populateTransaction.bundleExit(input);
        const tx = await this.sendTransaction(populatedTx);
        return tx;
    }
    // reference: https://github.com/hop-protocol/contracts-v2/blob/cdc3377d6a1f964554ba0e6e1fef0b504d43fc6a/contracts/bridge/FeeDistributor/FeeDistributor.sol#L42
    async getRelayWindowHours() {
        return 12;
    }
    async getRouteData(input) {
        const { fromChainId, toChainId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId "${toChainId}"`);
        }
        if (fromChainId?.toString() === toChainId?.toString()) {
            throw new InputError('fromChainId and toChainId must be different');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        const address = this.getSpokeMessageBridgeContractAddress(fromChainId);
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider);
        const routeData = await spokeMessageBridge.routeData(toChainId);
        return {
            messageFee: routeData.messageFee,
            maxBundleMessages: Number(routeData.maxBundleMessages.toString())
        };
    }
    async getMessageFee(input) {
        const { fromChainId, toChainId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId "${toChainId}"`);
        }
        if (fromChainId?.toString() === toChainId?.toString()) {
            throw new InputError('fromChainId and toChainId must be different');
        }
        const routeData = await this.getRouteData({ fromChainId, toChainId });
        return routeData.messageFee;
    }
    async getMaxBundleMessageCount(input) {
        const { fromChainId, toChainId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId "${toChainId}"`);
        }
        if (fromChainId?.toString() === toChainId?.toString()) {
            throw new InputError('fromChainId and toChainId must be different');
        }
        const routeData = await this.getRouteData({ fromChainId, toChainId });
        return routeData.maxBundleMessages;
    }
    async getIsBundleSet(input) {
        const { fromChainId, toChainId, bundleId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId "${toChainId}"`);
        }
        const provider = this.getRpcProviderForChainId(toChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId "${toChainId}"`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(toChainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId "${toChainId}"`);
        }
        const hubMessageBridge = HubMessageBridge__factory.connect(address, provider);
        const entity = await hubMessageBridge.bundles(bundleId);
        if (!entity) {
            return false;
        }
        return BigNumber.from(entity.root).gt(0) && Number(entity.fromChainId.toString()) === fromChainId;
    }
    async getMessageSentEventFromTransactionReceipt(input) {
        const { fromChainId, receipt } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!receipt) {
            throw new InputError('receipt is required');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(fromChainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${fromChainId}`);
        }
        const eventFetcher = new MessageSentEventFetcher(provider, fromChainId, this.batchBlocks, address);
        const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt);
        return events?.[0] ?? null;
    }
    async getMessageSentEventFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!transactionHash) {
            throw new InputError('transactionHash is required');
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new InputError(`Invalid transaction hash "${transactionHash}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const receipt = await provider.getTransactionReceipt(transactionHash);
        return this.getMessageSentEventFromTransactionReceipt({ fromChainId, receipt });
    }
    async getMessageBundledEventFromMessageId(input) {
        const { fromChainId, messageId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(messageId)) {
            throw new InputError(`Invalid messageId "${messageId}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(fromChainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId "${fromChainId}"`);
        }
        const eventFetcher = new MessageBundledEventFetcher(provider, fromChainId, 0, address);
        const filter = eventFetcher.getMessageIdFilter(messageId);
        const toBlock = await provider.getBlockNumber();
        const fromBlock = 0; // endBlock - 100_000
        const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock);
        return events?.[0] ?? null;
    }
    async getMessageSentEventFromMessageId(input) {
        const { fromChainId, messageId } = input;
        if (!fromChainId) {
            throw new InputError('fromChainId is required');
        }
        if (!messageId) {
            throw new InputError('messageId is required');
        }
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId ${fromChainId}""`);
        }
        if (!this.utils.isValidBytes32(messageId)) {
            throw new InputError(`Invalid messageId "${messageId}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(fromChainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId "${fromChainId}"`);
        }
        const eventFetcher = new MessageSentEventFetcher(provider, fromChainId, 0, address);
        const filter = eventFetcher.getMessageIdFilter(messageId);
        const toBlock = await provider.getBlockNumber();
        const fromBlock = 0; // endBlock - 100_000
        const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock);
        return events?.[0] ?? null;
    }
    // note: this is broken because messageId is not indexed in event
    async getMessageExecutedEventFromMessageId(input) {
        const { fromChainId, toChainId, messageId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId "${toChainId}"`);
        }
        if (!messageId) {
            throw new InputError('messageId is required');
        }
        if (!this.utils.isValidBytes32(messageId)) {
            throw new InputError(`Invalid messageId "${messageId}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${toChainId}`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(toChainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${toChainId}`);
        }
        const eventFetcher = new MessageExecutedEventFetcher(provider, toChainId, 0, address);
        const filter = eventFetcher.getMessageIdFilter(messageId);
        const toBlock = await provider.getBlockNumber();
        const fromBlock = 0; // endBlock - 100_000
        const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock);
        return events?.[0] ?? null;
    }
    async getMessageBundledEventFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!transactionHash) {
            throw new InputError('transactionHash is required');
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new InputError(`Invalid transaction hash "${transactionHash}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${fromChainId}`);
        }
        const receipt = await provider.getTransactionReceipt(transactionHash);
        const address = this.getSpokeMessageBridgeContractAddress(fromChainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${fromChainId}`);
        }
        const eventFetcher = new MessageBundledEventFetcher(provider, fromChainId, this.batchBlocks, address);
        const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt);
        return events?.[0] ?? null;
    }
    async getMessageIdFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!fromChainId) {
            throw new InputError('fromChainId is required');
        }
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (!transactionHash) {
            throw new InputError('transactionHash is required');
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new InputError(`Invalid transaction hash "${transactionHash}"`);
        }
        const event = await this.getMessageSentEventFromTransactionHash({ fromChainId, transactionHash });
        if (!event) {
            throw new Error('event not found for transaction hash');
        }
        return event.messageId;
    }
    async getMessageBundleIdFromMessageId(input) {
        const { fromChainId, messageId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(messageId)) {
            throw new InputError(`Invalid messageId "${messageId}"`);
        }
        const event = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId });
        if (!event) {
            throw new Error('event not found for messageId');
        }
        return event.bundleId;
    }
    async getMessageBundleIdFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new InputError(`Invalid transactionHash "${transactionHash}"`);
        }
        const event = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash });
        if (!event) {
            throw new Error('event not found for transaction hash');
        }
        return event.bundleId;
    }
    async getMessageTreeIndexFromMessageId(input) {
        const { fromChainId, messageId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(messageId)) {
            throw new InputError(`Invalid messageId "${messageId}"`);
        }
        const event = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId });
        if (!event) {
            throw new Error('event not found for messageId');
        }
        return event.treeIndex;
    }
    async getMessageTreeIndexFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new InputError(`Invalid transactionHash "${transactionHash}"`);
        }
        const event = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash });
        if (!event) {
            throw new Error('event not found for transaction hash');
        }
        return event.treeIndex;
    }
    async getMessageBundledEventsForBundleId(input) {
        const { fromChainId, bundleId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(bundleId)) {
            throw new InputError(`Invalid bundleId "${bundleId}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${fromChainId}`);
        }
        const address = this.getSpokeMessageBridgeContractAddress(fromChainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${fromChainId}`);
        }
        const eventFetcher = new MessageBundledEventFetcher(provider, fromChainId, 0, address);
        const filter = eventFetcher.getBundleIdFilter(bundleId);
        const toBlock = await provider.getBlockNumber();
        const fromBlock = 0; // endBlock - 100_000
        const events = eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock);
        return events;
    }
    async getMessageIdsForBundleId(input) {
        const { fromChainId, bundleId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidBytes32(bundleId)) {
            throw new InputError(`Invalid bundleId "${bundleId}"`);
        }
        const messageEvents = await this.getMessageBundledEventsForBundleId({ fromChainId, bundleId });
        const messageIds = messageEvents.map((item) => item.messageId);
        return messageIds;
    }
    async getMerkleProofForMessageId(input) {
        const { messageIds, targetMessageId } = input;
        if (!targetMessageId) {
            throw new InputError('targetMessageId is required');
        }
        if (!Array.isArray(messageIds)) {
            throw new InputError('messageIds is required and must be an array');
        }
        if (!messageIds.every((item) => this.utils.isValidBytes32(item))) {
            throw new InputError('Invalid messageIds');
        }
        if (!this.utils.isValidBytes32(targetMessageId)) {
            throw new InputError(`Invalid targetMessageId "${targetMessageId}"`);
        }
        const tree = MerkleTree.from(messageIds);
        const proof = tree.getHexProof(targetMessageId);
        return proof;
    }
    async getBundleProofFromMessageId(input) {
        const { fromChainId, messageId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!messageId) {
            throw new InputError('messageId is required');
        }
        if (!this.utils.isValidBytes32(messageId)) {
            throw new InputError(`Invalid messageId "${messageId}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        const { treeIndex, bundleId } = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId });
        const messageIds = await this.getMessageIdsForBundleId({ fromChainId, bundleId });
        const siblings = await this.getMerkleProofForMessageId({ messageIds, targetMessageId: messageId });
        const totalLeaves = messageIds.length;
        return {
            bundleId,
            treeIndex,
            siblings,
            totalLeaves
        };
    }
    async getBundleProofFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new InputError(`Invalid transactionHash "${transactionHash}"`);
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId "${fromChainId}"`);
        }
        // TODO: handle case for when multiple message events in single transaction
        const messageBundledEvent = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash });
        if (!messageBundledEvent) {
            throw new Error(`MessageBundled event not found for transaction hash "${transactionHash}"`);
        }
        const { treeIndex, bundleId } = messageBundledEvent;
        const targetMessageId = await this.getMessageIdFromTransactionHash({ fromChainId, transactionHash });
        const messageIds = await this.getMessageIdsForBundleId({ fromChainId, bundleId });
        const siblings = await this.getMerkleProofForMessageId({ messageIds, targetMessageId });
        const totalLeaves = messageIds.length;
        return {
            bundleId,
            treeIndex,
            siblings,
            totalLeaves
        };
    }
    async getRelayMessageDataFromTransactionHash(input) {
        const { fromChainId, transactionHash } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!transactionHash) {
            throw new InputError('transactionHash is required');
        }
        if (!this.utils.isValidTxHash(transactionHash)) {
            throw new InputError(`Invalid transaction hash "${transactionHash}"`);
        }
        const event = await this.getMessageSentEventFromTransactionHash({ fromChainId, transactionHash });
        if (!event) {
            throw new Error(`Event not found for transaction hash "${transactionHash}"`);
        }
        const toAddress = event.to;
        const fromAddress = event.from;
        const toCalldata = event.data;
        const toChainId = event.toChainId;
        const bundleProof = await this.getBundleProofFromTransactionHash({ fromChainId, transactionHash });
        return {
            fromChainId,
            toAddress,
            fromAddress,
            toCalldata,
            toChainId,
            bundleProof
        };
    }
    async getMessageCalldataFromMessageId(input) {
        const { fromChainId, messageId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!messageId) {
            throw new InputError('messageId is required');
        }
        if (!this.utils.isValidBytes32(messageId)) {
            throw new InputError(`Invalid messageId "${messageId}"`);
        }
        const event = await this.getMessageSentEventFromMessageId({ fromChainId, messageId });
        if (!event) {
            throw new Error(`Event not found for messageId "${messageId}"`);
        }
        return event.data;
    }
    async getIsMessageIdRelayed(input) {
        const { fromChainId, toChainId, messageId } = input;
        if (!messageId) {
            throw new InputError('messageId is required');
        }
        if (!this.utils.isValidBytes32(messageId)) {
            throw new InputError(`Invalid messageId "${messageId}"`);
        }
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId: ${toChainId}`);
        }
        const event = await this.getMessageExecutedEventFromMessageId({ messageId, fromChainId, toChainId });
        return !!event;
    }
    async getRelayFee(input) {
        const { fromChainId, toChainId, toAddress, toCalldata } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId "${fromChainId}"`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId "${toChainId}"`);
        }
        if (!this.utils.isValidAddress(toAddress)) {
            throw new InputError(`Invalid toAddress "${toAddress}"`);
        }
        if (!this.utils.isValidBytes(toCalldata)) {
            throw new InputError(`Invalid toCalldata "${toCalldata}"`);
        }
        const populatedTx = await this.populateTransaction.sendMessage({
            fromChainId,
            toChainId,
            toAddress,
            toCalldata
        });
        const timestamp = null;
        const txData = (populatedTx.data ?? '0x').toString();
        const chain = this.utils.getChainSlug(toChainId);
        const provider = this.getRpcProviderForChainId(toChainId);
        const gasLimit = await provider.estimateGas(populatedTx);
        const feeData = await this.gasPriceOracle.estimateGasCost(chain, timestamp, gasLimit.toNumber(), txData);
        return parseEther(feeData.data.gasCost);
    }
    getEventNames() {
        return [
            'BundleCommitted',
            'BundleForwarded',
            'BundleReceived',
            'BundleSet',
            'FeesSentToHub',
            'MessageBundled',
            'MessageExecuted',
            'MessageSent'
        ];
    }
    isValidBundleProof(bundleProof) {
        if (!bundleProof) {
            return false;
        }
        if (!this.utils.isValidBytes32(bundleProof.bundleId)) {
            return false;
        }
        if (typeof bundleProof.treeIndex !== 'number') {
            return false;
        }
        if (!Array.isArray(bundleProof.siblings)) {
            return false;
        }
        if (bundleProof.siblings.some((item) => !this.utils.isValidBytes32(item))) {
            return false;
        }
        if (typeof bundleProof.totalLeaves !== 'number') {
            return false;
        }
        return true;
    }
    async execute(input) {
        const txData = await this.populateTransaction.execute(input);
        const tx = await this.sendTransaction(txData);
        return tx;
    }
}
//# sourceMappingURL=Messenger.js.map