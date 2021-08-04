"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networks = void 0;
const metadata_1 = require("@hop-protocol/metadata");
exports.networks = {
    ethereum: {
        name: metadata_1.chains.ethereum.name,
        networkId: 42,
        rpcUrls: ['https://kovan.rpc.hop.exchange'],
        explorerUrls: ['https://kovan.etherscan.io'],
        waitConfirmations: 1
    },
    arbitrum: {
        name: metadata_1.chains.arbitrum.name,
        networkId: 212984383488152,
        rpcUrls: ['https://kovan4.arbitrum.io/rpc'],
        explorerUrls: ['https://explorer.offchainlabs.com/#/'],
        nativeBridgeUrl: 'https://bridge.arbitrum.io/',
        waitConfirmations: 1
    },
    optimism: {
        name: metadata_1.chains.optimism.name,
        networkId: 69,
        rpcUrls: ['https://kovan.optimism.io'],
        explorerUrls: ['https://kovan-optimistic.etherscan.io'],
        nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
        waitConfirmations: 1
    },
    xdai: {
        name: metadata_1.chains.xdai.name,
        networkId: 77,
        rpcUrls: [
            'https://sokol.poa.network',
            'https://sokol-archive.blockscout.com'
        ],
        explorerUrls: ['https://blockscout.com/poa/sokol'],
        nativeBridgeUrl: 'https://omni.xdaichain.com/',
        waitConfirmations: 1
    }
};
