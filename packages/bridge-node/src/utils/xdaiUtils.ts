// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/utils/message.js
const assert = require('assert')
const { toHex, numberToHex, padLeft } = require('web3-utils')
export const strip0x = (value: string) => value.replace(/^0x/gi, '')

export function createMessage ({
  recipient,
  value,
  transactionHash,
  bridgeAddress,
  expectedMessageLength
}: any) {
  recipient = strip0x(recipient)
  assert.strictEqual(recipient.length, 20 * 2)

  value = numberToHex(value)
  value = padLeft(value, 32 * 2)

  value = strip0x(value)
  assert.strictEqual(value.length, 64)

  transactionHash = strip0x(transactionHash)
  assert.strictEqual(transactionHash.length, 32 * 2)

  bridgeAddress = strip0x(bridgeAddress)
  assert.strictEqual(bridgeAddress.length, 20 * 2)

  const message = `0x${recipient}${value}${transactionHash}${bridgeAddress}`
  assert.strictEqual(message.length, 2 + 2 * expectedMessageLength)
  return message
}

export function parseMessage (message: any) {
  message = strip0x(message)

  const recipientStart = 0
  const recipientLength = 40
  const recipient = `0x${message.slice(
    recipientStart,
    recipientStart + recipientLength
  )}`

  const amountStart = recipientStart + recipientLength
  const amountLength = 32 * 2
  const amount = `0x${message.slice(amountStart, amountStart + amountLength)}`

  const txHashStart = amountStart + amountLength
  const txHashLength = 32 * 2
  const txHash = `0x${message.slice(txHashStart, txHashStart + txHashLength)}`

  const contractAddressStart = txHashStart + txHashLength
  const contractAddressLength = 32 * 2
  const contractAddress = `0x${message.slice(
    contractAddressStart,
    contractAddressStart + contractAddressLength
  )}`

  return {
    recipient,
    amount,
    txHash,
    contractAddress
  }
}

export function signatureToVRS (rawSignature: any) {
  const signature = strip0x(rawSignature)
  assert.strictEqual(signature.length, 2 + 32 * 2 + 32 * 2)
  const v = signature.substr(64 * 2)
  const r = signature.substr(0, 32 * 2)
  const s = signature.substr(32 * 2, 32 * 2)
  return { v, r, s }
}

export function packSignatures (array: any[]) {
  const length = strip0x(toHex(array.length))
  const msgLength = length.length === 1 ? `0${length}` : length
  let v = ''
  let r = ''
  let s = ''
  array.forEach(e => {
    v = v.concat(e.v)
    r = r.concat(e.r)
    s = s.concat(e.s)
  })
  return `0x${msgLength}${v}${r}${s}`
}

export function parseAMBHeader (message: any) {
  message = strip0x(message)

  const messageIdStart = 0
  const messageIdLength = 32 * 2
  const messageId = `0x${message.slice(
    messageIdStart,
    messageIdStart + messageIdLength
  )}`

  const senderStart = messageIdStart + messageIdLength
  const senderLength = 20 * 2
  const sender = `0x${message.slice(senderStart, senderStart + senderLength)}`

  const executorStart = senderStart + senderLength
  const executorLength = 20 * 2
  const executor = `0x${message.slice(
    executorStart,
    executorStart + executorLength
  )}`

  const gasLimitStart = executorStart + executorLength
  const gasLimitLength = 4 * 2
  const gasLimit = parseInt(
    message.slice(gasLimitStart, gasLimitStart + gasLimitLength),
    16
  )

  return {
    messageId,
    sender,
    executor,
    gasLimit
  }
}
