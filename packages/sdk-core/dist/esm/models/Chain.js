import { ChainSlug, Errors, NetworkSlug } from '../constants/index.js';
import { getChainSlugFromName } from '../utils/index.js';
import { goerli, mainnet } from '@hop-protocol/core/networks';
import { metadata } from '../config/index.js';
export class Chain {
    static fromSlug(slug) {
        if (slug === 'xdai') {
            console.warn(Errors.xDaiRebrand);
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
        this.slug = getChainSlugFromName(name);
        if (this.slug === ChainSlug.Ethereum) {
            this.isL1 = true;
        }
        if (chainId) {
            this.chainId = chainId;
        }
        if (provider) {
            this.provider = provider;
        }
        this.nativeTokenSymbol = metadata.networks[this.slug]?.nativeTokenSymbol;
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
Chain.Ethereum = newChain(ChainSlug.Ethereum, mainnet.ethereum.networkId);
Chain.Optimism = newChain(ChainSlug.Optimism, mainnet.optimism.networkId);
Chain.Arbitrum = newChain(ChainSlug.Arbitrum, mainnet.arbitrum.networkId);
Chain.Gnosis = newChain(ChainSlug.Gnosis, mainnet.gnosis.networkId);
Chain.Polygon = newChain(ChainSlug.Polygon, mainnet.polygon.networkId);
Chain.Nova = newChain(ChainSlug.Nova, mainnet.nova.networkId);
Chain.ZkSync = newChain(ChainSlug.ZkSync, mainnet.zksync?.networkId ?? goerli.zksync?.networkId);
Chain.Linea = newChain(ChainSlug.Linea, mainnet.linea?.networkId ?? goerli.linea?.networkId);
Chain.ScrollZk = newChain(ChainSlug.ScrollZk, mainnet.scrollzk?.networkId ?? goerli.scrollzk?.networkId);
Chain.Base = newChain(ChainSlug.Base, mainnet.base?.networkId ?? goerli.base?.networkId);
Chain.PolygonZk = newChain(ChainSlug.PolygonZk, mainnet.polygonzk?.networkId ?? goerli.polygonzk?.networkId);
function newChain(chain, chainId) {
    if (chain === NetworkSlug.Mainnet ||
        chain === NetworkSlug.Goerli) {
        chain = ChainSlug.Ethereum;
    }
    if (!metadata.networks[chain]) {
        throw new Error(`unsupported chain "${chain}"`);
    }
    return new Chain(metadata.networks[chain].name, chainId);
}
//# sourceMappingURL=Chain.js.map