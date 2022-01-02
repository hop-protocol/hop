require('dotenv').config()
const {
  CloudFrontClient,
  UpdateDistributionCommand,
  GetDistributionConfigCommand,
  CreateInvalidationCommand
} = require('@aws-sdk/client-cloudfront')

const awsAccessKeyId = process.env.IPFS_DEPLOY_AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.IPFS_DEPLOY_AWS_SECRET_ACCESS_KEY
const awsProfile = process.env.IPFS_DEPLOY_AWS_PROFILE
const awsRegion = process.env.IPFS_DEPLOY_AWS_REGION || 'us-east-1'
const distributionId = process.env.IPFS_DEPLOY_AWS_CLOUDFRONT_DISTRIBUTION_ID
const ipfsHash = (process.env.IPFS_HASH || '').trim()

if (!ipfsHash) {
  throw new Error('IPFS_HASH is required')
}

if (!distributionId) {
  throw new Error('IPFS_DEPLOY_AWS_CLOUDFRONT_DISTRIBUTION_ID is required')
}

if (!ipfsHash.startsWith('Qm')) {
  throw new Error(`ipfs hash "${ipfsHash}" is invalid`)
}

let credentials
if (awsAccessKeyId) {
  credentials = {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
  }
}

const client = new CloudFrontClient({
  region: awsRegion,
  profile: awsProfile,
  credentials
})

const originPath = `/ipfs/${ipfsHash}`

console.log('updating CloudFront Origin Path...')
console.log('OriginPath:', originPath)

async function main () {
  try {
    const getDistributionConfigCmd = new GetDistributionConfigCommand({
      Id: distributionId
    })
    const { DistributionConfig, ETag } = await client.send(getDistributionConfigCmd)

    DistributionConfig.Origins.Items[0].OriginPath = originPath

    const updateDistributionCmd = new UpdateDistributionCommand({
      DistributionConfig,
      Id: distributionId,
      IfMatch: ETag
    })

    const updateRes = await client.send(updateDistributionCmd)
    console.log(updateRes)

    const createInvalidationCmd = new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: Date.now(),
        Paths: {
          Items: ['/*'],
          Quantity: 1
        }
      }
    })

    const invalidationRes = await client.send(createInvalidationCmd)
    console.log(invalidationRes)
  } catch (err) {
    console.error(err)
  }
}

main()
