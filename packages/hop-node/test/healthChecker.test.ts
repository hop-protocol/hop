import { HealthCheckWatcher } from 'src/watchers/HealthCheckWatcher'

describe.skip('Health Checker', () => {
  const days = 2
  const healthCheck = new HealthCheckWatcher({
    days
  })

  it('Unset transfer roots', async () => {
    const res = await healthCheck.getUnsetTransferRoots()
    expect(Array.isArray(res)).toBe(true)
  })

  it('Unrelayed Transfers', async () => {
    const res = await healthCheck.getUnrelayedTransfers()
    expect(Array.isArray(res)).toBe(true)
  })
})
