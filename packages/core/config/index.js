"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staging = exports.mainnet = exports.goerli = exports.kovan = void 0;
__exportStar(require("./types"), exports);
var kovan_1 = require("./kovan");
Object.defineProperty(exports, "kovan", { enumerable: true, get: function () { return kovan_1.config; } });
var goerli_1 = require("./goerli");
Object.defineProperty(exports, "goerli", { enumerable: true, get: function () { return goerli_1.config; } });
var mainnet_1 = require("./mainnet");
Object.defineProperty(exports, "mainnet", { enumerable: true, get: function () { return mainnet_1.config; } });
var staging_1 = require("./staging");
Object.defineProperty(exports, "staging", { enumerable: true, get: function () { return staging_1.config; } });
