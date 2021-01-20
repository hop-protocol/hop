import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'

import Transfer from '../lib/Transfer'

const RELAYER_FEE = BigNumber.from('1000000000000000000')
const MAINNET_CHAIN_ID = BigNumber.from('1')

describe('Transfer', () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let committee: Signer
  let L1_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let transfers: Transfer[]

  let poolToken: Contract
  let bridge: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]
    committee = accounts[2]
    L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    transfers = [
      new Transfer({
        chainId: MAINNET_CHAIN_ID,
        sender: await user.getAddress(),
        recipient: await user.getAddress(),
        amount: BigNumber.from('12345'),
        transferNonce: 0,
        relayerFee: RELAYER_FEE,
        amountOutMin: BigNumber.from('0'),
        deadline: BigNumber.from('0')
      }),
      new Transfer({
        chainId: MAINNET_CHAIN_ID,
        sender: await liquidityProvider.getAddress(),
        recipient: await liquidityProvider.getAddress(),
        amount: BigNumber.from('12345'),
        transferNonce: 0,
        relayerFee: RELAYER_FEE,
        amountOutMin: BigNumber.from('0'),
        deadline: BigNumber.from('0')
      })
    ]
  })

  beforeEach(async () => {
    // Deploy contracts
    poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
    bridge = await L1_Bridge.deploy(poolToken.address, await committee.getAddress())
  })

  describe('getTransferHash()', () => {
    it('should match onchain hash calculation', async () => {
      const onchainHashHex = await bridge.getTransferHash(
        transfers[0].chainId,
        transfers[0].sender,
        transfers[0].recipient,
        transfers[0].amount,
        transfers[0].transferNonce,
        transfers[0].relayerFee,
        transfers[0].amountOutMin,
        transfers[0].deadline
      )
      const onchainHash = Buffer.from(
        onchainHashHex.slice(2),
        'hex'
      )

      const offchainHash = transfers[0].getTransferHash()

      expect(Buffer.compare(onchainHash, offchainHash)).to.eq(0)
    })
  })
})