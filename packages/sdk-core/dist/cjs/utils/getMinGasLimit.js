"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinGasLimit = void 0;
const networks_1 = require("@hop-protocol/core/networks");
function getMinGasLimit(network, chain) {
    const networkObj = networks_1.networks[network];
    const chainObj = networkObj[chain];
    return chainObj?.txOverrides?.minGasLimit;
}
exports.getMinGasLimit = getMinGasLimit;
//# sourceMappingURL=getMinGasLimit.js.map