"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = void 0;
const networks_js_1 = require("#common/networks.js");
const ethers_1 = require("ethers");
function getProvider(network, chainId) {
    const rpcUrl = networks_js_1.networks[network]?.[chainId]?.publicRpcUrl;
    if (!rpcUrl) {
        throw new Error(`Invalid network ${network} or chainId: ${chainId}, rpcUrl not found`);
    }
    return new ethers_1.providers.JsonRpcProvider(rpcUrl);
}
exports.getProvider = getProvider;
//# sourceMappingURL=getProvider.js.map