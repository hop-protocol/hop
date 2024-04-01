import { networks } from '@hop-protocol/core/networks';
export function getMinGasLimit(network, chain) {
    const networkObj = networks[network];
    const chainObj = networkObj[chain];
    return chainObj?.txOverrides?.minGasLimit;
}
//# sourceMappingURL=getMinGasLimit.js.map