"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networks = void 0;
const metadata_1 = require("@hop-protocol/metadata");
exports.networks = {
    ethereum: {
        name: metadata_1.chains.ethereum.name,
        networkId: 1,
        rpcUrls: ['https://mainnet.rpc.hop.exchange'],
        explorerUrls: ['https://etherscan.io'],
        waitConfirmations: 12
    },
    arbitrum: {
        name: metadata_1.chains.arbitrum.name,
        networkId: 1000,
        rpcUrls: ['https://mainnet.arbitrum.io'],
        explorerUrls: [
            'https://expedition.dev/?rpcUrl=https%3A%2F%2Fmainnet.arbitrum.io'
        ],
        nativeBridgeUrl: 'https://bridge.arbitrum.io/',
        waitConfirmations: 20 // TODO: ask for recommended wait confirmations
    },
    optimism: {
        name: metadata_1.chains.optimism.name,
        networkId: 10,
        rpcUrls: ['https://mainnet.optimism.io'],
        explorerUrls: ['https://optimistic.etherscan.io'],
        nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
        waitConfirmations: 20 // TODO: ask for recommended wait confirmations
    },
    xdai: {
        name: metadata_1.chains.xdai.name,
        networkId: 100,
        rpcUrls: [
            'https://rpc.xdaichain.com',
            // 'https://dai.poa.network',
            // 'https://xdai.poanetwork.dev',
            'https://xdai-archive.blockscout.com',
            'https://xdai.1hive.org'
            // wss://rpc.xdaichain.com/wss
            // wss://xdai.poanetwork.dev/wss,
        ],
        explorerUrls: ['https://blockscout.com/xdai/mainnet'],
        nativeBridgeUrl: 'https://omni.xdaichain.com/',
        waitConfirmations: 12
    },
    polygon: {
        name: metadata_1.chains.polygon.name,
        networkId: 137,
        rpcUrls: ['https://polygon.rpc.hop.exchange'],
        explorerUrls: ['https://polygonscan.com'],
        nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
        waitConfirmations: 124
    }
};
