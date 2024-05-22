import { Credentials } from '@aws-sdk/types'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { awsAccessKeyId, awsRegion, awsSecretAccessKey } from './config.js'
import * as addresses from '@hop-protocol/sdk/addresses'
import * as config from '@hop-protocol/sdk/config'

let credentials: Credentials | undefined
if (awsAccessKeyId && awsSecretAccessKey) {
  credentials = {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
  }
}

const client = new S3Client({
  region: awsRegion,
  credentials
})

class S3Upload {
  async upload (key: string, data: any) {
    console.log('uploading')
    await this.#uploadData(key, data)
  }

  async uploadConfig () {
    console.log('uploading')
    const networks = ['mainnet', 'goerli']
    for (const network of networks) {
      const key = `${network}/v1-core-config.json`
      const data = {
        ...(addresses as any)[network],
        ...(config as any)[network]
      }
      await this.#uploadData(key, data)
    }
  }

  async #uploadData (key: string, value: any): Promise<any> {
    const input = {
      Bucket: 'assets.hop.exchange',
      Key: key,
      Body: JSON.stringify(value, null, 2),
      ACL: 'public-read'
    }
    console.log(JSON.stringify(value, null, 2))
    const command = new PutObjectCommand(input)
    await client.send(command)
    console.log('uploaded to s3')
  }
}

export default S3Upload
