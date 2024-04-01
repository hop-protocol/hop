"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainSlugFromName = void 0;
const index_js_1 = require("#constants/index.js");
function getChainSlugFromName(name) {
    let slug = (name || '').trim().toLowerCase().split(' ')[0];
    if ((name || '').trim().toLowerCase().startsWith('arbitrum one')) {
        slug = index_js_1.ChainSlug.Arbitrum;
    }
    if ((name || '').trim().toLowerCase().startsWith('arbitrum nova')) {
        slug = index_js_1.ChainSlug.Nova;
    }
    if ((name || '').trim().toLowerCase().startsWith('polygon zk')) {
        slug = index_js_1.ChainSlug.PolygonZk;
    }
    if (slug.startsWith('consensys') || slug.startsWith('linea')) {
        slug = index_js_1.ChainSlug.Linea;
    }
    if (slug.startsWith('xdai')) {
        slug = index_js_1.ChainSlug.Gnosis;
    }
    if (slug.startsWith('scroll')) {
        slug = index_js_1.ChainSlug.ScrollZk;
    }
    if (slug.startsWith('base')) {
        slug = index_js_1.ChainSlug.Base;
    }
    if (slug === index_js_1.NetworkSlug.Goerli ||
        slug === index_js_1.NetworkSlug.Sepolia ||
        slug === index_js_1.NetworkSlug.Mainnet ||
        slug === index_js_1.ChainSlug.Ethereum) {
        slug = index_js_1.ChainSlug.Ethereum;
    }
    return slug;
}
exports.getChainSlugFromName = getChainSlugFromName;
//# sourceMappingURL=getChainSlugFromName.js.map