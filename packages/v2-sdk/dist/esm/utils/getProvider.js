import { networks } from '#common/networks.js';
import { providers } from 'ethers';
export function getProvider(network, chainId) {
    const rpcUrl = networks[network]?.[chainId]?.publicRpcUrl;
    if (!rpcUrl) {
        throw new Error(`Invalid network ${network} or chainId: ${chainId}, rpcUrl not found`);
    }
    return new providers.JsonRpcProvider(rpcUrl);
}
//# sourceMappingURL=getProvider.js.map