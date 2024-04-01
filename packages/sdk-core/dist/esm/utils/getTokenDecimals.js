import { tokens as tokensMetadata } from '@hop-protocol/core/metadata';
export function getTokenDecimals(tokenSymbol) {
    const token = tokensMetadata[tokenSymbol];
    if (!token) {
        throw new Error(`could not find token: ${tokenSymbol}`);
    }
    return token.decimals;
}
//# sourceMappingURL=getTokenDecimals.js.map