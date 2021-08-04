export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    image: string;
}
export interface Tokens {
    [key: string]: Token;
}
export interface Chain {
    name: string;
    slug: string;
}
export interface Chains {
    [key: string]: Chain;
}
//# sourceMappingURL=types.d.ts.map