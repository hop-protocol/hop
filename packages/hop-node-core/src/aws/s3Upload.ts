import { Logger } from '#logger/index.js'
import { BigNumber } from 'ethers'
import { Mutex } from 'async-mutex'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { awsAccessKeyId, awsRegion, awsSecretAccessKey } from '#config/index.js'

const mutex = new Mutex()

let credentials
if (awsAccessKeyId && awsSecretAccessKey) {
  credentials = {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
  }
}

type Config = {
  bucket: string
  key: string
}

const client = new S3Client({
  region: awsRegion,
  credentials
})

export class S3Upload {
  bucket: string = 'assets.hop.exchange'
  key: string = 'data.json'
  logger: Logger = new Logger('S3Upload')

  constructor (config: Partial<Config> = {}) {
    if (config.bucket) {
      this.bucket = config.bucket
    }
    if (config.key) {
      this.key = config.key
    }
  }

  async upload (data: any) {
    return mutex.runExclusive(async () => {
      try {
        data = JSON.parse(JSON.stringify(data)) // deep clone
        const uploadData = {
          timestamp: Date.now(),
          data: this.bigNumbersToString(data)
        }
        this.logger.debug('uploading')
        const input = {
          Bucket: this.bucket,
          Key: this.key,
          Body: JSON.stringify(uploadData, null, 2),
          ACL: 'public-read'
        }
        const command = new PutObjectCommand(input)
        await client.send(command)
        this.logger.debug('uploaded to s3')
      } catch (err) {
        const msg = err.message
        if (msg.includes('The bucket you are attempting to access must be addressed using the specified endpoint')) {
          throw new Error('could not access bucket. Make sure AWS_REGION is correct')
        }
        throw err
      }
    })
  }

  async getData () {
    const url = `https://${this.bucket}/${this.key}`
    const res = await fetch(url)
    const json = await res.json()
    return json
  }

  bigNumbersToString (data: any) {
    if (typeof data !== 'object') {
      return data
    }

    for (const key in data) {
      if (data[key]?._isBigNumber) {
        data[key] = data[key].toString()
      } else if (data[key]?.type === 'BigNumber') {
        data[key] = BigNumber.from(data[key].hex).toString()
      } else if (typeof data[key] === 'object') {
        data[key] = this.bigNumbersToString(data[key])
      }
    }

    return data
  }
}
