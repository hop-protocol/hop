import { TokenSymbol } from '#constants/index.js';
export declare class TokenModel {
    readonly chainId: number;
    readonly address: string;
    readonly decimals: number;
    readonly symbol: TokenSymbol;
    readonly name: TokenSymbol;
    static ETH: string;
    static WETH: string;
    static MATIC: string;
    static WMATIC: string;
    static XDAI: string;
    static WXDAI: string;
    static USDC: string;
    static USDT: string;
    static DAI: string;
    static WBTC: string;
    static sBTC: string;
    static sETH: string;
    static HOP: string;
    static OP: string;
    static SNX: string;
    static sUSD: string;
    static rETH: string;
    static UNI: string;
    static MAGIC: string;
    constructor(chainId: number | string, address: string, decimals: number, symbol: TokenSymbol, name: TokenSymbol);
    get canonicalSymbol(): string;
    static getCanonicalSymbol(tokenSymbol: TokenSymbol): string;
}
//# sourceMappingURL=Token.d.ts.map