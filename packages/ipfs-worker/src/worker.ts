import wait from 'wait'
import fs from 'fs'
import path from 'path'
import { fetchJsonOrThrow } from './utils/fetchJsonOrThrow'
import {
  cloudflareToken,
  cloudflareZoneId,
  outdir,
  pinataApiKey,
  pinataSecretApiKey
} from './config'
import { IpfsUpload } from './IpfsUpload'
import { Cloudflare } from './Cloudflare'

type Options = {
  pollIntervalSeconds?: number
}

class Worker {
  pollIntervalMs: number = 60 * 60 * 1000
  ipfsUpload: IpfsUpload
  cloudflare: Cloudflare

  constructor (options: Options = {}) {
    if (options.pollIntervalSeconds) {
      this.pollIntervalMs = options.pollIntervalSeconds * 1000
    }
    this.ipfsUpload = new IpfsUpload()
    this.cloudflare = new Cloudflare()

    if (!(pinataApiKey && pinataSecretApiKey)) {
      throw new Error('pinata keys not found')
    }
  }

  async start () {
    const fileMapping: Record<string, string> = {
      'https://assets.hop.exchange/mainnet/v1-core-config.json':
        'sdk/mainnet/v1-core-config.json',
      'https://assets.hop.exchange/mainnet/v1-available-liquidity.json':
        'sdk/mainnet/v1-available-liquidity.json'
    }

    const dnslinkDomain = '_dnslink.ipfs-assets.hop.exchange'

    const dirPath = outdir
      ? path.resolve(outdir)
      : path.resolve(__dirname, 'out')
    while (true) {
      try {
        console.log(`poll started (${new Date()})`)
        for (const remoteFile in fileMapping) {
          console.log(`fetching ${remoteFile}`)
          const saveLocation = fileMapping[remoteFile]
          const outfile = path.resolve(dirPath, saveLocation)
          const json = await fetchJsonOrThrow(remoteFile)
          console.log(`saving to ${outfile}`)
          fs.mkdirSync(path.dirname(outfile), { recursive: true })
          fs.writeFileSync(outfile, JSON.stringify(json, null, 2))
        }

        const ipfsHash = await this.ipfsUpload.uploadDir(dirPath)
        const shouldUpdateDnslink =
          ipfsHash && cloudflareZoneId && cloudflareToken
        if (shouldUpdateDnslink) {
          console.log('updating dnslink')
          await this.cloudflare.updateDnslink(dnslinkDomain, ipfsHash)
        }
        console.log('done with poll')
      } catch (err) {
        console.error(err)
      }
      await wait(this.pollIntervalMs)
    }
  }
}

export default Worker
