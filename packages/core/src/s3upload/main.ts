import S3Upload from './S3Upload'
import * as addresses from '../addresses'

async function main () {
  const s3Upload = new S3Upload()
  const networks = ['mainnet', 'kovan', 'goerli']
  for (const network of networks) {
    const filename = `${network}/v1-core-config.json`
    await s3Upload.upload(filename, (addresses as any)[network])
  }
  console.log('done')
}

main()
