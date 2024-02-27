import { appTld } from '#config/index.js'
import { getNameservers } from '#utils/getNameservers.js'

test('getBumpedBN', async () => {
  const servers = await getNameservers(appTld)
  expect(servers.length).toBeGreaterThan(0)
  for (const server of servers) {
    expect(server.includes('cloudflare.com')).toBe(true)
  }
})
