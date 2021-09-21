import Logger from 'src/logger'
import fetch from 'node-fetch'
import queue from 'src/decorators/queue'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { awsAccessKeyId, awsRegion, awsSecretAccessKey } from '../config'
import { boundClass } from 'autobind-decorator'

let credentials
if (awsAccessKeyId) {
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

@boundClass
class S3Upload {
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

  getQueueGroup () {
    return 's3'
  }

  @queue
  async upload (data: any, keyToReplace?: string) {
    const uploadData = {
      timestamp: Date.now(),
      data
    }
    if (keyToReplace) {
      const res = await this.getData()
      let _data = res.data
      if (!res?.data) {
        _data = {}
      }
      _data[keyToReplace] = data
      uploadData.data = _data
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
  }

  async getData () {
    const url = `https://${this.bucket}/${this.key}`
    const res = await fetch(url)
    const json = res.json()
    return json
  }
}

export default S3Upload
