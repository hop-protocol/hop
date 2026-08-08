import { assertSafeRpcUrl, isBlockedIp } from '../src/rpcUrlSafety'

describe('rpcUrlSafety', () => {
  it('blocks loopback, private, link-local, and CGNAT IPv4', () => {
    expect(isBlockedIp('127.0.0.1')).toBe(true)
    expect(isBlockedIp('10.0.0.1')).toBe(true)
    expect(isBlockedIp('192.168.1.1')).toBe(true)
    expect(isBlockedIp('172.16.0.1')).toBe(true)
    expect(isBlockedIp('169.254.169.254')).toBe(true)
    expect(isBlockedIp('100.64.0.1')).toBe(true)
    expect(isBlockedIp('1.1.1.1')).toBe(false)
  })

  it('blocks localhost and private literal URLs', async () => {
    await expect(assertSafeRpcUrl('http://127.0.0.1:8545')).rejects.toThrow(/not allowed/)
    await expect(assertSafeRpcUrl('http://169.254.169.254/latest/meta-data')).rejects.toThrow(/not allowed/)
    await expect(assertSafeRpcUrl('http://localhost:8545')).rejects.toThrow(/not allowed/)
    await expect(assertSafeRpcUrl('file:///etc/passwd')).rejects.toThrow(/protocol/)
  })

  it('allows public https RPC URLs by IP literal', async () => {
    await expect(assertSafeRpcUrl('https://1.1.1.1/rpc')).resolves.toBe('https://1.1.1.1/rpc')
  })
})
