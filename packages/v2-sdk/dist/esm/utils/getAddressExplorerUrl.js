import { getExplorerUrl } from './getExplorerUrl.js';
export function getAddressExplorerUrl(network, chainId, address) {
    const baseUrl = getExplorerUrl(network, chainId);
    return `${baseUrl}/address/${address}`;
}
//# sourceMappingURL=getAddressExplorerUrl.js.map