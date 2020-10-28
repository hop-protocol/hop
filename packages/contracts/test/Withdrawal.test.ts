import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'

import Withdrawal from '../lib/Withdrawal'

describe('Withdrawal', () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let Bridge: ContractFactory
  let MockERC20: ContractFactory
  let withdrawals: Withdrawal[]

  let poolToken: Contract
  let bridge: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]
    Bridge = await ethers.getContractFactory('contracts/Bridge.sol:Bridge')
    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    withdrawals = [
      new Withdrawal({
        amount: BigNumber.from('12345'),
        nonce: 0,
        sender: await user.getAddress(),
      }),
      new Withdrawal({
        amount: BigNumber.from('12345'),
        nonce: 0,
        sender: await liquidityProvider.getAddress(),
      })
    ]
  })

  beforeEach(async () => {
    // Deploy contracts
    poolToken = await MockERC20.deploy()
    bridge = await Bridge.deploy(poolToken.address)
  })

  describe('getWithdrawalHash()', () => {
    it('should match onchain hash calculation', async () => {
      const onchainHashHex = await bridge.getWithdrawalHash(
        withdrawals[0].amount,
        withdrawals[0].nonce,
        withdrawals[0].sender
      )
      const onchainHash = Buffer.from(
        onchainHashHex.slice(2),
        'hex'
      )

      const offchainHash = withdrawals[0].getWithdrawalHash()

      expect(Buffer.compare(onchainHash, offchainHash)).to.eq(0)
    })
  })
})