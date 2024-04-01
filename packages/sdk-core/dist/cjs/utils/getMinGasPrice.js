"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinGasPrice = void 0;
const networks_1 = require("@hop-protocol/core/networks");
function getMinGasPrice(network, chain) {
    const networkObj = networks_1.networks[network];
    const chainObj = networkObj[chain];
    return chainObj?.txOverrides?.minGasPrice;
}
exports.getMinGasPrice = getMinGasPrice;
//# sourceMappingURL=getMinGasPrice.js.map