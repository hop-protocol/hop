"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networks = void 0;
const metadata_1 = require("@hop-protocol/metadata");
exports.networks = {
    ethereum: {
        name: metadata_1.chains.ethereum.name,
        networkId: 5,
        rpcUrls: ['https://goerli.rpc.hop.exchange'],
        explorerUrls: ['https://goerli.etherscan.io'],
        waitConfirmations: 1
    },
    polygon: {
        name: metadata_1.chains.polygon.name,
        networkId: 80001,
        rpcUrls: [
            'https://mumbai.rpc.hop.exchange',
            'https://rpc-mumbai.maticvigil.com'
        ],
        explorerUrls: [
            'https://mumbai.polygonscan.com',
            'https://explorer-mumbai.maticvigil.com'
        ],
        nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
        waitConfirmations: 1
    }
};
