"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const ethers_1 = require("ethers");
const sdk_1 = require("@hop-protocol/sdk");
const index_js_1 = require("#addresses/index.js");
const index_js_2 = require("#utils/index.js");
const { getAddress: checksumAddress } = ethers_1.utils;
class Base {
    constructor(config) {
        this.gasPriceMultiplier = 0;
        this.chainProviders = {};
        if (!config.network) {
            throw new Error('network is required');
        }
        this.network = config.network;
        if (config.signer) {
            this.signer = config.signer;
            if (!ethers_1.Signer.isSigner(this.signer)) {
                this.signer = new ethers_1.providers.Web3Provider(this.signer, 'any').getSigner();
            }
        }
        this.gasPriceMultiplier = config.gasPriceMultiplier ?? 0;
        this.chainProviders = config.chainProviders || this.getDefaultChainRpcProviders();
        this.contractAddresses = index_js_1.addresses[this.network];
        if (config.contractAddresses) {
            this.contractAddresses = config.contractAddresses;
        }
        this.l1ChainId = this.network === 'mainnet' ? 1 : 5;
    }
    getContractAddresses() {
        return this.contractAddresses;
    }
    setContractAddresses(contractAddresses) {
        this.contractAddresses = contractAddresses;
    }
    getDefaultChainRpcProvider(chainId) {
        chainId = chainId.toString();
        const chains = (0, sdk_1.getNetwork)(this.network).chains;
        for (const chainSlug in chains) {
            const item = chains[chainSlug]; // TODO: type
            if (item.chainId?.toString() === chainId) {
                return (0, sdk_1.getProviderFromUrl)(item.publicRpcUrl);
            }
        }
        throw new Error(`no default provider found for chainId "${chainId}"`);
    }
    getDefaultChainRpcProviders() {
        const defaultProviders = {};
        const chains = (0, sdk_1.getNetwork)(this.network).chains;
        for (const chainSlug in chains) {
            const item = chains[chainSlug]; // TODO: type
            defaultProviders[item.chainId?.toString()] = (0, sdk_1.getProviderFromUrl)(item.publicRpcUrl);
        }
        return defaultProviders;
    }
    connect(signer) {
        this.signer = signer;
        return this;
    }
    setChainRpcProvider(chainId, provider) {
        chainId = chainId.toString();
        if (!this.utils.isValidChainId(chainId)) {
            throw new Error(`unsupported chain "${chainId}" for network ${this.network}`);
        }
        this.chainProviders[chainId] = provider;
    }
    setChainRpcProviders(chainProviders) {
        for (const chainId in chainProviders) {
            if (!this.utils.isValidChainId(chainId)) {
                throw new Error(`unsupported chain "${chainId}" for network ${this.network}`);
            }
            this.chainProviders[chainId?.toString()] = chainProviders[chainId];
        }
    }
    setChainRpcProviderUrl(chainId, url) {
        chainId = chainId.toString();
        if (!this.utils.isValidChainId(chainId)) {
            throw new Error(`unsupported chain "${chainId}" for network ${this.network}`);
        }
        this.chainProviders[chainId] = (0, sdk_1.getProviderFromUrl)(url);
    }
    setChainRpcProviderUrls(chainProviders) {
        for (const chainId in chainProviders) {
            if (!this.utils.isValidChainId(chainId)) {
                throw new Error(`unsupported chain "${chainId}" for network ${this.network}`);
            }
            this.chainProviders[chainId?.toString()] = (0, sdk_1.getProviderFromUrl)(chainProviders[chainId]);
        }
    }
    getConfigAddress(chainId, key) {
        if (!chainId) {
            throw new Error('chainId is required');
        }
        const address = this.contractAddresses?.[chainId?.toString()]?.[key]; // TODO: fix type
        return address;
    }
    getConfigStartBlock(chainId) {
        if (!chainId) {
            throw new Error('chainId is required');
        }
        const startBlock = this.contractAddresses?.[chainId?.toString()]?.startBlock; // TODO: fix type
        return startBlock ?? 0;
    }
    getRpcProviderForChainId(chainId) {
        chainId = chainId.toString();
        if (!this.chainProviders[chainId]) {
            throw new Error(`provider not set for chain "${chainId}"`);
        }
        return this.chainProviders[chainId];
    }
    async getContractExists(address, provider) {
        if (!address) {
            throw new Error('address is required');
        }
        if (!this.utils.isValidAddress(address)) {
            throw new Error('invalid address');
        }
        if (!provider) {
            throw new Error('provider is required');
        }
        const code = await provider.getCode(address);
        if (!code) {
            return false;
        }
        return code !== '0x';
    }
    getSigner() {
        return this.signer ?? null;
    }
    async getSignerAddress() {
        if (this.signer) {
            return this.signer.getAddress();
        }
        return null;
    }
    async getSignerOrProvider(chainId, signer = this.signer) {
        if (!this.utils.isValidChainId(chainId)) {
            throw new Error(`invalid chainId "${chainId}"`);
        }
        chainId = chainId.toString();
        const provider = this.getRpcProviderForChainId(chainId);
        if (!signer) {
            return provider;
        }
        if (ethers_1.Signer.isSigner(signer)) {
            if (signer.provider) {
                const connectedChainId = (await signer.getChainId()).toString();
                if (connectedChainId !== chainId) {
                    if (!signer.provider) {
                        return signer.connect(provider);
                    }
                    return provider;
                }
                return signer;
            }
            else {
                return provider;
            }
        }
        else {
            const { chainId: signerChainId } = await signer.getNetwork();
            if (signerChainId.toString() !== chainId) {
                return provider;
            }
            return signer;
        }
    }
    async getTxOverrides(fromChainId, toChainId) {
        fromChainId = fromChainId.toString();
        toChainId = toChainId.toString();
        const txOptions = {};
        const provider = await this.getSignerOrProvider(fromChainId);
        if (this.gasPriceMultiplier > 0) {
            txOptions.gasPrice = await this.utils.getBumpedGasPrice(provider, this.gasPriceMultiplier);
        }
        // TODO get min gas price for chain
        const minGasPrice = 0;
        if (minGasPrice) {
            const currentGasPrice = await this.utils.getGasPrice(provider);
            const minGasPriceBn = ethers_1.BigNumber.from(minGasPrice);
            if (currentGasPrice.lte(minGasPriceBn)) {
                txOptions.gasPrice = minGasPriceBn;
            }
            else {
                txOptions.gasPrice = currentGasPrice;
            }
        }
        // TODO get min gas limit for chain
        const minGasLimit = 0;
        if (minGasLimit) {
            txOptions.gasLimit = ethers_1.BigNumber.from(minGasLimit);
        }
        return txOptions;
    }
    async sendTransaction(transactionRequest, chainId = transactionRequest?.chainId) {
        chainId = chainId?.toString();
        if (!chainId) {
            throw new Error('chainId is required in sendTransaction');
        }
        if (!transactionRequest.to) {
            throw new Error('tx "to" address is required');
        }
        if (!this.utils.isValidAddress(transactionRequest.to)) {
            throw new Error('invalid "to" address');
        }
        if (!this.signer.provider) {
            throw new Error('signer provider is required');
        }
        if (!this.signer) {
            throw new Error('signer is required');
        }
        await this.utils.switchChain(chainId, this.signer.provider);
        const signer = await this.getSignerOrProvider(chainId);
        if (!(ethers_1.Signer.isSigner(signer) && signer.provider)) {
            throw new Error(`signer not connected to required chain "${chainId}"`);
        }
        const contractExists = await this.getContractExists(transactionRequest.to, signer.provider);
        if (!contractExists) {
            throw new Error(`Contract "${transactionRequest.to}" does not exist on chain "${chainId}"`);
        }
        return signer.sendTransaction({ ...transactionRequest, chainId: Number(chainId?.toString()) });
    }
    get utils() {
        return {
            isValidObject: (obj) => {
                return obj instanceof Object && !Array.isArray(obj);
            },
            isValidChainId: (chainId) => {
                return this.contractAddresses[chainId?.toString()] != null;
            },
            isValidBytes32: (hash) => {
                if (typeof hash !== 'string') {
                    return false;
                }
                return hash.slice(0, 2) === '0x' && hash.length === 66;
            },
            isValidTxHash: (txHash) => {
                return this.utils.isValidBytes32(txHash);
            },
            isValidBytes: (bytes) => {
                return bytes.slice(0, 2) === '0x';
            },
            isValidAddress: (address) => {
                try {
                    address = checksumAddress(address);
                    if (address === ethers_1.constants.AddressZero) {
                        return false;
                    }
                    return true;
                }
                catch (err) {
                    return false;
                }
            },
            isValidFilterBlock: (blockTag) => {
                return blockTag === 'latest' || blockTag === 'pending' || blockTag === 'earliest' || Number(blockTag) >= 0;
            },
            isValidNumericValue: (value) => {
                if (ethers_1.BigNumber.isBigNumber(value)) {
                    return true;
                }
                return !isNaN(value);
            },
            getChainSlug: (chainId) => {
                const chainSlug = index_js_2.chainSlugMap[chainId.toString()];
                if (!chainSlug) {
                    throw new Error(`Invalid chain: ${chainId}`);
                }
                return chainSlug;
            },
            getBumpedGasPrice: async (provider, percent) => {
                const gasPrice = await this.utils.getGasPrice(provider);
                return gasPrice.mul(ethers_1.BigNumber.from(percent * 100)).div(ethers_1.BigNumber.from(100));
            },
            estimateGas: async (provider, tx) => {
                const gasLimit = await provider.estimateGas(tx);
                return gasLimit;
            },
            getGasPrice: (0, sdk_1.rateLimitRetry)(async (signerOrProvider) => {
                if (!signerOrProvider) {
                    throw new Error('expected signer or provider');
                }
                const gasPrice = await signerOrProvider.getGasPrice();
                return gasPrice;
            }),
            getConnectedChainId: async (provider) => {
                const network = await provider.getNetwork();
                return ethers_1.BigNumber.from(network.chainId);
            },
            switchChain: async (chainId, provider) => {
                chainId = ethers_1.BigNumber.from(chainId);
                try {
                    if (!provider) {
                        throw new Error('provider or signer is required');
                    }
                    const connectedChainId = await this.utils.getConnectedChainId(provider);
                    if (connectedChainId.toString() === chainId.toString()) {
                        return;
                    }
                    await provider.send('wallet_switchEthereumChain', [{ chainId: chainId.toHexString() }]); // TODO: type
                }
                catch (err) {
                    if (err.code === 4902) {
                        const chains = (0, sdk_1.getNetwork)(this.network).chains;
                        const chain = chains[this.utils.getChainSlug(chainId)];
                        if (chain) {
                            const nativeCurrency = chain?.nativeTokenSymbol;
                            await provider.send('wallet_addEthereumChain', [{
                                    chainId: chainId.toHexString(),
                                    chainName: this.utils.getChainSlug(chainId),
                                    nativeCurrency: {
                                        name: nativeCurrency,
                                        symbol: nativeCurrency,
                                        decimals: 18
                                    },
                                    rpcUrls: [chain.publicRpcUrl],
                                    blockExplorerUrls: chain.explorerUrls
                                }]);
                        }
                        else {
                            throw err;
                        }
                    }
                    else {
                        throw err;
                    }
                }
            },
            getTransactionHashExplorerUrl: (txHash, chainId) => {
                if (!this.utils.isValidChainId(chainId)) {
                    throw new Error(`invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidTxHash(txHash)) {
                    throw new Error(`invalid transaction hash "${txHash}"`);
                }
                return (0, index_js_2.getTxHashExplorerUrl)(this.network, chainId?.toString(), txHash);
            },
            getAddressExplorerUrl: (address, chainId) => {
                if (!this.utils.isValidChainId(chainId)) {
                    throw new Error(`invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidAddress(address)) {
                    throw new Error(`invalid address "${address}"`);
                }
                return (0, index_js_2.getAddressExplorerUrl)(this.network, chainId?.toString(), address);
            },
            getTokenExplorerUrl: (address, chainId) => {
                if (!this.utils.isValidChainId(chainId)) {
                    throw new Error(`invalid chainId "${chainId}"`);
                }
                if (!this.utils.isValidAddress(address)) {
                    throw new Error(`invalid address "${address}"`);
                }
                return (0, index_js_2.getTokenExplorerUrl)(this.network, chainId?.toString(), address);
            }
        };
    }
}
exports.Base = Base;
//# sourceMappingURL=Base.js.map