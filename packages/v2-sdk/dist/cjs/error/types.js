"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientApprovalError = exports.InsufficientBalanceError = exports.InputError = exports.ConfigError = void 0;
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}
exports.ConfigError = ConfigError;
class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InputError';
    }
}
exports.InputError = InputError;
class InsufficientBalanceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InsufficientBalanceError';
    }
}
exports.InsufficientBalanceError = InsufficientBalanceError;
class InsufficientApprovalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InsufficientApprovalError';
    }
}
exports.InsufficientApprovalError = InsufficientApprovalError;
//# sourceMappingURL=types.js.map