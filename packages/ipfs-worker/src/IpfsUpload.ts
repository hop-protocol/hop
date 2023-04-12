import fs from 'fs'
import path from 'path'
import pinataSDK from '@pinata/sdk'
import { pinataApiKey, pinataSecretApiKey } from './config'

export class IpfsUpload {
  pinata = pinataSDK(pinataApiKey, pinataSecretApiKey)

  constructor () {
    this.pinata.testAuthentication().catch(err => {
      console.error(err)
    })
  }

  async uploadJson (data: any) {
    console.log('uploading json to ipfs')
    const dirName = 'generated'
    const dir = path.resolve(dirName)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    fs.writeFileSync(dir + '/data.json', JSON.stringify(data, null, 2))

    const res = await this.pinata.pinFromFS(dir, {
      pinataOptions: {
        wrapWithDirectory: false
      }
    })
    const ipfsHash = res.IpfsHash
    console.log('uploaded to ipfs')
    console.log(ipfsHash)
    return ipfsHash
  }

  async uploadDir (dirPath: string) {
    console.log('uploading dir to ipfs')
    const res = await this.pinata.pinFromFS(dirPath, {
      pinataOptions: {
        wrapWithDirectory: false
      }
    })
    const ipfsHash = res.IpfsHash
    console.log('uploaded to ipfs')
    console.log(ipfsHash)
    return ipfsHash
  }
}
