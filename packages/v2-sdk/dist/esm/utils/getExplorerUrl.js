import { networks } from '#common/networks.js';
export function getExplorerUrl(network, chainId) {
    const url = networks[network]?.[chainId]?.explorerUrls?.[0];
    if (!url) {
        throw new Error(`Invalid network ${network} or chainId: ${chainId}, explorer url not found`);
    }
    return url;
}
//# sourceMappingURL=getExplorerUrl.js.map