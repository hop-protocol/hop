"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = void 0;
const index_js_1 = require("#constants/index.js");
const utils_js_1 = require("ethers/lib/utils.js");
const index_js_2 = require("#config/index.js");
class TokenModel {
    constructor(chainId, address, decimals, symbol, name) {
        if (chainId) {
            this.chainId = Number(chainId);
        }
        if (address) {
            this.address = (0, utils_js_1.getAddress)(address);
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
            this.decimals = index_js_2.metadata.tokens[symbol]?.decimals;
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
        if (tokenSymbol === index_js_1.CanonicalToken.XDAI) {
            tokenSymbol = index_js_1.CanonicalToken.DAI;
        }
        return tokenSymbol;
    }
}
exports.TokenModel = TokenModel;
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