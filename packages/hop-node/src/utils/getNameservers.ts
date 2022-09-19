import dns from 'dns'

dns.setServers(['8.8.8.8'])

export async function getNameservers (domain: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    dns.resolveNs(domain, (err: any, res: string[]) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })
}
