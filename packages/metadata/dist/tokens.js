"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = void 0;
const assets_1 = require("./assets");
exports.tokens = {
    DAI: {
        symbol: 'DAI',
        name: 'DAI Stablecoin',
        decimals: 18,
        image: assets_1.DAIImage
    },
    ARB: {
        symbol: 'ARB',
        name: 'ARB Token',
        decimals: 18,
        image: assets_1.ARBImage
    },
    sETH: {
        symbol: 'sETH',
        name: 'Synth ETH',
        decimals: 18,
        image: assets_1.sETHImage
    },
    sBTC: {
        symbol: 'sBTC',
        name: 'Synth BTC',
        decimals: 18,
        image: assets_1.sBTCImage
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        image: assets_1.USDCImage
    },
    USDT: {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        image: assets_1.USDTImage
    },
    WBTC: {
        symbol: 'WBTC',
        name: 'Wrapped BTC',
        decimals: 18,
        image: assets_1.WBTCImage
    }
};
