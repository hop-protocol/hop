"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxHashExplorerUrl = void 0;
const getExplorerUrl_js_1 = require("./getExplorerUrl.js");
function getTxHashExplorerUrl(network, chainId, txHash) {
    const baseUrl = (0, getExplorerUrl_js_1.getExplorerUrl)(network, chainId);
    return `${baseUrl}/tx/${txHash}`;
}
exports.getTxHashExplorerUrl = getTxHashExplorerUrl;
//# sourceMappingURL=getTxHashExplorerUrl.js.map