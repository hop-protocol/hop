"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    bonderFeeBps: {
        USDC: {
            ethereum: 14,
            polygon: 14,
            xdai: 25,
            optimism: 14,
            arbitrum: 14
        },
        USDT: {
            ethereum: 23,
            polygon: 23,
            xdai: 25,
            optimism: 23,
            arbitrum: 23
        },
        DAI: {
            ethereum: 23,
            polygon: 23,
            xdai: 25,
            optimism: 23,
            arbitrum: 23
        },
        MATIC: {
            ethereum: 20,
            polygon: 20,
            xdai: 25,
            optimism: 0,
            arbitrum: 0
        },
        ETH: {
            ethereum: 6,
            polygon: 6,
            xdai: 18,
            optimism: 6,
            arbitrum: 6
        },
        WBTC: {
            ethereum: 23,
            polygon: 23,
            xdai: 25,
            optimism: 23,
            arbitrum: 23
        }
    },
    destinationFeeGasPriceMultiplier: 1.2
};
