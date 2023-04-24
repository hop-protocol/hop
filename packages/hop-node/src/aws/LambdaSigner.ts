import { TextDecoder } from 'util'
import { providers } from 'ethers'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { AwsSigner, AwsSignerConfig } from './AwsSigner'
import {
  arrayify,
  keccak256,
  resolveProperties,
  serializeTransaction
} from 'ethers/lib/utils'
import { awsAccessKeyId, awsSecretAccessKey } from '../config'

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
    return this.getJoinedSignature(msg, signature)
  }

  private async _getPublicKey(): Promise<Buffer> {
    const myObj = {
      keyId: this.keyId,
      actionType: ActionTypes.GetPublicKey
    }
    const params = {
      FunctionName: this.lambdaFunctionName,
      InvocationType: "RequestResponse",
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
      InvocationType: "RequestResponse",
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
    const jsonSignature: Record<string, number> = JSON.parse(decodedSignature)
    const payloadArray = Object.values(jsonSignature)
    return Buffer.from(payloadArray)
  }
}