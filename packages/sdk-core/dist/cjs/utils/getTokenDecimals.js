"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenDecimals = void 0;
const metadata_1 = require("@hop-protocol/core/metadata");
function getTokenDecimals(tokenSymbol) {
    const token = metadata_1.tokens[tokenSymbol];
    if (!token) {
        throw new Error(`could not find token: ${tokenSymbol}`);
    }
    return token.decimals;
}
exports.getTokenDecimals = getTokenDecimals;
//# sourceMappingURL=getTokenDecimals.js.map