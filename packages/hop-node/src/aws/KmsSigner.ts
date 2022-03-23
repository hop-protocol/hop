import { BigNumber, Signer } from 'ethers'
import { GetPublicKeyCommand, KMSClient, SignCommand } from '@aws-sdk/client-kms'
import { arrayify, hashMessage, joinSignature, keccak256, recoverAddress, resolveProperties, serializeTransaction } from 'ethers/lib/utils'
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

// details:
// https://ethereum.stackexchange.com/a/73371/5093
export class KmsSigner extends Signer {
  keyId: string
  address: string
  client: KMSClient

  constructor (keyId: string) {
    super()
    this.keyId = keyId
    this.client = new KMSClient({ region: 'us-west-1' })
  }

  connect (provider: any) {
    // TODO
    return provider
  }

  async getAddress () {
    if (this.address) {
      return this.address
    }
    const publicKey = await this._getKmsPublicKey()
    const address = this._getEthereumAddress(publicKey)
    this.address = address
    return address
  }

  async signMessage (msg: Buffer | string) {
    const hash = Buffer.from(hashMessage(msg).slice(2), 'hex')
    return this._signDigest(hash)
  }

  async signTransaction (transaction: any) {
    const unsignedTx: any = await resolveProperties(transaction)
    const serializedTx = serializeTransaction(unsignedTx)
    const hash = Buffer.from(keccak256(serializedTx).slice(2), 'hex')
    const txSig = await this._signDigest(hash)
    return serializeTransaction(unsignedTx, txSig)
  }

  private async _getKmsPublicKey () {
    const command = new GetPublicKeyCommand({
      KeyId: this.keyId
    })
    const res: any = await this.client.send(command)
    return Buffer.from(res.PublicKey)
  }

  private async _kmsSign (msg: Buffer) {
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

  private _getEthereumAddress (publicKey: Buffer) {
    const res = EcdsaPubKey.decode(publicKey, 'der')
    const pubKeyBuffer = res.pubKey.data.slice(1)
    const addressBuf = Buffer.from(keccak256(pubKeyBuffer).slice(2), 'hex')
    const address = `0x${addressBuf.slice(-20).toString('hex')}`
    return address
  }

  private async _signDigest (digest: Buffer | string) {
    const msg = Buffer.from(arrayify(digest))
    const signature = await this._kmsSign(msg)
    const { r, s } = this._getSigRs(signature)
    const { v } = await this._getSigV(msg, { r, s })
    const joinedSignature = joinSignature({ r, s, v })
    return joinedSignature
  }

  private async _getSigV (msgHash: Buffer, { r, s }: any) {
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
    const secp256k1N = BigNumber.from('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')
    const secp256k1halfN = secp256k1N.div(BigNumber.from(2))
    if (sBn.gt(secp256k1halfN)) {
      sBn = secp256k1N.sub(sBn)
    }
    const r = rBn.toHexString()
    const s = sBn.toHexString()
    return { r, s }
  }

  private _addressEquals (address1: string, address2: string) {
    return address1.toLowerCase() === address2.toLowerCase()
  }
}

async function example () {
  const keyId = '32a977a2-b532-40b3-af2e-f064d3980f75'
  const signer = new KmsSigner(keyId)
  const address = await signer.getAddress()
  const msg = 'Hello World'
  const signature = await signer.signMessage(msg)
  const transaction = {
    to: '0x0000000000000000000000000000000000000000',
    value: '0x00',
    data: '0x',
    gasLimit: '0x5208',
    gasPrice: '0x4a817c800',
    nonce: '0x00',
    chainId: 1
  }
  const txSignature = await signer.signTransaction(transaction)
  console.log('address:', address)
  console.log('signature:', signature)
  console.log('txSignature:', txSignature)
}
