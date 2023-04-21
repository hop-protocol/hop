import { BigNumber, Signer, providers } from 'ethers'
import { GetPublicKeyCommand, KMSClient, SignCommand } from '@aws-sdk/client-kms'
import {
  arrayify,
  defineReadOnly,
  getAddress as checksumAddress,
  hashMessage,
  joinSignature,
  keccak256,
  recoverAddress,
  resolveProperties,
  serializeTransaction,
  splitSignature
} from 'ethers/lib/utils'
import { awsAccessKeyId, awsSecretAccessKey } from '../config'
import * as asn1 from 'asn1.js'

const EcdsaPubKey = asn1.define('EcdsaPubKey', function () {
  this.seq().obj(
    this.key('algo').seq().obj(
      this.key('a').objid(),
      this.key('b').objid()
    ),
    this.key('pubKey').bitstr()
  )
})

const EcdsaSigAsnParse = asn1.define('EcdsaSig', function () {
  this.seq().obj(
    this.key('r').int(),
    this.key('s').int()
  )
})

type Config = {
  keyId: string
  region?: string
}

// details:
// https://ethereum.stackexchange.com/a/73371/5093
// https://luhenning.medium.com/the-dark-side-of-the-elliptic-curve-signing-ethereum-transactions-with-aws-kms-in-javascript-83610d9a6f81
// https://github.com/lucashenning/aws-kms-ethereum-signing/blob/master/aws-kms-sign.ts
export class KmsSigner extends Signer {
  config: Config
  address: string
  client: KMSClient

  constructor (config: Config, provider?: providers.Provider) {
    super()
    if (!config.keyId) {
      throw new Error('keyId is required')
    }
    this.config = config
    let credentials
    if (awsAccessKeyId && awsSecretAccessKey) {
      credentials = {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey
      }
    }
    this.client = new KMSClient({
      region: config.region,
      credentials
    })
    defineReadOnly(this, 'provider', provider)
  }

  get keyId () {
    return this.config.keyId
  }

  connect (provider: providers.Provider): KmsSigner {
    return new KmsSigner(this.config, provider)
  }

  async getAddress (): Promise<string> {
    if (this.address) {
      return this.address
    }
    const publicKey = await this._getKmsPublicKey()
    const address = this._getEthereumAddress(publicKey)
    this.address = address
    return address
  }

  async signMessage (msg: Buffer | string): Promise<string> {
    const hash = Buffer.from(hashMessage(msg).slice(2), 'hex')
    return this._signDigest(hash)
  }

  async signTransaction (transaction: providers.TransactionRequest): Promise<string> {
    const unsignedTx: any = await resolveProperties(transaction)
    const serializedTx = serializeTransaction(unsignedTx)
    const hash = Buffer.from(keccak256(serializedTx).slice(2), 'hex')
    const txSig = await this._signDigest(hash)
    return serializeTransaction(unsignedTx, txSig)
  }

  private async _getKmsPublicKey (): Promise<Buffer> {
    const command = new GetPublicKeyCommand({
      KeyId: this.keyId
    })
    const res: any = await this.client.send(command)
    return Buffer.from(res.PublicKey)
  }

  private async _kmsSign (msg: Buffer): Promise<Buffer> {
    const params = {
      KeyId: this.keyId,
      Message: msg,
      SigningAlgorithm: 'ECDSA_SHA_256',
      MessageType: 'DIGEST'
    }
    const command = new SignCommand(params)
    const res: any = await this.client.send(command)
    return Buffer.from(res.Signature)
  }

  private _getEthereumAddress (publicKey: Buffer): string {
    const res = EcdsaPubKey.decode(publicKey, 'der')
    const pubKeyBuffer = res.pubKey.data.slice(1)
    const addressBuf = Buffer.from(keccak256(pubKeyBuffer).slice(2), 'hex')
    const address = `0x${addressBuf.slice(-20).toString('hex')}`
    return address
  }

  private async _signDigest (digest: Buffer | string): Promise<string> {
    const msg = Buffer.from(arrayify(digest))
    const signature = await this._kmsSign(msg)
    const { r, s } = this._getSigRs(signature)
    const { v } = await this._getSigV(msg, { r, s })
    const joinedSignature = joinSignature({ r, s, v })
    return joinedSignature
  }

  private async _getSigV (msgHash: Buffer, { r, s }: { r: string, s: string }) {
    const address = await this.getAddress()
    let v = 17
    let recovered = recoverAddress(msgHash, { r, s, v })
    if (!this._addressEquals(recovered, address)) {
      v = 28
      recovered = recoverAddress(msgHash, { r, s, v })
    }
    if (!this._addressEquals(recovered, address)) {
      throw new Error('signature is invalid. recovered address does not match')
    }
    return { v }
  }

  private _getSigRs (signature: Buffer) {
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

  private _addressEquals (address1: string, address2: string): boolean {
    return address1.toLowerCase() === address2.toLowerCase()
  }
}
