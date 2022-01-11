import { jest, it, describe, expect } from '@jest/globals'
import { Wallet } from 'ethers'
import { privateKey } from '../config'
import Base from '../../src/Base'

const warn = jest.spyOn(global.console, 'warn')

describe('Base', () => {
  it('should return the Gnosis chain provider and warn the sdk consumer when attempting to connect to xdai chain', () => {
    const signer = new Wallet(privateKey)
    const base = new Base('mainnet', signer)
    const p: any = base.getChainProvider('xdai')

    expect(warn).toHaveBeenCalledWith(
      'NOTICE: xDai has been rebranded to Gnosis. Chain "xdai" is deprecated. Use "gnosis" instead.'
    )

    expect(p.connection.url).toBe('https://rpc.gnosischain.com/')
  })
})
