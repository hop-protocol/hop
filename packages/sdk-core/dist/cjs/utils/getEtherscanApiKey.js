"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEtherscanApiKey = void 0;
function getEtherscanApiKey(network, chain) {
    return process.env[`ETHERSCAN_${chain.toUpperCase()}_API_KEY`] ?? '';
}
exports.getEtherscanApiKey = getEtherscanApiKey;
//# sourceMappingURL=getEtherscanApiKey.js.map