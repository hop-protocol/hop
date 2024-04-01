"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
const wait = async (t) => {
    return new Promise(resolve => setTimeout(() => resolve(null), t));
};
exports.wait = wait;
//# sourceMappingURL=wait.js.map