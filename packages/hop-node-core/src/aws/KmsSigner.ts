import { AwsSigner, AwsSignerConfig } from './AwsSigner.js'
import { GetPublicKeyCommand, KMSClient, SignCommand } from '@aws-sdk/client-kms'
import {
  arrayify,
  hashMessage,
  keccak256,
  resolveProperties,
  serializeTransaction
} from 'ethers/lib/utils.js'
import { awsAccessKeyId, awsSecretAccessKey } from '#config/index.js'
import { providers } from 'ethers'

type KmsSignerConfig = AwsSignerConfig

export class KmsSigner extends AwsSigner {
  config: KmsSignerConfig
  address: string
  client: KMSClient

  constructor (config: KmsSignerConfig, provider?: providers.Provider) {
    super(config.keyId, provider)
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
  }

  connect (provider: providers.Provider): KmsSigner {
    return new KmsSigner(this.config, provider)
  }

  async getAddress (): Promise<string> {
    if (this.address) {
      return this.address
    }
    const publicKey = await this._getPublicKey()
    const address = this.getEthereumAddress(publicKey)
    this.address = address
    return address
  }

  async signMessage (msg: Buffer | string): Promise<string> {
    const hash = hashMessage(msg)
    return this._signDigest(hash)
  }

  async signTransaction (transaction: providers.TransactionRequest): Promise<string> {
    const normalizedTransaction = this.normalizeTransaction(transaction)
    const unsignedTx: any = await resolveProperties(normalizedTransaction)
    const serializedTx = serializeTransaction(unsignedTx)
    const hash = keccak256(serializedTx)
    const txSig: string = await this._signDigest(hash)
    return serializeTransaction(unsignedTx, txSig)
  }

  private async _signDigest (digest: Buffer | string): Promise<string> {
    const msg = Buffer.from(arrayify(digest))
    const signature: Buffer = await this._getSig(msg)
    return this.getJoinedSignature(msg, signature)
  }

  private async _getPublicKey (): Promise<Buffer> {
    const command = new GetPublicKeyCommand({
      KeyId: this.keyId
    })
    const res: any = await this.client.send(command)
    return Buffer.from(res.PublicKey)
  }

  private async _getSig (msg: Buffer): Promise<Buffer> {
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
}
