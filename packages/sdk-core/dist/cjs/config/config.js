"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.rpcTimeoutSeconds = exports.rateLimitMaxRetries = exports.bondableChains = exports.metadata = void 0;
const addresses_1 = require("@hop-protocol/core/addresses");
const networks_1 = require("@hop-protocol/core/networks");
const metadata_1 = require("@hop-protocol/core/metadata");
const config_1 = require("@hop-protocol/core/config");
exports.metadata = {
    networks: metadata_1.chains,
    tokens: metadata_1.tokens
};
const bondableChainsSet = new Set([]);
const config = {};
exports.config = config;
for (const network in networks_1.networks) {
    const chains = {};
    for (const chain in networks_1.networks[network]) {
        const chainConfig = networks_1.networks[network][chain];
        if (!chains[chain]) {
            chains[chain] = {};
        }
        chains[chain].name = chainConfig?.name;
        chains[chain].chainId = chainConfig?.networkId;
        chains[chain].rpcUrl = chainConfig?.publicRpcUrl;
        chains[chain].explorerUrl = chainConfig?.explorerUrls?.[0];
        chains[chain].fallbackRpcUrls = chainConfig?.fallbackPublicRpcUrls ?? [];
        chains[chain].etherscanApiUrl = chainConfig?.etherscanApiUrl ?? '';
        chains[chain].subgraphUrl = chainConfig?.subgraphUrl;
        chains[chain].multicall = chainConfig?.multicall;
        if (chainConfig?.isRollup) {
            bondableChainsSet.add(chain);
        }
    }
    const addresses = addresses_1.addresses[network].bridges;
    const bonders = addresses_1.addresses[network].bonders;
    const bonderFeeBps = config_1.config[network].bonderFeeBps;
    const destinationFeeGasPriceMultiplier = config_1.config[network].destinationFeeGasPriceMultiplier;
    const relayerFeeEnabled = config_1.config[network].relayerFeeEnabled;
    const relayerFeeWei = config_1.config[network].relayerFeeWei;
    const bridgeDeprecated = config_1.config[network].bridgeDeprecated;
    config[network] = {
        addresses,
        chains,
        bonders,
        bonderFeeBps,
        destinationFeeGasPriceMultiplier,
        relayerFeeEnabled,
        relayerFeeWei,
        bridgeDeprecated
    };
}
exports.bondableChains = Array.from(bondableChainsSet);
exports.rateLimitMaxRetries = 3;
exports.rpcTimeoutSeconds = 60;
//# sourceMappingURL=config.js.map