"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubgraphChains = void 0;
const index_js_1 = require("#config/index.js");
function getSubgraphChains(network) {
    const networks = index_js_1.config[network]?.chains;
    const chains = new Set([]);
    for (const chain in networks) {
        if (networks[chain]?.subgraphUrl) {
            chains.add(chain);
        }
    }
    return Array.from(chains);
}
exports.getSubgraphChains = getSubgraphChains;
//# sourceMappingURL=getSubgraphChains.js.map