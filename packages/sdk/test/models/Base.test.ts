import Base from '../../src/Base'
import { Errors } from '../../src/constants'
import { Wallet } from 'ethers'
import { describe, expect, it, jest } from '@jest/globals'
import { privateKey } from '../config'

const warn = jest.spyOn(global.console, 'warn')

function cleanupMock (mock: any) {
  mock.mockClear()
  mock.mockReset()
  mock.mockRestore()
}

describe('Base', () => {
  it('should return the Gnosis chain provider and warn the sdk consumer when attempting to connect to xdai chain', () => {
    const signer = new Wallet(privateKey)
    const base = new Base('mainnet', signer)
    const p: any = base.getChainProvider('xdai')

    expect(warn).toHaveBeenCalledWith(Errors.xDaiRebrand)

    cleanupMock(warn)

    expect(p.connection.url).toBe('https://rpc.gnosischain.com/')
  })
})
