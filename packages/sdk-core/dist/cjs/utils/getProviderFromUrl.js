"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderFromUrl = exports.getProviderWithFallbacks = void 0;
const index_js_1 = require("#provider/index.js");
const index_js_2 = require("#config/index.js");
function getProviderWithFallbacks(rpcUrls) {
    const timeout = index_js_2.rpcTimeoutSeconds * 1000;
    const throttleLimit = 1;
    const rpcProviders = [];
    // see this discussion as to why ethers fallback provider doesn't work as expected:
    // https://github.com/ethers-io/ethers.js/discussions/3500
    /*
    const stallTimeout = 2 * 1000
    const weight = 1
    const rpcProviders :any[] = []
    let priority = rpcUrls.length
    for (const url of rpcUrls) {
      const provider = new RetryProvider({
        url,
        timeout,
        throttleLimit,
        allowGzip: true
      })
      rpcProviders.push({
        provider,
        priority,
        weight,
        stallTimeout
      })
      priority--
    }
  
    const quorum = 1
    const provider = new providers.FallbackProvider(rpcProviders, quorum)
    */
    for (const url of rpcUrls) {
        const provider = () => new index_js_1.RetryProvider({
            url,
            timeout,
            throttleLimit,
            allowGzip: true
        });
        rpcProviders.push(provider);
    }
    const provider = new index_js_1.FallbackProvider(rpcProviders);
    return provider;
}
exports.getProviderWithFallbacks = getProviderWithFallbacks;
function getProviderFromUrl(rpcUrl) {
    const rpcUrls = Array.isArray(rpcUrl) ? rpcUrl : [rpcUrl];
    return getProviderWithFallbacks(rpcUrls);
    /*
    const timeout = rpcTimeoutSeconds * 1000
    const throttleLimit = 1
    const provider = new providers.StaticJsonRpcProvider({
      url: rpcUrls[0],
      timeout,
      throttleLimit,
      allowGzip: true
    })
    return provider
    */
}
exports.getProviderFromUrl = getProviderFromUrl;
//# sourceMappingURL=getProviderFromUrl.js.map