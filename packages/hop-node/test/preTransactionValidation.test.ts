import {
  getBondWithdrawalWatcher
} from '../src/watchers/watchers'
import { Transfer } from '../src/db/TransfersDb'
import { SendBondWithdrawalTxParams } from '../src/watchers/BondWithdrawalWatcher'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { BigNumber } from 'ethers'

// Run this with
// npx ts-node test/preTransactionValidation.test.ts

// NOTE: These tests assume an updated DB and chain, token, and transferId values.

async function main () {
  const chain = 'polygon'
  const token = 'USDT'
  const transferId = '0xce4381be76ea9d93ffc1cee83ac32989b654e8fcccedb8afeaf26c7f67fccbdd'

  const configFilePath = '~/.hop-node/mainnet/config.json'
  const config = await parseConfigFile(configFilePath)
  await setGlobalConfigFromConfigFile(config)

  const watcher = await getBondWithdrawalWatcher({ chain, token, dryMode: true })
  const dbTransfer: Transfer = await watcher.db.transfers.getByTransferId(transferId)
  if (!dbTransfer) {
    throw new Error('TransferId does not exist in the DB')
  }

  const attemptSwap = watcher.bridge.shouldAttemptSwapDuringBondWithdrawal(dbTransfer.amountOutMin, dbTransfer.deadline)
  const txParams: SendBondWithdrawalTxParams = ({
    transferId: dbTransfer.transferId!,
    sender: dbTransfer.sender!,
    recipient: dbTransfer.recipient!,
    amount: dbTransfer.amount!,
    transferNonce: dbTransfer.transferNonce!,
    bonderFee: dbTransfer.bonderFee!,
    attemptSwap,
    destinationChainId: dbTransfer.destinationChainId!,
    amountOutMin: dbTransfer.amountOutMin!,
    deadline: dbTransfer.deadline!,
    transferSentIndex : dbTransfer.transferSentIndex!
  })

  await shouldSuccess(watcher, txParams)
  await shouldFailCalcTransferId(watcher, txParams)
  await shouldFailCompareTransferSentIndex(watcher, txParams)
  await shouldFailTooManyTransferNoncesInDb(watcher, txParams)
  await shouldFailTooFewTransferNoncesInDb(watcher, txParams)
  await shouldFailMissingEvent(watcher, txParams)
  console.log('\n\nTest successful')
}

async function shouldSuccess(watcher: any, txParams: SendBondWithdrawalTxParams) {
  await watcher.preTransactionValidation(txParams)
}

async function shouldFailCalcTransferId(watcher: any, txParams: SendBondWithdrawalTxParams) {
  const transfer = deepClone(txParams)
  const fn = watcher.validateDbExistence
  transfer.transferId = '0x1234567890123456789012345678901234567890123456789012345678901234'

  const errMessage = 'does not match transferId in db'
  await expectError(fn, watcher, transfer, errMessage)
}

async function shouldFailCompareTransferSentIndex(watcher: any, txParams: SendBondWithdrawalTxParams) {
  const transfer = deepClone(txParams)
  const fn = watcher.validateTransferSentIndex
  transfer.transferSentIndex = 123

  const errMessage = 'does not match transferSentIndex in db'
  await expectError(fn, watcher, transfer, errMessage)
}

async function shouldFailTooManyTransferNoncesInDb(watcher: any, txParams: SendBondWithdrawalTxParams) {
  const transfer = deepClone(txParams)
  const fn = watcher.validateUniqueness
  const duplicateNonce = '0x7400b9182bfdc11966a8d071743a77afb179fbf6a37bf6e6af7915a1b94d11c0'
  transfer.transferNonce = duplicateNonce

  const errMessage = 'exists in multiple transfers in db'
  await expectError(fn, watcher, transfer, errMessage)
}

async function shouldFailTooFewTransferNoncesInDb(watcher: any, txParams: SendBondWithdrawalTxParams) {
  const transfer = deepClone(txParams)
  const fn = watcher.validateUniqueness
  const missingNonce = '0x0000000000000000000000000000000000000000000000000000000000000000'
  transfer.transferNonce = missingNonce

  const errMessage = 'does not exist in db'
  await expectError(fn, watcher, transfer, errMessage)
}

async function shouldFailMissingEvent(watcher: any, txParams: SendBondWithdrawalTxParams) {
  const transfer = deepClone(txParams)
  const fn = watcher.validateLogsWithBackupRpc
  transfer.transferSentIndex = 123

  const errMessage = 'TransferSent event does not match db'
  await expectError(fn, watcher, transfer, errMessage)
}

async function expectError(fn: any, watcher: any, transfer: any, errMessage: string): Promise<void> {
  try {
    await fn.bind(watcher)(transfer)
    throw new Error('should not reach here')
  } catch (err) {
    if (!err.message.includes(errMessage)) {
      throw new Error(`Expected error message to include ${errMessage} but got ${err.message}`)
    }
  }
}

function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

main().catch(console.error).finally(() => process.exit(0))
