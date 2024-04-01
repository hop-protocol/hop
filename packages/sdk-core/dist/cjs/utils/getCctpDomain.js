"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCctpDomain = void 0;
const map = {
    ethereum: 0,
    optimism: 2,
    arbitrum: 3,
    base: 6,
    polygon: 7
};
function getCctpDomain(chainSlug) {
    const domain = map[chainSlug];
    if (domain == null) {
        throw new Error(`Unknown domain for chain slug: ${chainSlug}`);
    }
    return domain;
}
exports.getCctpDomain = getCctpDomain;
//# sourceMappingURL=getCctpDomain.js.map