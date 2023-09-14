import '../src/moduleAlias'
import { SendBondTransferRootTxParams } from 'src/watchers/BondTransferRootWatcher'
import { SendBondWithdrawalTxParams } from 'src/watchers/BondWithdrawalWatcher'
import { Transfer } from 'src/db/TransfersDb'
import { TransferRoot } from 'src/db/TransferRootsDb'
import {
  getBondTransferRootWatcher,
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

// Run this with
// npx ts-node test/preTransactionValidation.test.ts
// NOTE: import moduleAlias first to avoid errors

// NOTE: These tests assume an updated DB and chain, token, transferId, and rootHash values.

async function main () {
  const chain = 'polygon'
  const token = 'USDT'
  const transferId = '0xce4381be76ea9d93ffc1cee83ac32989b654e8fcccedb8afeaf26c7f67fccbdd'
  const rootHash = '0xd1c22b202118b9dd27d17f294c174bb2d9017dcb98b23a95ae12c62edb906a4c'

  const configFilePath = '~/.hop/mainnet/config.json'
  const config = await parseConfigFile(configFilePath)
  await setGlobalConfigFromConfigFile(config)

  await testBondWithdrawalWatcher(chain, token, transferId)
  await testBondTransferRootWatcher(chain, token, rootHash)
}

async function testBondWithdrawalWatcher (chain: string, token: string, transferId: string): Promise<void> {
  const watcher = await getBondWithdrawalWatcher({ chain, token, dryMode: true })
  const dbTransfer: Transfer = await watcher.db.transfers.getByTransferId(transferId)
  if (!dbTransfer) {
    throw new Error('TransferId does not exist in the DB')
  }

  const attemptSwap = watcher.bridge.shouldAttemptSwapDuringBondWithdrawal(dbTransfer.amountOutMin, dbTransfer.deadline)
  const txParams: SendBondWithdrawalTxParams = ({
    transferId: dbTransfer.transferId,
    sender: dbTransfer.sender!,
    recipient: dbTransfer.recipient!,
    amount: dbTransfer.amount!,
    transferNonce: dbTransfer.transferNonce!,
    bonderFee: dbTransfer.bonderFee!,
    attemptSwap,
    destinationChainId: dbTransfer.destinationChainId!,
    amountOutMin: dbTransfer.amountOutMin!,
    deadline: dbTransfer.deadline!,
    transferSentIndex: dbTransfer.transferSentIndex!
  })

  await shouldSucceed(watcher, txParams)
  await shouldFailCalcTransferId(watcher, txParams)
  await shouldFailCompareTransferSentIndex(watcher, txParams)
  await shouldFailTooManyTransferNoncesInDb(watcher, txParams)
  await shouldFailTooFewTransferNoncesInDb(watcher, txParams)
  await shouldFailBondWithdrawalInvalidEventData(watcher, txParams)
  console.log('\n\nBondWithdrawal Test successful')
}

async function testBondTransferRootWatcher (chain: string, token: string, rootHash: string): Promise<void> {
  const watcher = await getBondTransferRootWatcher({ chain, token, dryMode: true })
  const dbTransferRoot: TransferRoot = await watcher.db.transferRoots.getByTransferRootHash(rootHash)
  if (!dbTransferRoot) {
    throw new Error('TransferRoot does not exist in the DB')
  }

  const txParams: SendBondTransferRootTxParams = ({
    transferRootId: dbTransferRoot.transferRootId,
    transferRootHash: dbTransferRoot.transferRootHash!,
    destinationChainId: dbTransferRoot.destinationChainId!,
    totalAmount: dbTransferRoot.totalAmount!,
    transferIds: dbTransferRoot.transferIds!,
    rootCommittedAt: dbTransferRoot.committedAt!
  })

  await shouldSucceed(watcher, txParams)
  await shouldFailCalcTransferRoot(watcher, txParams)
  await shouldFailCompareDestinationChainId(watcher, txParams)
  await shouldFailTransferIdNotUniqueInDb(watcher, txParams)
  await shouldFailBondTransferRootInvalidEventData(watcher, txParams)
  console.log('\n\nBondTransferRoot Test successful')
}

async function shouldSucceed (watcher: any, txParams: SendBondWithdrawalTxParams | SendBondTransferRootTxParams) {
  await watcher.preTransactionValidation(txParams)
}

async function shouldFailCalcTransferId (watcher: any, txParams: SendBondWithdrawalTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateDbExistence
  params.transferId = '0x1234567890123456789012345678901234567890123456789012345678901234'

  const errMessage = 'does not match transferId in db'
  await expectError(fn, watcher, params, errMessage)
}

async function shouldFailCompareTransferSentIndex (watcher: any, txParams: SendBondWithdrawalTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateTransferSentIndex
  params.transferSentIndex = 123

  const errMessage = 'does not match transferSentIndex in db'
  await expectError(fn, watcher, params, errMessage)
}

async function shouldFailTooManyTransferNoncesInDb (watcher: any, txParams: SendBondWithdrawalTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateUniqueness
  const duplicateNonce = '0x7400b9182bfdc11966a8d071743a77afb179fbf6a37bf6e6af7915a1b94d11c0'
  params.transferNonce = duplicateNonce

  const errMessage = 'exists in multiple transfers in db'
  await expectError(fn, watcher, params, errMessage)
}

async function shouldFailTooFewTransferNoncesInDb (watcher: any, txParams: SendBondWithdrawalTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateUniqueness
  const missingNonce = '0x0000000000000000000000000000000000000000000000000000000000000000'
  params.transferNonce = missingNonce

  const errMessage = 'does not exist in db'
  await expectError(fn, watcher, params, errMessage)
}

async function shouldFailBondWithdrawalInvalidEventData (watcher: any, txParams: SendBondWithdrawalTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateLogsWithRedundantRpcs
  params.transferSentIndex = 123

  const errMessage = 'TransferSent event does not match db'
  await expectError(fn, watcher, params, errMessage)
}

async function shouldFailCalcTransferRoot (watcher: any, txParams: SendBondTransferRootTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateDbExistence
  params.transferRootId = '0x1234567890123456789012345678901234567890123456789012345678901234'

  const errMessage = 'does not match transferRootId in db'
  await expectError(fn, watcher, params, errMessage)
}

async function shouldFailCompareDestinationChainId (watcher: any, txParams: SendBondTransferRootTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateDestinationChainId
  params.destinationChainId = 123

  const errMessage = 'does not match destinationChainId in db'
  await expectError(fn, watcher, params, errMessage)
}

async function shouldFailTransferIdNotUniqueInDb (watcher: any, txParams: SendBondTransferRootTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateUniqueness
  const duplicateTransferId = '0xe1286263d73ab99179835bac7b1371ad616d82919abe3725dbe71214ed4513e2'
  params.transferIds.push(duplicateTransferId)

  const errMessage = 'exists in multiple transferRoots in db'
  await expectError(fn, watcher, params, errMessage)
}

async function shouldFailBondTransferRootInvalidEventData (watcher: any, txParams: SendBondTransferRootTxParams) {
  const params = deepClone(txParams)
  const fn = watcher.validateLogsWithRedundantRpcs
  params.rootCommittedAt = 123

  const errMessage = 'TransfersCommitted event does not match db. eventParam'
  await expectError(fn, watcher, params, errMessage)
}

async function expectError (fn: any, watcher: any, params: any, errMessage: string): Promise<void> {
  try {
    await fn.bind(watcher)(params)
    throw new Error('should not reach here')
  } catch (err) {
    if (!err.message.includes(errMessage)) {
      throw new Error(`Expected error message to include ${errMessage} but got ${err.message}`)
    }
  }
}

function deepClone (obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

main().catch(console.error).finally(() => process.exit(0))
