import Base from '../../src/Base'
import BaseConsumer from './Base-consumer'
import { Wallet } from 'ethers'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { config } from '../../src/config'
import { privateKey } from '../config'
jest.mock('../../src/Base')

function getBaseMock (Base: any) {
  return Base.mock
}

function getBaseConsumer () {
  const signer = new Wallet(privateKey)
  return new BaseConsumer('mainnet', signer, config.chains)
}

describe('Base-consumer', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (Base as any).mockClear()
  })

  it('check if the consumer called the Base constructor', () => {
    const baseConsumer = getBaseConsumer()
    expect(Base).toHaveBeenCalledTimes(1)
  })

  it('check if the consumer called isValidNetwork on the Base instance', () => {
    expect(Base).not.toHaveBeenCalled()

    const baseConsumer = getBaseConsumer()
    // Constructor should have been called again:
    expect(Base).toHaveBeenCalledTimes(1)

    baseConsumer.checkIsValidNetwork()

    const baseMock = getBaseMock(Base)

    // mock.instances is available with automatic mocks:
    const mockBaseInstance = baseMock.instances[0]
    const mockIsValidNetwork = mockBaseInstance.isValidNetwork

    expect(mockIsValidNetwork).toHaveBeenCalledWith('mainnet')
    expect(mockIsValidNetwork).toHaveBeenCalledTimes(1)
  })

  it('check if the consumer called getChainProvider on the Base instance', () => {
    const baseConsumer = getBaseConsumer()
    expect(Base).toHaveBeenCalledTimes(1)

    baseConsumer.chainProvider('xdai')

    const baseMock = getBaseMock(Base)

    // mock.instances is available with automatic mocks:
    const mockBaseInstance = baseMock.instances[0]
    const mockGetChainProvider = mockBaseInstance.getChainProvider

    expect(mockGetChainProvider).toHaveBeenCalledWith('xdai')
    expect(mockGetChainProvider).toHaveBeenCalledTimes(1)
  })
})
