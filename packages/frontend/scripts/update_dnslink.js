require('dotenv').config()
const {
  Route53Client,
  ChangeResourceRecordSetsCommand
} = require('@aws-sdk/client-route-53')

const awsAccessKeyId = process.env.IPFS_DEPLOY_AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.IPFS_DEPLOY_AWS_SECRET_ACCESS_KEY
const awsProfile = process.env.IPFS_DEPLOY_AWS_PROFILE
const awsRegion = process.env.IPFS_DEPLOY_AWS_REGION || 'us-east-1' // e.g. 'us-west-1'
const hostZoneId = process.env.IPFS_DEPLOY_AWS_ROUTE53_HOST_ZONE_ID
const ipfsHash = (process.env.IPFS_HASH || '').trim()
const host = (process.env.IPFS_DEPLOY_DNSLINK_HOST || '').trim() // e.g. '_dnslink.hop.exchange.'

if (!ipfsHash) {
  throw new Error('IPFS_HASH is required')
}

if (!hostZoneId) {
  throw new Error('IPFS_DEPLOY_AWS_ROUTE53_HOST_ZONE_ID is required')
}

if (!host) {
  throw new Error('IPFS_DEPLOY_DNSLINK_HOST is required')
}

if (!host.startsWith('_dnslink.')) {
  throw new Error(`dnslink host "${host}" is invalid`)
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

const client = new Route53Client({
  region: awsRegion,
  profile: awsProfile,
  credentials
})

const dnslink = `dnslink=/ipfs/${ipfsHash}`
const txtValue = `"${dnslink}"`

console.log('updating DNS TXT...')
console.log('Host:', host)
console.log('Value:', txtValue)

const command = new ChangeResourceRecordSetsCommand({
  HostedZoneId: hostZoneId,
  ChangeBatch: {
    Changes: [
      {
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: host,
          Type: 'TXT',
          TTL: 300,
          ResourceRecords: [
            {
              Value: txtValue
            }
          ]
        }
      }
    ]
  }
})

async function main () {
  try {
    const res = await client.send(command)
    console.log(res)
  } catch (err) {
    console.error(err)
  }
}

main()
