import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { awsAccessKeyId, awsSecretAccessKey, awsRegion } from './config'

let credentials
if (awsAccessKeyId) {
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
    const input = {
      Bucket: 'assets.hop.exchange',
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ACL: 'public-read'
    }
    const command = new PutObjectCommand(input)
    await client.send(command)
    console.log('uploaded to s3')
  }
}

export default S3Upload
