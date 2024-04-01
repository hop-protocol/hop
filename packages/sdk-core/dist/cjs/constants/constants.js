"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.HToken = exports.WrappedToken = exports.CanonicalToken = exports.Slug = exports.ChainSlug = exports.ChainName = exports.ChainId = exports.NetworkSlug = void 0;
const networks_1 = require("@hop-protocol/core/networks");
Object.defineProperty(exports, "CanonicalToken", { enumerable: true, get: function () { return networks_1.CanonicalToken; } });
Object.defineProperty(exports, "ChainId", { enumerable: true, get: function () { return networks_1.ChainId; } });
Object.defineProperty(exports, "ChainName", { enumerable: true, get: function () { return networks_1.ChainName; } });
Object.defineProperty(exports, "ChainSlug", { enumerable: true, get: function () { return networks_1.ChainSlug; } });
Object.defineProperty(exports, "HToken", { enumerable: true, get: function () { return networks_1.HToken; } });
Object.defineProperty(exports, "NetworkSlug", { enumerable: true, get: function () { return networks_1.NetworkSlug; } });
Object.defineProperty(exports, "Slug", { enumerable: true, get: function () { return networks_1.Slug; } });
Object.defineProperty(exports, "WrappedToken", { enumerable: true, get: function () { return networks_1.WrappedToken; } });
var Errors;
(function (Errors) {
    Errors["NotEnoughAllowance"] = "Not enough allowance. Please call `approve` on the token contract to allow contract to move tokens and make sure you are connected to the correct network.";
    Errors["xDaiRebrand"] = "NOTICE: xDai has been rebranded to Gnosis. Chain \"xdai\" is deprecated. Use \"gnosis\" instead.";
})(Errors || (exports.Errors = Errors = {}));
//# sourceMappingURL=constants.js.map