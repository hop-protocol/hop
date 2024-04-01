import { config } from '#config/index.js';
export function getSubgraphChains(network) {
    const networks = config[network]?.chains;
    const chains = new Set([]);
    for (const chain in networks) {
        if (networks[chain]?.subgraphUrl) {
            chains.add(chain);
        }
    }
    return Array.from(chains);
}
//# sourceMappingURL=getSubgraphChains.js.map