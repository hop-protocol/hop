import { TextDecoder } from 'util'
import { providers } from 'ethers'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { AwsSigner, AwsSignerConfig } from './AwsSigner'
import {
  arrayify,
  joinSignature,
  keccak256,
  resolveProperties,
  serializeTransaction
} from 'ethers/lib/utils'
import { awsAccessKeyId, awsSecretAccessKey } from '../config'

type LambdaSignerConfig = AwsSignerConfig & {
  lambdaFunctionName: string
}

export class LambdaSigner extends AwsSigner {
  config: LambdaSignerConfig
  address: string
  client: LambdaClient
  lambdaFunctionName: string

  constructor (config: LambdaSignerConfig, provider?: providers.Provider) {
    super(config, provider)
    let credentials
    if (awsAccessKeyId && awsSecretAccessKey) {
      credentials = {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey
      }
    }
    if (!config.lambdaFunctionName) {
      throw new Error('Lambda function name is required')
    }
    this.client = new LambdaClient({
      region: config.region,
      credentials
    })
    this.lambdaFunctionName = config.lambdaFunctionName
  }

  connect (provider: providers.Provider): LambdaSigner {
    return new LambdaSigner(this.config, provider)
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
    throw new Error('Signing arbitrary messages is not supported. LambdaSigner performs validation on transactions. Validation can be bypassed with arbitrary data.')
  }

  async signTransaction (transaction: providers.TransactionRequest): Promise<string> {
    const unsignedTx: any = await resolveProperties(transaction)
    const serializedTx = serializeTransaction(unsignedTx)
    const hash = keccak256(serializedTx)
    const txSig = await this._signDigest(hash, transaction)
    return serializeTransaction(unsignedTx, txSig)
  }

  private async _signDigest (digest: Buffer | string, transaction?: providers.TransactionRequest): Promise<string> {
    const msg = Buffer.from(arrayify(digest))
    const signature = await this._getSig(msg, transaction)
    const { r, s } = this.getSigRs(signature)
    const { v } = await this.getSigV(msg, { r, s })
    const joinedSignature = joinSignature({ r, s, v })
    return joinedSignature
  }

  private async _getPublicKey(): Promise<Buffer> {
    const myObj = {
      keyId: this.keyId,
      shouldReturnPublicKey: true
    }
    const params = {
      FunctionName: this.lambdaFunctionName,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify(myObj))
    }
    const command = new InvokeCommand(params)
    const res: any = await this.client.send(command)
    const publicKey: Uint8Array = await this._lambdaPayloadToUint8Array(res.Payload)
    return Buffer.from(publicKey)
  }

  private async _getSig (msg: Buffer, transaction?: providers.TransactionRequest): Promise<Buffer> {
    const transactionRequest = {
      keyId: this.keyId,
      transaction
    }
    const params = {
      FunctionName: this.lambdaFunctionName,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify(transactionRequest))
    }
    const command = new InvokeCommand(params)
    const res: any = await this.client.send(command)
    const signature: Uint8Array = await this._lambdaPayloadToUint8Array(res.Payload)
    return Buffer.from(signature)
  }

  private async _lambdaPayloadToUint8Array (payload: any): Promise<Uint8Array> {
    const decoder = new TextDecoder()
    const decodedSignature: string = decoder.decode(payload)
    const jsonSignature: any = JSON.parse(decodedSignature)

    let signatureNumberArray: number[] = []
    for (const index in jsonSignature) {
      signatureNumberArray.push(jsonSignature[index])
    }
    return Uint8Array.from(signatureNumberArray)
  }
}