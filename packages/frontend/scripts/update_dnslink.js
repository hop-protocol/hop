require('dotenv').config()
const {
  Route53Client,
  ChangeResourceRecordSetsCommand
} = require('@aws-sdk/client-route-53')

const awsProfile = process.env.AWS_PROFILE
const hostZoneId = process.env.AWS_ROUTE53_HOST_ZONE_ID
const ipfsHash = process.env.IPFS_HASH
const domain = process.env.DNSLINK_DOMAIN || '_dnslink.hop.exchange.'

if (!ipfsHash) {
  throw new Error('IPFS_HASH is required')
}

if (!hostZoneId) {
  throw new Error('AWS_ROUTE53_HOST_ZONE_ID is required')
}

const client = new Route53Client({
  region: 'us-east-1',
  profile: awsProfile
})

const dnslink = `dnslink=/ipfs/${ipfsHash}`
const txtValue = `\"${dnslink}\"`

const command = new ChangeResourceRecordSetsCommand({
  HostedZoneId: hostZoneId,
  ChangeBatch: {
    Changes: [
      {
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: domain,
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
