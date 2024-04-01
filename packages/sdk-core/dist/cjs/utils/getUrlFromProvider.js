"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlFromProvider = void 0;
function getUrlFromProvider(provider) {
    const rpcUrl = provider?.connection?.url ?? provider.providers?.[0]?.connection?.url ?? '';
    return rpcUrl;
}
exports.getUrlFromProvider = getUrlFromProvider;
//# sourceMappingURL=getUrlFromProvider.js.map