"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEtherscanApiUrl = void 0;
const index_js_1 = require("#config/index.js");
function getEtherscanApiUrl(network, chain) {
    const url = index_js_1.config[network]?.chains?.[chain]?.etherscanApiUrl;
    if (!url) {
        throw new Error(`etherscan API url not found for chain ${chain}`);
    }
    return url;
}
exports.getEtherscanApiUrl = getEtherscanApiUrl;
//# sourceMappingURL=getEtherscanApiUrl.js.map