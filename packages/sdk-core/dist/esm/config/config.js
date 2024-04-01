import { addresses as chainAddresses } from '@hop-protocol/core/addresses';
import { networks as chainNetworks } from '@hop-protocol/core/networks';
import { chains as chainsMetadata, tokens as tokensMetadata } from '@hop-protocol/core/metadata';
import { config as coreConfig } from '@hop-protocol/core/config';
export const metadata = {
    networks: chainsMetadata,
    tokens: tokensMetadata
};
const bondableChainsSet = new Set([]);
const config = {};
for (const network in chainNetworks) {
    const chains = {};
    for (const chain in chainNetworks[network]) {
        const chainConfig = chainNetworks[network][chain];
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
    const addresses = chainAddresses[network].bridges;
    const bonders = chainAddresses[network].bonders;
    const bonderFeeBps = coreConfig[network].bonderFeeBps;
    const destinationFeeGasPriceMultiplier = coreConfig[network].destinationFeeGasPriceMultiplier;
    const relayerFeeEnabled = coreConfig[network].relayerFeeEnabled;
    const relayerFeeWei = coreConfig[network].relayerFeeWei;
    const bridgeDeprecated = coreConfig[network].bridgeDeprecated;
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
export const bondableChains = Array.from(bondableChainsSet);
export const rateLimitMaxRetries = 3;
export const rpcTimeoutSeconds = 60;
export { config };
//# sourceMappingURL=config.js.map