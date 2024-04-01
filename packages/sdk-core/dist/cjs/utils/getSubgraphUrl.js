"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubgraphUrl = void 0;
const index_js_1 = require("#config/index.js");
function getSubgraphUrl(network, chain) {
    if (!index_js_1.config[network]) {
        throw new Error(`config for network ${network} not found`);
    }
    const url = index_js_1.config[network]?.chains?.[chain]?.subgraphUrl;
    if (!url) {
        throw new Error(`subgraph url not found for chain ${chain}`);
    }
    return url;
}
exports.getSubgraphUrl = getSubgraphUrl;
//# sourceMappingURL=getSubgraphUrl.js.map