import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import Logger from 'src/logger'
import l1xDaiAmbAbi from '@hop-protocol/core/abi/static/L1_xDaiAMB.json'
import l2xDaiAmbAbi from '@hop-protocol/core/abi/static/L2_xDaiAMB.json'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract, providers } from 'ethers'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L1XDaiAMB, L2XDaiAMB } from '@hop-protocol/core/contracts'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { config as globalConfig } from 'src/config'
import { solidityKeccak256 } from 'ethers/lib/utils'

type Config = {
  chainSlug: string
  tokenSymbol: string
  l1BridgeContract?: L1BridgeContract
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

const getL1Amb = (token: string) => {
  const l1Wallet = wallets.get(Chain.Ethereum)
  const l1AmbAddress = globalConfig.addresses[token].gnosis.l1Amb
  return new Contract(l1AmbAddress, l1xDaiAmbAbi, l1Wallet) as L1XDaiAMB
}

const getL2Amb = (token: string) => {
  const l2xDaiProvider = wallets.get(Chain.Gnosis).provider
  const l2AmbAddress = globalConfig.addresses[token].gnosis.l2Amb
  return new Contract(l2AmbAddress, l2xDaiAmbAbi, l2xDaiProvider) as L2XDaiAMB
}

// reference:
// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/events/processAMBCollectedSignatures/index.js#L149
class GnosisBridgeWatcher extends BaseWatcher {
  l1Bridge: L1Bridge

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    if (config.l1BridgeContract != null) {
      this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    }
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    logger.debug(
      `attempting to send relay message on gnosis for commit tx hash ${commitTxHash}`
    )

    if (this.dryMode) {
      logger.warn(`dry: ${this.dryMode}, skipping relayXDomainMessage`)
      return
    }
    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })

    const tx = await this.relayXDomainMessage(commitTxHash)
    if (!tx) {
      logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
      return
    }
    const msg = `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx ${tx.hash}`
    logger.info(msg)
    this.notifier.info(msg)
  }

  async relayXDomainMessage (commitTxHash: string): Promise<providers.TransactionResponse> {
    const token: string = this.tokenSymbol
    const l1Amb = getL1Amb(token)
    const l2Amb = getL2Amb(token)

    const sigEvent = await this.getValidSigEvent(commitTxHash)
    if (!sigEvent?.args) {
      throw new Error(`args for sigEvent not found for ${commitTxHash}`)
    }

    this.logger.info('found sigEvent event args')
    const message = sigEvent.args.encodedData
    if (!message) {
      throw new Error(`message not found for ${commitTxHash}`)
    }

    const msgHash = solidityKeccak256(['bytes'], [message])
    const id = await l2Amb.numMessagesSigned(msgHash)
    const alreadyProcessed = await l2Amb.isAlreadyProcessed(id)
    if (!alreadyProcessed) {
      throw new Error(`commit already processed found for ${commitTxHash}`)
    }

    const messageId =
      '0x' +
      Buffer.from(strip0x(message), 'hex')
        .slice(0, 32)
        .toString('hex')
    const alreadyRelayed = await l1Amb.relayedMessages(messageId)
    if (alreadyRelayed) {
      throw new Error(`message already relayed for ${commitTxHash}`)
    }

    const requiredSigs = (await l2Amb.requiredSignatures()).toNumber()
    const sigs: any[] = []
    for (let i = 0; i < requiredSigs; i++) {
      const sig = await l2Amb.signature(msgHash, i)
      const [v, r, s]: any[] = [[], [], []]
      const vrs = signatureToVRS(sig)
      v.push(vrs.v)
      r.push(vrs.r)
      s.push(vrs.s)
      sigs.push(vrs)
    }
    const packedSigs = packSignatures(sigs)

    return l1Amb.executeSignatures(message, packedSigs)
  }

  async getValidSigEvent (commitTxHash: string) {
    const tx = await this.bridge.getTransactionReceipt(commitTxHash)
    const l2Amb = getL2Amb(this.tokenSymbol)
    const sigEvents = await l2Amb.queryFilter(
      l2Amb.filters.UserRequestForSignature(),
      tx.blockNumber,
      tx.blockNumber
    )

    for (const sigEvent of sigEvents) {
      const sigTxHash = sigEvent.transactionHash
      if (sigTxHash.toLowerCase() !== commitTxHash.toLowerCase()) {
        continue
      }
      const { encodedData } = sigEvent.args
      // TODO: better way of slicing by method id
      const data = encodedData.includes('ef6ebe5e00000')
        ? encodedData.replace(/.*(ef6ebe5e00000.*)/, '$1')
        : ''
      if (data) {
        return sigEvent
      }
    }
  }
}

export default GnosisBridgeWatcher

// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/utils/message.js
const assert = require('assert') // eslint-disable-line @typescript-eslint/no-var-requires
const { toHex, numberToHex, padLeft } = require('web3-utils') // eslint-disable-line @typescript-eslint/no-var-requires

const strip0x = (value: string) => value.replace(/^0x/i, '')

function signatureToVRS (rawSignature: any) {
  const signature = strip0x(rawSignature)
  assert.strictEqual(signature.length, 2 + 32 * 2 + 32 * 2)
  const v = signature.substr(64 * 2)
  const r = signature.substr(0, 32 * 2)
  const s = signature.substr(32 * 2, 32 * 2)
  return { v, r, s }
}

function packSignatures (array: any[]) {
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
