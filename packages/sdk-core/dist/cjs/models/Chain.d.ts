import { ChainName, Slug } from '../constants/index.js';
import { providers } from 'ethers';
export declare class Chain {
    chainId: number;
    name: ChainName | string;
    slug: Slug | string;
    provider: providers.Provider | null;
    isL1: boolean;
    nativeTokenSymbol: string;
    static Ethereum: Chain;
    static Optimism: Chain;
    static Arbitrum: Chain;
    static Gnosis: Chain;
    static Polygon: Chain;
    static Nova: Chain;
    static ZkSync: Chain;
    static Linea: Chain;
    static ScrollZk: Chain;
    static Base: Chain;
    static PolygonZk: Chain;
    static fromSlug(slug: Slug | string): Chain;
    constructor(name: ChainName | string, chainId?: number, provider?: providers.Provider);
    equals(other: Chain): boolean;
    get rpcUrl(): any;
}
//# sourceMappingURL=Chain.d.ts.map