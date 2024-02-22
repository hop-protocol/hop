import { AwsSigner, AwsSignerConfig } from './AwsSigner.js'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { TextDecoder } from 'node:util'
import {
  arrayify,
  keccak256,
  resolveProperties,
  serializeTransaction
} from 'ethers/lib/utils.js'
import { awsAccessKeyId, awsSecretAccessKey } from '#src/config/index.js'
import { providers } from 'ethers'

type LambdaSignerConfig = AwsSignerConfig & {
  lambdaFunctionName: string
}

const enum ActionTypes {
  GetPublicKey = 'getPublicKey',
  Sign = 'sign',
}

export class LambdaSigner extends AwsSigner {
  config: LambdaSignerConfig
  address: string
  client: LambdaClient
  lambdaFunctionName: string

  constructor (config: LambdaSignerConfig, provider?: providers.Provider) {
    super(config.keyId, provider)
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
    const normalizedTransaction = this.normalizeTransaction(transaction)
    const unsignedTx: any = await resolveProperties(normalizedTransaction)
    const serializedTx = serializeTransaction(unsignedTx)
    const hash = keccak256(serializedTx)
    const txSig: string = await this._signDigest(hash, normalizedTransaction)
    return serializeTransaction(unsignedTx, txSig)
  }

  private async _signDigest (digest: Buffer | string, transaction?: providers.TransactionRequest): Promise<string> {
    const msg = Buffer.from(arrayify(digest))
    const signature: Buffer = await this._getSig(msg, transaction)
    if (signature.length === 0) {
      throw new Error('Error signing message')
    }
    return this.getJoinedSignature(msg, signature)
  }

  private async _getPublicKey (): Promise<Buffer> {
    const myObj = {
      keyId: this.keyId,
      actionType: ActionTypes.GetPublicKey
    }
    const params = {
      FunctionName: this.lambdaFunctionName,
      InvocationType: 'RequestResponse',
      Payload: Buffer.from(JSON.stringify(myObj))
    }
    const command = new InvokeCommand(params)
    const res: any = await this.client.send(command)
    const publicKey: Buffer = await this._lambdaPayloadToBuffer(res.Payload)
    return publicKey
  }

  private async _getSig (msg: Buffer, transaction?: providers.TransactionRequest): Promise<Buffer> {
    const transactionRequest = {
      keyId: this.keyId,
      transaction,
      actionType: ActionTypes.Sign
    }
    const params = {
      FunctionName: this.lambdaFunctionName,
      InvocationType: 'RequestResponse',
      Payload: Buffer.from(JSON.stringify(transactionRequest))
    }
    const command = new InvokeCommand(params)
    const res: any = await this.client.send(command)
    const signature: Buffer = await this._lambdaPayloadToBuffer(res.Payload)
    return signature
  }

  private async _lambdaPayloadToBuffer (payload: any): Promise<Buffer> {
    const decoder = new TextDecoder()
    const decodedSignature: string = decoder.decode(payload)
    // Successful response will return number values and error response will return string values
    const jsonSignature: Record<string, number | string> = JSON.parse(decodedSignature)
    if (typeof jsonSignature?.errorType === 'string') {
      return Buffer.from('')
    }
    const payloadArray = Object.values(jsonSignature as Record<string, number>)
    return Buffer.from(payloadArray)
  }
}
