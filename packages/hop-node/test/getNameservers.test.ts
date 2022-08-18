import { appTld } from 'src/config'
import { getNameservers } from 'src/utils/getNameservers'

test('getBumpedBN', async () => {
  const servers = await getNameservers(appTld)
  expect(servers.length).toBeGreaterThan(0)
  for (const server of servers) {
    expect(server.includes('cloudflare.com')).toBe(true)
  }
})
