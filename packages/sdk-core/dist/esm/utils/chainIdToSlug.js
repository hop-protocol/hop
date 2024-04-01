import { networks } from '@hop-protocol/core/networks';
export function chainIdToSlug(network, chainId) {
    if (chainId === undefined) {
        return '';
    }
    if (typeof chainId === 'number') {
        chainId = chainId.toString();
    }
    for (const _network in networks) {
        const chains = networks[_network];
        for (const chainSlug in chains) {
            const chainObj = chains[chainSlug];
            if (chainObj.networkId.toString() === chainId) {
                return chainSlug;
            }
        }
    }
    return '';
}
//# sourceMappingURL=chainIdToSlug.js.map