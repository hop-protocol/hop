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
  let withdrawals: Withdrawal[]

  // Factories
  let Bridge: ContractFactory
  let MockERC20: ContractFactory
  let CrossDomainMessenger: ContractFactory

  let poolToken: Contract
  let bridge: Contract
  let l1CrossDomainMessenger: Contract
  let l2CrossDomainMessenger: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]
    Bridge = await ethers.getContractFactory('Bridge')
    MockERC20 = await ethers.getContractFactory('MockERC20')
    CrossDomainMessenger = await ethers.getContractFactory('mockOVM_CrossDomainMessenger')
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

    l1CrossDomainMessenger = await CrossDomainMessenger.deploy(0)
    l2CrossDomainMessenger = await CrossDomainMessenger.deploy(0)
    await l1CrossDomainMessenger.setTargetMessengerAddress(l2CrossDomainMessenger.address)
    await l2CrossDomainMessenger.setTargetMessengerAddress(l1CrossDomainMessenger.address)

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

    await bridge.connect(user).withdraw(
      withdrawals[0].amount,
      withdrawals[0].nonce,
      tree.getRoot(),
      tree.getProof(withdrawalHashes[0])
    )

    const userBalance: BigNumber = await bridge.balanceOf(user.getAddress())
    const amountWithdrawn = userBalance.sub(userInitialBalance)

    expect(amountWithdrawn.toString()).to.eq(withdrawals[0].amount.toString())
  })

  it('Should commit deposits', async () => {
    // Get some bridge token for user
    const withdrawalHashes = withdrawals.map( withdrawal => withdrawal.getWithdrawalHash() )
    const tree = new MerkleTree(withdrawalHashes)
    await bridge.setWithdrawalRoot(tree.getRoot())
    await bridge.connect(user).withdraw(
      withdrawals[0].amount,
      withdrawals[0].nonce,
      tree.getRoot(),
      tree.getProof(withdrawalHashes[0])
    )

    await bridge.connect(user).deposit(5, 4, await user.getAddress())

    expect(bridge.commitDeposits())
      .to.emit(bridge, 'DepositsCommitted(bytes32, uint256)')
  })

  it('Should send cross-chain message', async () => {
    // Set withdrawalHash
    const withdrawalHashes = withdrawals.map( withdrawal => withdrawal.getWithdrawalHash() )
    const tree = new MerkleTree(withdrawalHashes)

    const setWithdrawalRootData = bridge.interface.encodeFunctionData('setWithdrawalRoot', [tree.getRoot()])

    expect(await l2CrossDomainMessenger.hasNextMessage()).to.eq(false)
    await l1CrossDomainMessenger.sendMessage(
      bridge.address,
      setWithdrawalRootData,
      200000
    )
    expect(await l2CrossDomainMessenger.hasNextMessage()).to.eq(true)

    await l2CrossDomainMessenger.relayNextMessage()
    expect(await l2CrossDomainMessenger.hasNextMessage()).to.eq(false)

    // Complete withdrawal
    const userInitialBalance: BigNumber = await bridge.balanceOf(user.getAddress())

    await bridge.connect(user).withdraw(
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
