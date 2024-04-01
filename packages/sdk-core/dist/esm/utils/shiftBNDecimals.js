import { BigNumber } from 'ethers';
export function shiftBNDecimals(bn, shiftAmount) {
    if (shiftAmount < 0)
        throw new Error('shiftAmount must be positive');
    return bn.mul(BigNumber.from(10).pow(shiftAmount));
}
export default shiftBNDecimals;
//# sourceMappingURL=shiftBNDecimals.js.map