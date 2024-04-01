import { Contract, constants, providers } from 'ethers';
import { Interface, defaultAbiCoder, formatUnits } from 'ethers/lib/utils.js';
import { Multicall3 } from '@hop-protocol/core/abi';
import { PriceFeedFromS3 } from '#priceFeed/index.js';
import { erc20Abi } from '@hop-protocol/core/abi';
import { getTokenDecimals } from '#utils/index.js';
import { config as sdkConfig } from '#config/index.js';
export class Multicall {
    constructor(config) {
        if (!config) {
            throw new Error('config is required');
        }
        if (!config.network) {
            throw new Error('config.network is required');
        }
        this.network = config.network;
        this.accountAddress = config.accountAddress;
        this.priceFeed = new PriceFeedFromS3();
    }
    getMulticallAddressForChain(chainSlug) {
        const address = sdkConfig[this.network].chains?.[chainSlug]?.multicall;
        if (!address) {
            return null;
        }
        return address;
    }
    getProvider(chainSlug) {
        const rpcUrl = sdkConfig[this.network].chains?.[chainSlug]?.rpcUrl;
        if (!rpcUrl) {
            throw new Error(`rpcUrl not found for chain ${chainSlug}`);
        }
        const provider = new providers.JsonRpcProvider(rpcUrl);
        return provider;
    }
    getChains() {
        const chains = Object.keys(sdkConfig[this.network].chains);
        return chains;
    }
    getTokenAddressesForChain(chainSlug) {
        const tokenConfigs = sdkConfig[this.network]?.addresses;
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
            if (address === constants.AddressZero) {
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
            const contractInterface = new Interface(abi);
            const calldata = contractInterface.encodeFunctionData(method, args);
            return {
                target: address,
                callData: calldata
            };
        });
        let results;
        if (multicallAddress) {
            const multicallContract = new Contract(multicallAddress, Multicall3, provider);
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
            const contractInterface = new Interface(abi);
            for (const key in contractInterface.functions) {
                const _method = key.split('(')[0];
                if (_method === method) {
                    const returnTypes = contractInterface?.functions[key]?.outputs?.map((output) => output.type);
                    const returnValues = defaultAbiCoder.decode(returnTypes, returnData);
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
            const tokenContract = new Contract(address, abi ?? erc20Abi, provider);
            const balanceMethod = method ?? 'balanceOf';
            return {
                target: address,
                callData: tokenContract.interface.encodeFunctionData(balanceMethod, [this.accountAddress])
            };
        });
        let results;
        if (multicallAddress) {
            const multicallContract = new Contract(multicallAddress, Multicall3, provider);
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
                const balance = defaultAbiCoder.decode(['uint256'], returnData)[0];
                const _tokenDecimals = tokenDecimals ?? getTokenDecimals(tokenSymbol);
                const balanceFormatted = Number(formatUnits(balance, _tokenDecimals));
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
//# sourceMappingURL=Multicall.js.map