"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const index_js_1 = require("../constants/index.js");
const index_js_2 = require("../utils/index.js");
const networks_1 = require("@hop-protocol/core/networks");
const index_js_3 = require("../config/index.js");
class Chain {
    static fromSlug(slug) {
        if (slug === 'xdai') {
            console.warn(index_js_1.Errors.xDaiRebrand);
            slug = 'gnosis';
        }
        return newChain(slug);
    }
    constructor(name, chainId, provider) {
        this.name = '';
        this.slug = '';
        this.provider = null;
        this.isL1 = false;
        this.name = name;
        this.slug = (0, index_js_2.getChainSlugFromName)(name);
        if (this.slug === index_js_1.ChainSlug.Ethereum) {
            this.isL1 = true;
        }
        if (chainId) {
            this.chainId = chainId;
        }
        if (provider) {
            this.provider = provider;
        }
        this.nativeTokenSymbol = index_js_3.metadata.networks[this.slug]?.nativeTokenSymbol;
        if (!this.nativeTokenSymbol) {
            throw new Error(`nativeTokenSymbol not found for chain "${name}", slug "${this.slug}"`);
        }
    }
    equals(other) {
        return this.slug === other.slug;
    }
    get rpcUrl() {
        return this.provider?.connection?.url;
    }
}
exports.Chain = Chain;
Chain.Ethereum = newChain(index_js_1.ChainSlug.Ethereum, networks_1.mainnet.ethereum.networkId);
Chain.Optimism = newChain(index_js_1.ChainSlug.Optimism, networks_1.mainnet.optimism.networkId);
Chain.Arbitrum = newChain(index_js_1.ChainSlug.Arbitrum, networks_1.mainnet.arbitrum.networkId);
Chain.Gnosis = newChain(index_js_1.ChainSlug.Gnosis, networks_1.mainnet.gnosis.networkId);
Chain.Polygon = newChain(index_js_1.ChainSlug.Polygon, networks_1.mainnet.polygon.networkId);
Chain.Nova = newChain(index_js_1.ChainSlug.Nova, networks_1.mainnet.nova.networkId);
Chain.ZkSync = newChain(index_js_1.ChainSlug.ZkSync, networks_1.mainnet.zksync?.networkId ?? networks_1.goerli.zksync?.networkId);
Chain.Linea = newChain(index_js_1.ChainSlug.Linea, networks_1.mainnet.linea?.networkId ?? networks_1.goerli.linea?.networkId);
Chain.ScrollZk = newChain(index_js_1.ChainSlug.ScrollZk, networks_1.mainnet.scrollzk?.networkId ?? networks_1.goerli.scrollzk?.networkId);
Chain.Base = newChain(index_js_1.ChainSlug.Base, networks_1.mainnet.base?.networkId ?? networks_1.goerli.base?.networkId);
Chain.PolygonZk = newChain(index_js_1.ChainSlug.PolygonZk, networks_1.mainnet.polygonzk?.networkId ?? networks_1.goerli.polygonzk?.networkId);
function newChain(chain, chainId) {
    if (chain === index_js_1.NetworkSlug.Mainnet ||
        chain === index_js_1.NetworkSlug.Goerli) {
        chain = index_js_1.ChainSlug.Ethereum;
    }
    if (!index_js_3.metadata.networks[chain]) {
        throw new Error(`unsupported chain "${chain}"`);
    }
    return new Chain(index_js_3.metadata.networks[chain].name, chainId);
}
//# sourceMappingURL=Chain.js.map