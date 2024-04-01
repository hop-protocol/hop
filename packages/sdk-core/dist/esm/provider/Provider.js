import { getProviderWithFallbacks } from '#utils/index.js';
import { providers } from 'ethers';
import { rateLimitRetry } from '#utils/index.js';
// reference: https://github.com/ethers-io/ethers.js/blob/b1458989761c11bf626591706aa4ce98dae2d6a9/packages/abstract-provider/src.ts/index.ts#L225
export class RetryProvider extends providers.StaticJsonRpcProvider {
    constructor() {
        super(...arguments);
        // Network
        this.getNetwork = rateLimitRetry(async () => {
            return super.getNetwork();
        });
        // Latest State
        this.getBlockNumber = rateLimitRetry(async () => {
            return super.getBlockNumber();
        });
        this.getGasPrice = rateLimitRetry(async () => {
            return super.getGasPrice();
        });
        // Account
        this.getBalance = rateLimitRetry(async (addressOrName, blockTag) => {
            return super.getBalance(addressOrName, blockTag);
        });
        this.getTransactionCount = rateLimitRetry(async (addressOrName, blockTag) => {
            return super.getTransactionCount(addressOrName, blockTag);
        });
        this.getCode = rateLimitRetry(async (addressOrName, blockTag) => {
            return super.getCode(addressOrName, blockTag);
        });
        this.getStorageAt = rateLimitRetry(async (addressOrName, position, blockTag) => {
            return super.getStorageAt(addressOrName, position, blockTag);
        });
        // Execution
        this.sendTransaction = rateLimitRetry(async (signedTransaction) => {
            return super.sendTransaction(signedTransaction);
        });
        this.call = rateLimitRetry(async (transaction, blockTag) => {
            return super.call(transaction, blockTag);
        });
        this.estimateGas = rateLimitRetry(async (transaction) => {
            return super.estimateGas(transaction);
        });
        // Queries
        this.getBlock = rateLimitRetry(async (blockHashOrBlockTag) => {
            return super.getBlock(blockHashOrBlockTag);
        });
        this.getBlockWithTransactions = rateLimitRetry(async (blockHashOrBlockTag) => {
            return super.getBlockWithTransactions(blockHashOrBlockTag);
        });
        this.getTransaction = rateLimitRetry(async (transactionHash) => {
            return super.getTransaction(transactionHash);
        });
        this.getTransactionReceipt = rateLimitRetry(async (transactionHash) => {
            return super.getTransactionReceipt(transactionHash);
        });
        // Bloom-filter Queries
        this.getLogs = rateLimitRetry(async (filter) => {
            return super.getLogs(filter);
        });
        // ENS
        this.resolveName = rateLimitRetry(async (name) => {
            return super.resolveName(name);
        });
        this.lookupAddress = rateLimitRetry(async (address) => {
            return super.lookupAddress(address);
        });
        this.getAvatar = rateLimitRetry(async (nameOrAddress) => {
            return (await super.getAvatar(nameOrAddress));
        });
    }
    async perform(method, params) {
        return super.perform(method, params);
    }
}
export class FallbackProvider {
    constructor(providers) {
        this._providersFn = [];
        this._providers = [];
        this.activeIndex = 0;
        this._isProvider = true;
        // Network
        this.getNetwork = async () => {
            return this.tryProvider(() => this.getActiveProvider().getNetwork());
        };
        // Latest State
        this.getBlockNumber = async () => {
            return this.tryProvider(() => this.getActiveProvider().getBlockNumber());
        };
        this.getGasPrice = async () => {
            return this.tryProvider(() => this.getActiveProvider().getGasPrice());
        };
        // Account
        this.getBalance = async (addressOrName, blockTag) => {
            return this.tryProvider(() => this.getActiveProvider().getBalance(addressOrName, blockTag));
        };
        this.getTransactionCount = async (addressOrName, blockTag) => {
            return this.tryProvider(() => this.getActiveProvider().getTransactionCount(addressOrName, blockTag));
        };
        this.getCode = async (addressOrName, blockTag) => {
            return this.tryProvider(() => this.getActiveProvider().getCode(addressOrName, blockTag));
        };
        this.getStorageAt = async (addressOrName, position, blockTag) => {
            return this.tryProvider(() => this.getActiveProvider().getStorageAt(addressOrName, position, blockTag));
        };
        // Execution
        this.sendTransaction = async (signedTransaction) => {
            return this.tryProvider(() => this.getActiveProvider().sendTransaction(signedTransaction));
        };
        this.call = async (transaction, blockTag) => {
            return this.tryProvider(() => this.getActiveProvider().call(transaction, blockTag));
        };
        this.estimateGas = async (transaction) => {
            return this.tryProvider(() => this.getActiveProvider().estimateGas(transaction));
        };
        // Queries
        this.getBlock = async (blockHashOrBlockTag) => {
            return this.tryProvider(() => this.getActiveProvider().getBlock(blockHashOrBlockTag));
        };
        this.getBlockWithTransactions = async (blockHashOrBlockTag) => {
            return this.tryProvider(() => this.getActiveProvider().getBlockWithTransactions(blockHashOrBlockTag));
        };
        this.getTransaction = async (transactionHash) => {
            return this.tryProvider(() => this.getActiveProvider().getTransaction(transactionHash));
        };
        this.getTransactionReceipt = async (transactionHash) => {
            return this.tryProvider(() => this.getActiveProvider().getTransactionReceipt(transactionHash));
        };
        // Bloom-filter Queries
        this.getLogs = async (filter) => {
            return this.tryProvider(() => this.getActiveProvider().getLogs(filter));
        };
        // ENS
        this.resolveName = async (name) => {
            return this.tryProvider(() => this.getActiveProvider().resolveName(name));
        };
        this.lookupAddress = async (address) => {
            return this.tryProvider(() => this.getActiveProvider().lookupAddress(address));
        };
        this._providersFn = providers;
    }
    static fromUrls(urls) {
        return getProviderWithFallbacks(urls);
    }
    get providers() {
        return this._providersFn.map((p) => {
            if (typeof p === 'function') {
                return p();
            }
            return p;
        });
    }
    get connection() {
        return this.getActiveProvider().connection;
    }
    getActiveProvider() {
        if (this._providers[this.activeIndex]) {
            return this._providers[this.activeIndex];
        }
        if (typeof this._providersFn[this.activeIndex] === 'function') {
            this._providers[this.activeIndex] = this._providersFn[this.activeIndex]();
        }
        else {
            this._providers[this.activeIndex] = this._providersFn[this.activeIndex];
        }
        return this._providers[this.activeIndex];
    }
    async tryProvider(fn) {
        return fn().catch((err) => {
            if (/(noNetwork|rate limit|SERVER_ERROR)/gi.test(err.message)) {
                // console.error('tryProvider error:', err)
                this.activeIndex = (this.activeIndex + 1) % this._providersFn.length;
                return fn();
            }
            throw err;
        });
    }
    getFeeData() {
        return this.tryProvider(() => this.getActiveProvider().getFeeData());
    }
    waitForTransaction(transactionHash, confirmations, timeout) {
        return this.getActiveProvider().waitForTransaction(transactionHash, confirmations, timeout);
    }
    on(eventName, listener) {
        this.getActiveProvider().on(eventName, listener);
        return this;
    }
    once(eventName, listener) {
        this.getActiveProvider().once(eventName, listener);
        return this;
    }
    emit(eventName, ...args) {
        return this.getActiveProvider().emit(eventName, ...args);
    }
    listenerCount(eventName) {
        return this.getActiveProvider().listenerCount(eventName);
    }
    listeners(eventName) {
        return this.getActiveProvider().listeners(eventName);
    }
    off(eventName, listener) {
        this.getActiveProvider().off(eventName, listener);
        return this;
    }
    removeAllListeners(eventName) {
        this.getActiveProvider().removeAllListeners(eventName);
        return this;
    }
    removeListener(eventName, listener) {
        this.getActiveProvider().removeListener(eventName, listener);
        return this;
    }
    addListener(eventName, listener) {
        this.getActiveProvider().addListener(eventName, listener);
        return this;
    }
    getAvatar(address) {
        return this.tryProvider(() => this.getActiveProvider().getAvatar(address));
    }
    async detectNetwork() {
        return this.tryProvider(() => this.getActiveProvider().detectNetwork());
    }
    getResolver(address) {
        return this.tryProvider(() => this.getActiveProvider().getResolver(address));
    }
}
//# sourceMappingURL=Provider.js.map