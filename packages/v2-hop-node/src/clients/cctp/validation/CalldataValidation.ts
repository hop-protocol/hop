import type { IValidationClient } from '#validation/index.js'
import type { providers } from 'ethers'

export enum TxType {
  Protocol = 'protocol',
  ERC20 = 'erc20',
  Native = 'native'
}

const addresses = {
  [TxType.Protocol]: [
    '0x4D41f22c5a0e5c74090899E5a8Fb597a8842b3e8', // op
    '0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca', // arb
    '0x0a992d191DEeC32aFe36203Ad87D7d289a738F81', // eth
    '0xAD09780d193884d503182aD4588450C416D6F9D4', // base
    '0xF3be9355363857F3e001be68856A2f96b4C39Ba9', // pol
  ]
}

const functionSignatures = {
  [TxType.Protocol]: [
    '0x57ecfd28',
  ]
}

export class CalldataValidation implements IValidationClient {

  validateTransaction (transaction: providers.TransactionRequest): void {
    console.log('CalldataValidation.validateTransaction', transaction)
    const isValid = this.#isProtocolTx(transaction)
    if (!isValid) {
      throw new Error('Invalid transaction')
    }
  }

  #isProtocolTx (transaction: providers.TransactionRequest): boolean {
    const { to, data } = transaction

    if (!data || data.length === 0) {
      console.log('Invalid data length for protocol transaction')
      return false
    }

    if (!to) {
      console.log('Invalid to address for protocol transaction')
      return false
    }

    if (!addresses[TxType.Protocol].includes(to)) {
      console.log(`Invalid protocol contract: ${to}`)
      return false
    }

    const functionSignature = String(data).slice(0, 10)
    if (!functionSignatures[TxType.Protocol].includes(functionSignature)) {
      console.log(`Unknown function signature: ${functionSignature}`)
      return false
    }

    return true
  }
}
