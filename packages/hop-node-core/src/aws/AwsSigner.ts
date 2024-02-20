import { BigNumber, Signer, providers } from 'ethers'
import {
  getAddress as checksumAddress,
  defineReadOnly,
  hashMessage,
  joinSignature,
  keccak256,
  parseTransaction,
  recoverAddress,
  resolveProperties,
  serializeTransaction,
  splitSignature
} from 'ethers/lib/utils.js'
// @ts-expect-error asn1.js does not have a types file as of 20231227
import * as asn1 from 'asn1.js'

const EcdsaPubKey = asn1.define('EcdsaPubKey', function (this: any) {
  this.seq().obj(
    this.key('algo').seq().obj(
      this.key('a').objid(),
      this.key('b').objid()
    ),
    this.key('pubKey').bitstr()
  )
})

const EcdsaSigAsnParse = asn1.define('EcdsaSig', function (this: any) {
  this.seq().obj(
    this.key('r').int(),
    this.key('s').int()
  )
})

export type AwsSignerConfig = {
  keyId: string
  region?: string
}

// details:
// https://ethereum.stackexchange.com/a/73371/5093
// https://luhenning.medium.com/the-dark-side-of-the-elliptic-curve-signing-ethereum-transactions-with-aws-kms-in-javascript-83610d9a6f81
// https://github.com/lucashenning/aws-kms-ethereum-signing/blob/master/aws-kms-sign.ts
export abstract class AwsSigner extends Signer {
  config: AwsSignerConfig
  address: string
  abstract override getAddress (): Promise<string>
  abstract override signMessage (msg: Buffer | string): Promise<string>
  abstract override signTransaction (transaction: providers.TransactionRequest): Promise<string>

  constructor (config: AwsSignerConfig, provider?: providers.Provider) {
    super()
    if (!config.keyId) {
      throw new Error('keyId is required')
    }
    this.config = config
    defineReadOnly(this, 'provider', provider)
  }

  get keyId () {
    return this.config.keyId
  }

  recoverAddressFromSig (msg: Buffer | string, signature: string): string {
    const msgHash = hashMessage(msg)
    const { r, s, v } = splitSignature(signature)
    return recoverAddress(msgHash, { r, s, v })
  }

  async recoverAddressFromTxSig (transaction: providers.TransactionRequest, signature: string): Promise<string> {
    const unsignedTx: any = await resolveProperties(transaction)
    const serializedTx = serializeTransaction(unsignedTx)
    const hash = keccak256(serializedTx)

    // Parse signature
    const parsedTransaction = parseTransaction(signature)
    const { r, s, v } = parsedTransaction
    if (!r || !s || !v) {
      throw new Error('signature is invalid. r, s, and v are required')
    }

    return recoverAddress(hash, { r, s, v })
  }

  getEthereumAddress (publicKey: Buffer): string {
    const res = EcdsaPubKey.decode(publicKey, 'der')
    const pubKeyBuffer = res.pubKey.data.slice(1)
    const pubKeyHash = keccak256(pubKeyBuffer)
    const address = `0x${pubKeyHash.slice(-40)}`
    return checksumAddress(address)
  }

  normalizeTransaction (transaction: providers.TransactionRequest): providers.TransactionRequest {
    // Ethers will not serialize a transaction with a from address
    if (transaction?.from) {
      delete transaction.from
    }
    return transaction
  }

  async getJoinedSignature (msg: Buffer, signature: Buffer): Promise<string> {
    const { r, s } = this.getSigRs(signature)
    const { v } = await this.getSigV(msg, { r, s })
    const joinedSignature = joinSignature({ r, s, v })
    return joinedSignature
  }

  async getSigV (msgHash: Buffer, { r, s }: { r: string, s: string }) {
    const address = await this.getAddress()
    let v = 27
    let recovered = recoverAddress(msgHash, { r, s, v })
    if (!this.addressEquals(recovered, address)) {
      v = 28
      recovered = recoverAddress(msgHash, { r, s, v })
    }
    if (!this.addressEquals(recovered, address)) {
      throw new Error('signature is invalid. recovered address does not match')
    }
    return { v }
  }

  getSigRs (signature: Buffer) {
    const decoded = EcdsaSigAsnParse.decode(signature, 'der')
    const rBn = BigNumber.from(`0x${decoded.r.toString(16)}`)
    let sBn = BigNumber.from(`0x${decoded.s.toString(16)}`)
    // max value on the curve - https://www.secg.org/sec2-v2.pdf
    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.3/contracts/utils/cryptography/ECDSA.sol#L138-L149
    const secp256k1N = BigNumber.from('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')
    const secp256k1halfN = secp256k1N.div(BigNumber.from(2))
    if (sBn.gt(secp256k1halfN)) {
      sBn = secp256k1N.sub(sBn)
    }
    const r = rBn.toHexString()
    const s = sBn.toHexString()
    return { r, s }
  }

  addressEquals (address1: string, address2: string): boolean {
    return address1.toLowerCase() === address2.toLowerCase()
  }
}
