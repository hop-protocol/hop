import AbstractChainBridge from '../AbstractChainBridge'
import l1xDaiAmbAbi from '@hop-protocol/core/abi/static/L1_xDaiAMB.json'
import l2xDaiAmbAbi from '@hop-protocol/core/abi/static/L2_xDaiAMB.json'
import { Contract, providers } from 'ethers'
import { GnosisCanonicalAddresses } from '@hop-protocol/core/addresses'
import { IChainBridge } from '.././IChainBridge'
import { L1_xDaiAMB } from '@hop-protocol/core/contracts/static/L1_xDaiAMB'
import { L2_xDaiAMB } from '@hop-protocol/core/contracts/static/L2_xDaiAMB'
import { getCanonicalAddressesForChain } from 'src/config'
import { solidityKeccak256 } from 'ethers/lib/utils'

// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/utils/message.js
const assert = require('assert') // eslint-disable-line @typescript-eslint/no-var-requires
const { toHex } = require('web3-utils') // eslint-disable-line @typescript-eslint/no-var-requires

// reference:
// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/events/processAMBCollectedSignatures/index.js#L149
class GnosisBridge extends AbstractChainBridge implements IChainBridge {
  l1Amb: L1_xDaiAMB
  l2Amb: L2_xDaiAMB

  constructor (chainSlug: string) {
    super(chainSlug)

    // Get chain contracts
    const GnosisCanonicalAddresses: GnosisCanonicalAddresses = getCanonicalAddressesForChain(this.chainSlug)
    const l1AmbAddress = GnosisCanonicalAddresses?.l1AmbAddress
    const l2AmbAddress = GnosisCanonicalAddresses?.l2AmbAddress
    if (!l1AmbAddress || !l2AmbAddress) {
      throw new Error(`canonical addresses not found for ${this.chainSlug}`)
    }

    this.l1Amb = new Contract(l1AmbAddress, l1xDaiAmbAbi, this.l1Wallet) as L1_xDaiAMB
    this.l1Amb = new Contract(l2AmbAddress, l2xDaiAmbAbi, this.l2Wallet) as L1_xDaiAMB
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const sigEvent = await this._getValidSigEvent(l2TxHash)
    if (!sigEvent?.args) {
      throw new Error(`args for sigEvent not found for ${l2TxHash}`)
    }

    this.logger.info('found sigEvent event args')
    const message = sigEvent.args.encodedData
    if (!message) {
      throw new Error(`message not found for ${l2TxHash}`)
    }

    const msgHash = solidityKeccak256(['bytes'], [message])
    const id = await this.l2Amb.numMessagesSigned(msgHash)
    const alreadyProcessed = await this.l2Amb.isAlreadyProcessed(id)
    if (!alreadyProcessed) {
      throw new Error(`commit already processed found for ${l2TxHash}`)
    }

    const messageId =
      '0x' +
      Buffer.from(this._strip0x(message), 'hex')
        .slice(0, 32)
        .toString('hex')
    const alreadyRelayed = await this.l1Amb.relayedMessages(messageId)
    if (alreadyRelayed) {
      throw new Error(`message already relayed for ${l2TxHash}`)
    }

    const requiredSigs = (await this.l2Amb.requiredSignatures()).toNumber()
    const sigs: any[] = []
    for (let i = 0; i < requiredSigs; i++) {
      const sig = await this.l2Amb.signature(msgHash, i)
      const [v, r, s]: any[] = [[], [], []]
      const vrs = this._signatureToVRS(sig)
      v.push(vrs.v)
      r.push(vrs.r)
      s.push(vrs.s)
      sigs.push(vrs)
    }
    const packedSigs = this._packSignatures(sigs)

    return this.l1Amb.executeSignatures(message, packedSigs)
  }

  private async _getValidSigEvent (l2TxHash: string) {
    const tx = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const sigEvents = await this.l2Amb.queryFilter(
      this.l2Amb.filters.UserRequestForSignature(),
      tx.blockNumber,
      tx.blockNumber
    )

    for (const sigEvent of sigEvents) {
      const sigTxHash = sigEvent.transactionHash
      if (sigTxHash.toLowerCase() !== l2TxHash.toLowerCase()) {
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

  private _strip0x (value: string): string {
    return value.replace(/^0x/i, '')
  }

  private _signatureToVRS (rawSignature: any) {
    const signature = this._strip0x(rawSignature)
    assert.strictEqual(signature.length, 2 + 32 * 2 + 32 * 2)
    const v = signature.substr(64 * 2)
    const r = signature.substr(0, 32 * 2)
    const s = signature.substr(32 * 2, 32 * 2)
    return { v, r, s }
  }

  private _packSignatures (array: any[]) {
    const length = this._strip0x(toHex(array.length))
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
}

export default GnosisBridge
