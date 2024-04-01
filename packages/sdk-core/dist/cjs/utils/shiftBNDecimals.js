"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftBNDecimals = void 0;
const ethers_1 = require("ethers");
function shiftBNDecimals(bn, shiftAmount) {
    if (shiftAmount < 0)
        throw new Error('shiftAmount must be positive');
    return bn.mul(ethers_1.BigNumber.from(10).pow(shiftAmount));
}
exports.shiftBNDecimals = shiftBNDecimals;
exports.default = shiftBNDecimals;
//# sourceMappingURL=shiftBNDecimals.js.map