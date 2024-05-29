"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressExplorerUrl = void 0;
const getExplorerUrl_js_1 = require("./getExplorerUrl.js");
function getAddressExplorerUrl(network, chainId, address) {
    const baseUrl = (0, getExplorerUrl_js_1.getExplorerUrl)(network, chainId);
    return `${baseUrl}/address/${address}`;
}
exports.getAddressExplorerUrl = getAddressExplorerUrl;
//# sourceMappingURL=getAddressExplorerUrl.js.map