"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorerUrl = void 0;
const networks_js_1 = require("#common/networks.js");
function getExplorerUrl(network, chainId) {
    const url = networks_js_1.networks[network]?.[chainId]?.explorerUrls?.[0];
    if (!url) {
        throw new Error(`Invalid network ${network} or chainId: ${chainId}, explorer url not found`);
    }
    return url;
}
exports.getExplorerUrl = getExplorerUrl;
//# sourceMappingURL=getExplorerUrl.js.map