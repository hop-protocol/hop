import { Cloudflare } from '../src/Cloudflare'

describe.skip('cloudflare', () => {
  it('should get record if for dnslink domain', async () => {
    const cloudflare = new Cloudflare()
    const dnslinkDomain = '_dnslink.ipfs-assets.hop.exchange'
    const recordId = await cloudflare.getRecordId(dnslinkDomain)
    console.log(recordId)
    expect(recordId).toBeTruthy()
  })

  it('should update dnslink record', async () => {
    const cloudflare = new Cloudflare()
    const dnslinkDomain = '_dnslink.ipfs-assets.hop.exchange'
    const ipfsHash = 'Qmdk2pY1hyibv7AhMUr8xZvJLcfwzjXU58wRVnwHAkUUUc'
    const res = await cloudflare.updateDnslink(dnslinkDomain, ipfsHash)
    console.log(res)
    expect(res).toBeTruthy()
  })
})
