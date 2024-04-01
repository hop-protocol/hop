"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainIdToSlug = void 0;
const networks_1 = require("@hop-protocol/core/networks");
function chainIdToSlug(network, chainId) {
    if (chainId === undefined) {
        return '';
    }
    if (typeof chainId === 'number') {
        chainId = chainId.toString();
    }
    for (const _network in networks_1.networks) {
        const chains = networks_1.networks[_network];
        for (const chainSlug in chains) {
            const chainObj = chains[chainSlug];
            if (chainObj.networkId.toString() === chainId) {
                return chainSlug;
            }
        }
    }
    return '';
}
exports.chainIdToSlug = chainIdToSlug;
//# sourceMappingURL=chainIdToSlug.js.map