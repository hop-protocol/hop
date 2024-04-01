export function getEtherscanApiKey(network, chain) {
    return process.env[`ETHERSCAN_${chain.toUpperCase()}_API_KEY`] ?? '';
}
//# sourceMappingURL=getEtherscanApiKey.js.map