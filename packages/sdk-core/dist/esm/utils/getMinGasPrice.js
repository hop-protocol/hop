import { networks } from '@hop-protocol/core/networks';
export function getMinGasPrice(network, chain) {
    const networkObj = networks[network];
    const chainObj = networkObj[chain];
    return chainObj?.txOverrides?.minGasPrice;
}
//# sourceMappingURL=getMinGasPrice.js.map