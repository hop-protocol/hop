export class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}
export class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InputError';
    }
}
export class InsufficientBalanceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InsufficientBalanceError';
    }
}
export class InsufficientApprovalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InsufficientApprovalError';
    }
}
//# sourceMappingURL=types.js.map