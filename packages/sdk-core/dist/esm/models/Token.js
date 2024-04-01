import { CanonicalToken } from '#constants/index.js';
import { getAddress } from 'ethers/lib/utils.js';
import { metadata } from '#config/index.js';
export class TokenModel {
    constructor(chainId, address, decimals, symbol, name) {
        if (chainId) {
            this.chainId = Number(chainId);
        }
        if (address) {
            this.address = getAddress(address);
        }
        if (symbol) {
            this.symbol = symbol;
        }
        if (name) {
            this.name = name;
        }
        else if (symbol) {
            this.name = symbol;
        }
        if (decimals) {
            this.decimals = decimals;
        }
        if (!decimals && symbol) {
            this.decimals = metadata.tokens[symbol]?.decimals;
        }
    }
    get canonicalSymbol() {
        return TokenModel.getCanonicalSymbol(this.symbol);
    }
    static getCanonicalSymbol(tokenSymbol) {
        const isWrappedToken = [TokenModel.WETH, TokenModel.WMATIC, TokenModel.WXDAI].includes(tokenSymbol);
        if (isWrappedToken) {
            tokenSymbol = tokenSymbol.replace(/^W/, '');
        }
        if (tokenSymbol === CanonicalToken.XDAI) {
            tokenSymbol = CanonicalToken.DAI;
        }
        return tokenSymbol;
    }
}
TokenModel.ETH = 'ETH';
TokenModel.WETH = 'WETH';
TokenModel.MATIC = 'MATIC';
TokenModel.WMATIC = 'WMATIC';
TokenModel.XDAI = 'XDAI';
TokenModel.WXDAI = 'WXDAI';
TokenModel.USDC = 'USDC';
TokenModel.USDT = 'USDT';
TokenModel.DAI = 'DAI';
TokenModel.WBTC = 'WBTC';
TokenModel.sBTC = 'sBTC';
TokenModel.sETH = 'sETH';
TokenModel.HOP = 'HOP';
TokenModel.OP = 'OP';
TokenModel.SNX = 'SNX';
TokenModel.sUSD = 'sUSD';
TokenModel.rETH = 'rETH';
TokenModel.UNI = 'UNI';
TokenModel.MAGIC = 'MAGIC';
//# sourceMappingURL=Token.js.map