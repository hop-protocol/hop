import S3Upload from './S3Upload'
import * as addresses from '../addresses'
import * as config from '../config'

async function main () {
  const s3Upload = new S3Upload()
  const networks = ['mainnet', 'goerli']
  // const networks = ['goerli']
  for (const network of networks) {
    const filename = `${network}/v1-core-config.json`
    const data = {
      ...(addresses as any)[network],
      ...(config as any)[network]
    }
    console.log(JSON.stringify(data, null, 2))
    await s3Upload.upload(filename, data)
  }
  console.log('done')
}

main()
