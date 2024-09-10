const errorPrefix = 'HopV2Sdk: '

export class CustomError extends Error {
  constructor(message: string) {
    super(`${errorPrefix}${message}`)
    this.name = 'Error'
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(`${errorPrefix}${message}`)
    this.name = 'ConfigError'
  }
}

export class InputError extends Error {
  constructor(message: string) {
    super(`${errorPrefix}${message}`)
    this.name = 'InputError'
  }
}

export class InsufficientBalanceError extends Error {
  constructor(message: string) {
    super(`${errorPrefix}${message}`)
    this.name = 'InsufficientBalanceError'
  }
}

export class InsufficientApprovalError extends Error {
  constructor(message: string) {
    super(`${errorPrefix}${message}`)
    this.name = 'InsufficientApprovalError'
  }
}

export class ContractFunctionRevertedError extends Error {
  constructor(message: string) {
    super(`${errorPrefix}${message}`)
    this.name = 'ContractFunctionRevertedError'
  }
}
