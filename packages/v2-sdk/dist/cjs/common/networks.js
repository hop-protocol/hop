"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networks = void 0;
const sdk_1 = require("@hop-protocol/sdk");
exports.networks = {};
const allNetworks = (0, sdk_1.getNetworks)();
allNetworks.forEach(network => {
    exports.networks[network.slug] = {};
    for (const chainSlug in network.chains) {
        const chain = network.chains[chainSlug]; // TODO: fix type
        exports.networks[network.slug][chain.chainId] = {
            name: chain.name,
            chainId: chain.chainId,
            publicRpcUrl: chain.publicRpcUrl,
            fallbackPublicRpcUrls: chain.fallbackPublicRpcUrls,
            explorerUrls: chain.explorerUrls,
            nativeBridgeUrl: chain.nativeBridgeUrl
        };
    }
});
//# sourceMappingURL=networks.js.map