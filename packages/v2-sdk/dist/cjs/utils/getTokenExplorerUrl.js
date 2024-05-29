"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenExplorerUrl = void 0;
const getExplorerUrl_js_1 = require("./getExplorerUrl.js");
function getTokenExplorerUrl(network, chainId, address) {
    const baseUrl = (0, getExplorerUrl_js_1.getExplorerUrl)(network, chainId);
    return `${baseUrl}/token/${address}`;
}
exports.getTokenExplorerUrl = getTokenExplorerUrl;
//# sourceMappingURL=getTokenExplorerUrl.js.map