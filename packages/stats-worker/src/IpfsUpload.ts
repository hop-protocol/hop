import fs from 'fs'
import path from 'path'
import pinataSDK from '@pinata/sdk'
import { pinataApiKey, pinataSecretApiKey } from './config'

class IpfsUpload {
  pinata: any
  dirName = 'generated'

  constructor () {
    if (!pinataApiKey) {
      throw new Error('pinataApiKey not found')
    }
    if (!pinataSecretApiKey) {
      throw new Error('pinataSecretApiKey not found')
    }
    this.pinata = pinataSDK(pinataApiKey, pinataSecretApiKey)
    this.pinata.testAuthentication().catch((err: any) => {
      console.error(err)
    })
  }

  async upload (data: any) {
    console.log('uploading')
    const dir = path.resolve(this.dirName)
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
  }
}

export default IpfsUpload
