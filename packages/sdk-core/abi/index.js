"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapV3Pool = exports.UniswapQuoterV2Abi = exports.Multicall3 = exports.erc20Abi = void 0;
var ERC20_json_1 = require("./generated/ERC20.json");
Object.defineProperty(exports, "erc20Abi", { enumerable: true, get: function () { return __importDefault(ERC20_json_1).default; } });
var Multicall3_json_1 = require("./generated/Multicall3.json");
Object.defineProperty(exports, "Multicall3", { enumerable: true, get: function () { return __importDefault(Multicall3_json_1).default; } });
var UniswapQuoterV2_json_1 = require("./generated/UniswapQuoterV2.json");
Object.defineProperty(exports, "UniswapQuoterV2Abi", { enumerable: true, get: function () { return __importDefault(UniswapQuoterV2_json_1).default; } });
var UniswapV3Pool_json_1 = require("./generated/UniswapV3Pool.json");
Object.defineProperty(exports, "UniswapV3Pool", { enumerable: true, get: function () { return __importDefault(UniswapV3Pool_json_1).default; } });
//# sourceMappingURL=index.js.map