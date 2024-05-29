import { getNetworks } from '@hop-protocol/sdk';
export const networks = {};
const allNetworks = getNetworks();
allNetworks.forEach(network => {
    networks[network.slug] = {};
    for (const chainSlug in network.chains) {
        const chain = network.chains[chainSlug]; // TODO: fix type
        networks[network.slug][chain.chainId] = {
            name: chain.name,
            chainId: chain.chainId,
            publicRpcUrl: chain.publicRpcUrl,
            fallbackPublicRpcUrls: chain.fallbackPublicRpcUrls,
            explorerUrls: chain.explorerUrls,
            nativeBridgeUrl: chain.nativeBridgeUrl
        };
    }
});
//# sourceMappingURL=networks.js.map