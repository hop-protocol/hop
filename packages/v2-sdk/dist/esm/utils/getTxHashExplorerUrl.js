import { getExplorerUrl } from './getExplorerUrl.js';
export function getTxHashExplorerUrl(network, chainId, txHash) {
    const baseUrl = getExplorerUrl(network, chainId);
    return `${baseUrl}/tx/${txHash}`;
}
//# sourceMappingURL=getTxHashExplorerUrl.js.map