"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLpFeeBps = void 0;
const ethers_1 = require("ethers");
const index_js_1 = require("#models/index.js");
// TODO: This is a temporary solution. Should retrieve from onchain and cache value.
const defaultFeeBps = 4;
const customFeeBps = {
    [index_js_1.Chain.PolygonZk.slug]: 1,
    [index_js_1.Chain.Nova.slug]: 1
};
function getLpFeeBps(chain) {
    if (customFeeBps[chain.slug]) {
        return ethers_1.BigNumber.from(customFeeBps[chain.slug]);
    }
    return ethers_1.BigNumber.from(defaultFeeBps);
}
exports.getLpFeeBps = getLpFeeBps;
//# sourceMappingURL=getLpFeeBps.js.map