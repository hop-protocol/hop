export class EVMError extends Error {}

export class NonceTooLowError extends EVMError {}
export class EstimateGasError extends EVMError {}
export class InsufficientFundsError extends EVMError {}
// TODO: Implement these in GasBoost (or implement what is in gasBoost here)
export class OOGError extends EVMError {}
export class MaxRebroadcastError extends EVMError {}
export class TransactionReplacedError extends EVMError {}
export class TransactionDroppedError extends EVMError {}
export class TransactionHangError extends EVMError {}
export class TimeoutError extends EVMError {}
export class RPCServerError extends EVMError {}
export class UnknownGasBoostError extends EVMError {}
