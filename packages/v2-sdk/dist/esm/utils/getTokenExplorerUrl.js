import { getExplorerUrl } from './getExplorerUrl.js';
export function getTokenExplorerUrl(network, chainId, address) {
    const baseUrl = getExplorerUrl(network, chainId);
    return `${baseUrl}/token/${address}`;
}
//# sourceMappingURL=getTokenExplorerUrl.js.map