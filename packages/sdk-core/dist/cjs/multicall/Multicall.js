"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multicall = void 0;
const ethers_1 = require("ethers");
const utils_js_1 = require("ethers/lib/utils.js");
const abi_1 = require("@hop-protocol/core/abi");
const index_js_1 = require("#priceFeed/index.js");
const abi_2 = require("@hop-protocol/core/abi");
const index_js_2 = require("#utils/index.js");
const index_js_3 = require("#config/index.js");
class Multicall {
    constructor(config) {
        if (!config) {
            throw new Error('config is required');
        }
        if (!config.network) {
            throw new Error('config.network is required');
        }
        this.network = config.network;
        this.accountAddress = config.accountAddress;
        this.priceFeed = new index_js_1.PriceFeedFromS3();
    }
    getMulticallAddressForChain(chainSlug) {
        const address = index_js_3.config[this.network].chains?.[chainSlug]?.multicall;
        if (!address) {
            return null;
        }
        return address;
    }
    getProvider(chainSlug) {
        const rpcUrl = index_js_3.config[this.network].chains?.[chainSlug]?.rpcUrl;
        if (!rpcUrl) {
            throw new Error(`rpcUrl not found for chain ${chainSlug}`);
        }
        const provider = new ethers_1.providers.JsonRpcProvider(rpcUrl);
        return provider;
    }
    getChains() {
        const chains = Object.keys(index_js_3.config[this.network].chains);
        return chains;
    }
    getTokenAddressesForChain(chainSlug) {
        const tokenConfigs = index_js_3.config[this.network]?.addresses;
        const addresses = [];
        for (const tokenSymbol in tokenConfigs) {
            const chainConfig = tokenConfigs[tokenSymbol]?.[chainSlug];
            if (!chainConfig) {
                continue;
            }
            const address = chainConfig?.l2CanonicalToken ?? chainConfig?.l1CanonicalToken;
            if (!address) {
                throw new Error(`canonicalToken not found for chain ${chainSlug}`);
            }
            if (address === ethers_1.constants.AddressZero) {
                continue;
            }
            addresses.push({
                tokenSymbol,
                address
            });
        }
        return addresses;
    }
    async getBalances() {
        const chains = this.getChains();
        const promises = [];
        for (const chain of chains) {
            promises.push(this.getBalancesForChain(chain));
        }
        const balances = await Promise.all(promises);
        return balances.flat();
    }
    async multicall(chainSlug, options) {
        const provider = this.getProvider(chainSlug);
        const multicallAddress = this.getMulticallAddressForChain(chainSlug);
        const calls = options.map(({ address, abi, method, args }) => {
            const contractInterface = new utils_js_1.Interface(abi);
            const calldata = contractInterface.encodeFunctionData(method, args);
            return {
                target: address,
                callData: calldata
            };
        });
        let results;
        if (multicallAddress) {
            const multicallContract = new ethers_1.Contract(multicallAddress, abi_1.Multicall3, provider);
            results = await multicallContract.callStatic.aggregate3(calls);
        }
        else {
            results = await Promise.all(calls.map(async ({ target, callData }) => {
                const result = await provider.call({ to: target, data: callData });
                return result;
            }));
        }
        const parsed = results.map((data, index) => {
            let returnData = data;
            if (multicallAddress) {
                returnData = data.returnData;
            }
            const { abi, method } = options[index];
            const contractInterface = new utils_js_1.Interface(abi);
            for (const key in contractInterface.functions) {
                const _method = key.split('(')[0];
                if (_method === method) {
                    const returnTypes = contractInterface?.functions[key]?.outputs?.map((output) => output.type);
                    const returnValues = utils_js_1.defaultAbiCoder.decode(returnTypes, returnData);
                    return returnValues;
                }
            }
            return null;
        });
        return parsed;
    }
    async getBalancesForChain(chainSlug, opts) {
        if (!this.accountAddress) {
            throw new Error('config.accountAddress is required');
        }
        const provider = this.getProvider(chainSlug);
        const multicallAddress = this.getMulticallAddressForChain(chainSlug);
        const tokenAddresses = Array.isArray(opts) ? opts : this.getTokenAddressesForChain(chainSlug);
        const calls = tokenAddresses.map(({ address, abi, method }) => {
            const tokenContract = new ethers_1.Contract(address, abi ?? abi_2.erc20Abi, provider);
            const balanceMethod = method ?? 'balanceOf';
            return {
                target: address,
                callData: tokenContract.interface.encodeFunctionData(balanceMethod, [this.accountAddress])
            };
        });
        let results;
        if (multicallAddress) {
            const multicallContract = new ethers_1.Contract(multicallAddress, abi_1.Multicall3, provider);
            results = await multicallContract.callStatic.aggregate3(calls);
        }
        else {
            results = await Promise.all(calls.map(async ({ target, callData }) => {
                const result = await provider.call({ to: target, data: callData });
                return result;
            }));
        }
        const balancePromises = results.map(async (data, index) => {
            let returnData = data;
            if (multicallAddress) {
                returnData = data.returnData;
            }
            const { tokenSymbol, address, tokenDecimals } = tokenAddresses[index];
            try {
                const balance = utils_js_1.defaultAbiCoder.decode(['uint256'], returnData)[0];
                const _tokenDecimals = tokenDecimals ?? (0, index_js_2.getTokenDecimals)(tokenSymbol);
                const balanceFormatted = Number((0, utils_js_1.formatUnits)(balance, _tokenDecimals));
                const tokenPrice = opts ? null : await this.priceFeed.getPriceByTokenSymbol(tokenSymbol); // don't fetch usd price if using custom abi
                const balanceUsd = tokenPrice ? balanceFormatted * tokenPrice : null;
                return {
                    tokenSymbol,
                    address,
                    chainSlug,
                    balance,
                    balanceFormatted,
                    balanceUsd,
                    tokenPrice
                };
            }
            catch (err) {
                return {
                    tokenSymbol,
                    address,
                    chainSlug,
                    error: err.message
                };
            }
        });
        const balances = await Promise.all(balancePromises);
        return balances;
    }
}
exports.Multicall = Multicall;
//# sourceMappingURL=Multicall.js.map