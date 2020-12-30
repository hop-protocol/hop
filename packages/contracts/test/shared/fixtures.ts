import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

import { IFixture, RELAYER_FEE, MAINNET_CHAIN_ID } from './constants'
import Transfer from '../../lib/Transfer'

export async function fixture(): Promise<IFixture> {
  const accounts = await ethers.getSigners()
  const user = accounts[0]
  const liquidityProvider = accounts[1]
  const committee = accounts[2]
  const challenger = accounts[3]

  const MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  const L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  const L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')
  const L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
  const MockMessenger = await ethers.getContractFactory('contracts/test/MockMessenger.sol:MockMessenger')
  const CrossDomainMessenger = await ethers.getContractFactory('contracts/test/mockOVM_CrossDomainMessenger.sol:mockOVM_CrossDomainMessenger')
  const L1_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L1_OVMTokenBridge.sol:L1_OVMTokenBridge')
  const L2_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L2_OVMTokenBridge.sol:L2_OVMTokenBridge')
  const UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
  const UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')

  // Deploy contracts
  const weth = await MockERC20.deploy('WETH', 'WETH')
  const l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
  const l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, weth.address)

  const l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
  const l1_bridge = await L1_Bridge.deploy(l1_poolToken.address, await committee.getAddress())
  const l1_messenger = await MockMessenger.deploy()
  const l1_messengerWrapper = await L1_MessengerWrapper.deploy()

  const l2_poolToken = await MockERC20.deploy('L2 Dai Stable Token', 'L2DAI')
  const l2_messenger = await MockMessenger.deploy()
  const l2_bridge = await L2_Bridge.deploy(l2_messenger.address, l2_poolToken.address,  await committee.getAddress())

  const transfers = [
      new Transfer({
        chainId: MAINNET_CHAIN_ID,
        sender: await user.getAddress(),
        recipient: await user.getAddress(),
        amount: BigNumber.from('12345'),
        nonce: 0,
        relayerFee: RELAYER_FEE,
        amountOutMin: BigNumber.from('0'),
        deadline: BigNumber.from('0')
      }),
      new Transfer({
        chainId: MAINNET_CHAIN_ID,
        sender: await liquidityProvider.getAddress(),
        recipient: await liquidityProvider.getAddress(),
        amount: BigNumber.from('12345'),
        nonce: 0,
        relayerFee: RELAYER_FEE,
        amountOutMin: BigNumber.from('0'),
        deadline: BigNumber.from('0')
      })
    ]

  return {
    accounts,
    user,
    liquidityProvider,
    committee,
    challenger,
    L1_Bridge,
    L2_Bridge,
    MockERC20,
    L1_MessengerWrapper,
    MockMessenger,
    CrossDomainMessenger,
    L1_OVMTokenBridge,
    L2_OVMTokenBridge,
    UniswapRouter,
    UniswapFactory,
    l1_poolToken,
    l1_messenger,
    l1_messengerWrapper,
    l1_bridge,
    l2_messenger,
    l2_bridge,
    l2_poolToken,
    l2_uniswapFactory,
    l2_uniswapRouter,
    transfers
  }
}
