import fetch from 'isomorphic-fetch'
import { cloudflareZoneId, cloudflareToken } from './config'

export class Cloudflare {
  async getRecordId (dnslinkDomain: string) {
    const url = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records?name=${dnslinkDomain}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cloudflareToken}`,
        'Content-Type': 'application/json'
      }
    })

    const json = await res.json()
    if (!json.success) {
      throw new Error('no success')
    }

    const id = json.result?.[0]?.id
    if (!id) {
      throw new Error('no id found')
    }

    return id
  }

  async updateDnslink (dnslinkDomain: string, ipfsHash: string) {
    if (!dnslinkDomain.startsWith('_dnslink')) {
      throw new Error('invalid dnslink domain')
    }

    const recordId = await this.getRecordId(dnslinkDomain)
    const url = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records/${recordId}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cloudflareToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'TXT',
        name: dnslinkDomain,
        content: `dnslink=ipfs/${ipfsHash}`
      })
    })

    const json = await res.json()
    if (!json.success) {
      throw new Error('no success')
    }

    const result = json.result
    if (!result) {
      throw new Error('no result')
    }

    return result
  }
}
