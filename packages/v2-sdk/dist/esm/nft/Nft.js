import { Base } from '#common/index.js';
import { utils } from 'ethers';
import { ConfirmationSentEventFetcher } from '#nft/events/ConfirmationSent.js';
import { TokenConfirmedEventFetcher } from '#nft/events/TokenConfirmed.js';
import { TokenSentEventFetcher } from '#nft/events/TokenSent.js';
import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js';
import { ConfigError, InputError } from '#error/index.js';
const { Interface } = utils;
export class Nft extends Base {
    constructor(config) {
        super({ network: config.network, signer: config.signer, contractAddresses: config.contractAddresses });
        this.batchBlocks = 1000;
    }
    connect(signer) {
        return new Nft({ network: this.network, signer, contractAddresses: this.contractAddresses });
    }
    get populateTransaction() {
        return {
            mintNft: async (input) => {
                const { contractAddress, recipient, tokenId } = input;
                const ABI = [
                    'function safeMint(address to, uint256 tokenId)'
                ];
                const iface = new Interface(ABI);
                const data = iface.encodeFunctionData('safeMint', [recipient, tokenId]);
                const txData = {
                    to: contractAddress,
                    data
                };
                return txData;
            },
            approveNft: async (input) => {
                const { contractAddress, spender, tokenId } = input;
                const ABI = [
                    'function approve(address spender, uint256 tokenId)'
                ];
                const iface = new Interface(ABI);
                const data = iface.encodeFunctionData('approve', [spender, tokenId]);
                const txData = {
                    to: contractAddress,
                    data
                };
                return txData;
            }
        };
    }
    mintNftWrapper(input) {
        const { nftBridgeAddress, wrapperTokenId, fromChainId, serialNumber, supportedChains, wrapperTokenIdNonce } = input;
        const ABI = [
            'function mintWrapper(uint256 wrapperTokenId, uint256 fromChainId, bytes32 serialNumber, uint256[] memory supportedChainIds, uint256 wrapperTokenIdNonce) public'
        ];
        const iface = new Interface(ABI);
        const data = iface.encodeFunctionData('mintWrapper', [wrapperTokenId, fromChainId, serialNumber, supportedChains, wrapperTokenIdNonce]);
        const txData = {
            to: nftBridgeAddress,
            data
        };
        return txData;
    }
    reclaimNftWrapper(input) {
        const { nftBridgeAddress, nftTokenAddress, tokenId, fromChainId, serialNumber, supportedChainIds, wrapperTokenIdNonce } = input;
        const ABI = [
            'function mintWrapperAndWithdraw(address nftTokenAddress, uint256 nftTokenId, uint256 fromChainId, bytes32 serialNumber, uint256[] memory supportedChainIds, uint256 wrapperTokenIdNonce) public'
        ];
        const iface = new Interface(ABI);
        const data = iface.encodeFunctionData('mintWrapperAndWithdraw', [nftTokenAddress, tokenId, fromChainId, serialNumber, supportedChainIds, wrapperTokenIdNonce]);
        const txData = {
            to: nftBridgeAddress,
            data
        };
        return txData;
    }
    sendNft(input) {
        const { nftBridgeAddress, fromChainId, contractAddress, tokenId, supportedChainIds, toChainId, recipient, wrapperTokenIdNonce } = input;
        const ABI = [
            'function depositAndAttemptMintAndSend(address nftTokenAddress, uint256 nftTokenId, uint256[] memory supportedChainIds, uint256 toChainId, address recipient, uint256 wrapperTokenIdNonce) public returns (uint256, bytes32)'
        ];
        const iface = new Interface(ABI);
        const args = [contractAddress, tokenId, supportedChainIds, toChainId, recipient, wrapperTokenIdNonce];
        const data = iface.encodeFunctionData('depositAndAttemptMintAndSend', args);
        const txData = {
            to: nftBridgeAddress,
            data
        };
        return txData;
    }
    sendNftWrapper(input) {
        const { nftBridgeAddress, wrapperTokenId, fromChainId, serialNumber, supportedChainIds, initialRecipient, toChainId, recipient, wrapperTokenIdNonce } = input;
        const ABI = [
            'function send(uint256 wrapperTokenId, uint256 fromChainId, bytes32 serialNumber, uint256[] memory supportedChainIds, address initialRecipient, uint256 toChainId, address recipient, uint256 wrapperTokenIdNonce) public'
        ];
        const iface = new Interface(ABI);
        const data = iface.encodeFunctionData('send', [wrapperTokenId, fromChainId, serialNumber, supportedChainIds, initialRecipient, toChainId, recipient, wrapperTokenIdNonce]);
        const value = '1000000000000';
        const txData = {
            to: nftBridgeAddress,
            data,
            value
        };
        return txData;
    }
    async getNftConfirmationSentEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new InputError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getNftBridgeContractAddress(chainId);
        if (!address) {
            throw new InputError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new ConfirmationSentEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getNftTokenConfirmedEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getNftBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new TokenConfirmedEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    async getNftTokenSentEvents(input) {
        const { chainId, fromBlock, toBlock } = input;
        if (!chainId) {
            throw new InputError('chainId is required');
        }
        if (!fromBlock) {
            throw new InputError('fromBlock is required');
        }
        const provider = this.getRpcProviderForChainId(chainId);
        if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`);
        }
        const address = this.getNftBridgeContractAddress(chainId);
        if (!address) {
            throw new ConfigError(`Contract address not found for chainId: ${chainId}`);
        }
        const eventFetcher = new TokenSentEventFetcher(provider, chainId, this.batchBlocks, address);
        return eventFetcher.getEvents(fromBlock, toBlock);
    }
    getNftBridgeContractAddress(chainId) {
        return this.getConfigAddress(chainId, 'nftBridge');
    }
    async getNftMintPopulatedTx(input) {
        const { fromChainId, toAddress, tokenId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (!toAddress) {
            throw new InputError('toAddress is required');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new InputError(`Invalid chain: ${fromChainId}`);
        }
        const address = this.getNftBridgeContractAddress(fromChainId);
        if (!address) {
            throw new ConfigError(`Nft bridge address not found for chainId "${fromChainId}"`);
        }
        const nftBridge = ERC721Bridge__factory.connect(address, provider);
        const txData = await nftBridge.populateTransaction.mint(toAddress, tokenId);
        return {
            ...txData,
            chainId: Number(fromChainId)
        };
    }
    async getNftBurnPopulatedTx(input) {
        const { fromChainId, tokenId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (!tokenId) {
            throw new InputError('tokenId is required');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new ConfigError(`Invalid chain: ${fromChainId}`);
        }
        const address = this.getNftBridgeContractAddress(fromChainId);
        if (!address) {
            throw new ConfigError(`Invalid address: ${fromChainId}`);
        }
        const nftBridge = ERC721Bridge__factory.connect(address, provider);
        const txData = await nftBridge.populateTransaction.burn(tokenId);
        return {
            ...txData,
            chainId: Number(fromChainId)
        };
    }
    async getNftSendPopulatedTx(input) {
        const { fromChainId, toChainId, toAddress, tokenId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId: ${toChainId}`);
        }
        if (fromChainId?.toString() === toChainId?.toString()) {
            throw new InputError('fromChainId and toChainId must be different');
        }
        if (!toAddress) {
            throw new InputError('toAddress is required');
        }
        if (!tokenId) {
            throw new InputError('tokenId is required');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new InputError(`Invalid chain: ${fromChainId}`);
        }
        const address = this.getNftBridgeContractAddress(fromChainId);
        if (!address) {
            throw new InputError(`Invalid address: ${fromChainId}`);
        }
        const nftBridge = ERC721Bridge__factory.connect(address, provider);
        const txData = await nftBridge.populateTransaction.send(toChainId, toAddress, tokenId);
        return {
            ...txData,
            chainId: Number(fromChainId)
        };
    }
    async getNftMintAndSendPopulatedTx(input) {
        const { fromChainId, toChainId, toAddress, tokenId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (!this.utils.isValidChainId(toChainId)) {
            throw new InputError(`Invalid toChainId: ${toChainId}`);
        }
        if (fromChainId?.toString() === toChainId?.toString()) {
            throw new InputError('fromChainId and toChainId must be different');
        }
        if (!toAddress) {
            throw new InputError('toAddress is required');
        }
        if (!tokenId) {
            throw new InputError('tokenId is required');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new InputError(`Invalid chain: ${fromChainId}`);
        }
        const address = this.getNftBridgeContractAddress(fromChainId);
        if (!address) {
            throw new InputError(`Invalid address: ${fromChainId}`);
        }
        const nftBridge = ERC721Bridge__factory.connect(address, provider);
        const txData = await nftBridge.populateTransaction.mintAndSend(toChainId, toAddress, tokenId);
        return {
            ...txData,
            chainId: Number(fromChainId)
        };
    }
    async getNftConfirmPopulatedTx(input) {
        const { fromChainId, tokenId } = input;
        if (!this.utils.isValidChainId(fromChainId)) {
            throw new InputError(`Invalid fromChainId: ${fromChainId}`);
        }
        if (!tokenId) {
            throw new InputError('tokenId is required');
        }
        const provider = this.getRpcProviderForChainId(fromChainId);
        if (!provider) {
            throw new InputError(`Invalid chain: ${fromChainId}`);
        }
        const address = this.getNftBridgeContractAddress(fromChainId);
        if (!address) {
            throw new InputError(`Invalid address: ${fromChainId}`);
        }
        const nftBridge = ERC721Bridge__factory.connect(address, provider);
        const txData = await nftBridge.populateTransaction.confirm(tokenId);
        return {
            ...txData,
            chainId: Number(fromChainId)
        };
    }
}
//# sourceMappingURL=Nft.js.map