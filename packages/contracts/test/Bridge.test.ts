import { expect } from 'chai'
import { ethers } from '@nomiclabs/buidler'
import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'
import MerkleTree from '../lib/MerkleTree'
import Withdrawal from '../lib/Withdrawal'

const USER_INITIAL_BALANCE = BigNumber.from('1000000')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const AMOUNT = BigNumber.from('123')

describe("Bridge", () => {
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
    Bridge = await ethers.getContractFactory('Bridge')
    MockERC20 = await ethers.getContractFactory('MockERC20')
    withdrawals = [
      new Withdrawal({
        amount: BigNumber.from('12345'),
        nonce: 0,
        sender: await user.getAddress(),
      }),
      new Withdrawal({
        amount: BigNumber.from('12345'),
        nonce: 0,
        sender: await accounts[1].getAddress(),
      })
    ]
  })

  beforeEach(async () => {
    // Deploy contracts
    poolToken = await MockERC20.deploy()
    bridge = await Bridge.deploy(poolToken.address)

    // Distribute poolToken
    await poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await poolToken.mint(bridge.address, '500000')
  })

  it('Should have distributed poolToken', async () => {
    const userBalance = await poolToken.balanceOf(await user.getAddress())
    expect(userBalance.toString()).to.eq(USER_INITIAL_BALANCE)

    const liquidityProviderBalance = await poolToken.balanceOf(await liquidityProvider.getAddress())
    expect(liquidityProviderBalance.toString()).to.eq(LIQUIDITY_PROVIDER_INITIAL_BALANCE)
  })

  it('Should complete a withdrawal', async () => {
    // Set withdrawalHash
    const withdrawalHashes = withdrawals.map( withdrawal => withdrawal.getWithdrawalHash() )
    const tree = new MerkleTree(withdrawalHashes)

    await bridge.setWithdrawalRoot(tree.getRoot())

    // Complete withdrawal
    const userInitialBalance: BigNumber = await bridge.balanceOf(user.getAddress())

    await bridge.connect(user).bridgeWithdraw(
      withdrawals[0].amount,
      withdrawals[0].nonce,
      tree.getRoot(),
      tree.getProof(withdrawalHashes[0])
    )

    const userBalance: BigNumber = await bridge.balanceOf(user.getAddress())
    const amountWithdrawn = userBalance.sub(userInitialBalance)

    expect(amountWithdrawn.toString()).to.eq(withdrawals[0].amount.toString())
  })
})
