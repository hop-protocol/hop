import { config } from '#config/index.js';
export function getSubgraphUrl(network, chain) {
    if (!config[network]) {
        throw new Error(`config for network ${network} not found`);
    }
    const url = config[network]?.chains?.[chain]?.subgraphUrl;
    if (!url) {
        throw new Error(`subgraph url not found for chain ${chain}`);
    }
    return url;
}
//# sourceMappingURL=getSubgraphUrl.js.map