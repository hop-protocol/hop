import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'
import MerkleTree from '../lib/MerkleTree'
import Withdrawal from '../lib/Withdrawal'

const USER_INITIAL_BALANCE = BigNumber.from('1000000')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const AMOUNT = BigNumber.from('123')

describe("Full story", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let withdrawals: Withdrawal[]

  // Factories
  let Bridge: ContractFactory
  let MockERC20: ContractFactory
  let CrossDomainMessenger: ContractFactory
  let L1_OVMTokenBridge: ContractFactory
  let L2_OVMTokenBridge: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_bridge: Contract
  let l1_messenger: Contract
  let l1_ovmBridge: Contract
  
  // L2
  let l2_bridge: Contract
  let l2_ovmBridge: Contract
  let l2_messenger: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]
    Bridge = await ethers.getContractFactory('contracts/Bridge.sol:Bridge')
    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    CrossDomainMessenger = await ethers.getContractFactory('contracts/test/mockOVM_CrossDomainMessenger.sol:mockOVM_CrossDomainMessenger')
    L1_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L1_OVMTokenBridge.sol:L1_OVMTokenBridge')
    L2_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L2_OVMTokenBridge.sol:L2_OVMTokenBridge')
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
    l1_poolToken = await MockERC20.deploy()
    l1_bridge = await Bridge.deploy(l1_poolToken.address)
    l1_messenger = await CrossDomainMessenger.deploy(0)
    l1_ovmBridge = await L1_OVMTokenBridge.deploy(l1_messenger.address, l1_poolToken.address)

    l2_bridge = await Bridge.deploy(l1_poolToken.address)
    l2_messenger = await CrossDomainMessenger.deploy(0)
    l2_ovmBridge = await L2_OVMTokenBridge.deploy(l2_messenger.address)

    // Set up OVM bridges
    l1_ovmBridge.setCrossDomainBridgeAddress(l2_ovmBridge.address)
    l2_ovmBridge.setCrossDomainBridgeAddress(l1_ovmBridge.address)

    // Set up Cross Domain Messengers
    await l1_messenger.setTargetMessengerAddress(l2_messenger.address)
    await l2_messenger.setTargetMessengerAddress(l1_messenger.address)

    // Distribute poolToken
    await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_poolToken.mint(l1_bridge.address, '500000')
  })

  it('Should complete the full story', async () => {
    await l1_poolToken.connect(user).approve(l1_ovmBridge.address, USER_INITIAL_BALANCE)
    await l1_ovmBridge.connect(user).xDomainTransfer(await user.getAddress(), USER_INITIAL_BALANCE)

    const initialBalance = await l2_ovmBridge.balanceOf(user.getAddress())
    expect(initialBalance.toString()).to.eq('0')

    await l2_messenger.relayNextMessage()

    const finalBalance = await l2_ovmBridge.balanceOf(user.getAddress())
    expect(finalBalance.sub(initialBalance).toString()).to.eq(USER_INITIAL_BALANCE)
  })

  // it('Should have distributed poolToken', async () => {
  //   const userBalance = await poolToken.balanceOf(await user.getAddress())
  //   expect(userBalance.toString()).to.eq(USER_INITIAL_BALANCE)

  //   const liquidityProviderBalance = await poolToken.balanceOf(await liquidityProvider.getAddress())
  //   expect(liquidityProviderBalance.toString()).to.eq(LIQUIDITY_PROVIDER_INITIAL_BALANCE)
  // })

  // it('Should complete a withdrawal', async () => {
  //   // Set withdrawalHash
  //   const withdrawalHashes = withdrawals.map( withdrawal => withdrawal.getWithdrawalHash() )
  //   const tree = new MerkleTree(withdrawalHashes)

  //   await bridge.setWithdrawalRoot(tree.getRoot())

  //   // Complete withdrawal
  //   const userInitialBalance: BigNumber = await bridge.balanceOf(user.getAddress())

  //   await bridge.connect(user).withdraw(
  //     withdrawals[0].amount,
  //     withdrawals[0].nonce,
  //     tree.getRoot(),
  //     tree.getProof(withdrawalHashes[0])
  //   )

  //   const userBalance: BigNumber = await bridge.balanceOf(user.getAddress())
  //   const amountWithdrawn = userBalance.sub(userInitialBalance)

  //   expect(amountWithdrawn.toString()).to.eq(withdrawals[0].amount.toString())
  // })

  // it('Should commit deposits', async () => {
  //   // Get some bridge token for user
  //   const withdrawalHashes = withdrawals.map( withdrawal => withdrawal.getWithdrawalHash() )
  //   const tree = new MerkleTree(withdrawalHashes)
  //   await bridge.setWithdrawalRoot(tree.getRoot())
  //   await bridge.connect(user).withdraw(
  //     withdrawals[0].amount,
  //     withdrawals[0].nonce,
  //     tree.getRoot(),
  //     tree.getProof(withdrawalHashes[0])
  //   )

  //   await bridge.connect(user).deposit(5, 4, await user.getAddress())

  //   expect(bridge.commitDeposits())
  //     .to.emit(bridge, 'DepositsCommitted(bytes32, uint256)')
  // })

  // it('Should send cross-chain message', async () => {
  //   // Set withdrawalHash
  //   const withdrawalHashes = withdrawals.map( withdrawal => withdrawal.getWithdrawalHash() )
  //   const tree = new MerkleTree(withdrawalHashes)

  //   const setWithdrawalRootData = bridge.interface.encodeFunctionData('setWithdrawalRoot', [tree.getRoot()])

  //   expect(await l2CrossDomainMessenger.hasNextMessage()).to.eq(false)
  //   await l1CrossDomainMessenger.sendMessage(
  //     bridge.address,
  //     setWithdrawalRootData,
  //     200000
  //   )
  //   expect(await l2CrossDomainMessenger.hasNextMessage()).to.eq(true)

  //   await l2CrossDomainMessenger.relayNextMessage()
  //   expect(await l2CrossDomainMessenger.hasNextMessage()).to.eq(false)

  //   // Complete withdrawal
  //   const userInitialBalance: BigNumber = await bridge.balanceOf(user.getAddress())

  //   await bridge.connect(user).withdraw(
  //     withdrawals[0].amount,
  //     withdrawals[0].nonce,
  //     tree.getRoot(),
  //     tree.getProof(withdrawalHashes[0])
  //   )

  //   const userBalance: BigNumber = await bridge.balanceOf(user.getAddress())
  //   const amountWithdrawn = userBalance.sub(userInitialBalance)

  //   expect(amountWithdrawn.toString()).to.eq(withdrawals[0].amount.toString())
  // })

})
