require('dotenv').config()

import { ethers, l2ethers } from 'hardhat'
import { BigNumber, ContractFactory, Contract, Signer, Wallet } from 'ethers'
import { ARB_CHAIN_ADDRESS, CHAIN_IDS } from '../../../test/shared/constants'

const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')
const USER_INITIAL_BALANCE = BigNumber.from('1000000000000000000')

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet

  // Factories
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L1
  let l1_bridge: Contract

  // L2
  let l2_bridge: Contract
  let l2_uniswapRouter: Contract
  let l2_uniswapFactory: Contract
  let l2_oDai: Contract

  // Other
  let TokenOne: ContractFactory
  let TokenTwo: ContractFactory
  
  let tokenOne: Contract
  let tokenTwo: Contract

  let Pair: ContractFactory
  let pair: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')
  // UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
  // UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')
  UniswapRouter = await l2ethers.getContractFactory('contracts/test/UniswapRouterFlat.sol:UniswapV2Router02', {
    signer: (await ethers.getSigners())[0]
  })
  UniswapFactory = await l2ethers.getContractFactory('contracts/test/UniswapFactoryFlat.sol:UniswapV2Factory', {
    signer: (await ethers.getSigners())[0]
  })

  TokenOne = await l2ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20', {
    signer: (await ethers.getSigners())[0]
  })
  TokenTwo = await l2ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20', {
    signer: (await ethers.getSigners())[0]
  })

  // Pair = await l2ethers.getContractFactory('contracts/uniswap/contracts/UniswapV2Pair.sol:UniswapV2Pair', {
  //   signer: (await ethers.getSigners())[0]
  // })

  /**
   * Deployments
   */

  // Connect Contracts
  l1_bridge = L1_Bridge.attach('0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE')
  l2_oDai = MockERC20.attach('0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B')

  l2_bridge = L2_Bridge.attach('0x6d2f304CFF4e0B67dA4ab38C6A5C8184a2424D05')
  l2_uniswapFactory = UniswapFactory.attach('0x3e4CFaa8730092552d9425575E49bB542e329981')
  l2_uniswapRouter = UniswapRouter.attach('0xf3af9B1Edc17c1FcA2b85dd64595F914fE2D3Dde')

  console.log('0')
  await l2_bridge.addSupportedChainId(CHAIN_IDS.ARBITRUM_TESTNET_2)
  console.log('1')
  await l2_bridge.addSupportedChainId(CHAIN_IDS.ARBITRUM_TESTNET_3)
  console.log('2')
  await l2_bridge.addSupportedChainId(CHAIN_IDS.MAINNET)
  console.log('3')
  await l2_bridge.addSupportedChainId(CHAIN_IDS.OPTIMISM_HOP_TESTNET)
  console.log('4')
  await l2_bridge.addSupportedChainId(CHAIN_IDS.KOVAN)
  console.log('5')
  const isSupport = await l2_bridge.supportedChainIds(CHAIN_IDS.OPTIMISM_HOP_TESTNET)
  console.log(isSupport)
  // // Other
  // // tokenOne = await TokenOne.deploy('Optimism Dai', 'Dai')
  // // tokenOne.deployed()
  // // tokenTwo = await TokenTwo.deploy('Hop Dai', 'hDai')
  // // tokenTwo.deployed()

  // // tokenOne = TokenOne.attach('0xd5d87D2a29Bc3819f873dCcD8e9405BB5868fA68')
  // tokenTwo = TokenTwo.attach('0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B')

  // // await verifyDeployment('Token One', l2_bridge, ethers)
  // // await verifyDeployment('Token Two', tokenTwo, ethers)

  // await l2_bridge.mint(await user.getAddress(), USER_INITIAL_BALANCE.mul(2))
  // await tokenTwo.mint(await user.getAddress(), USER_INITIAL_BALANCE.mul(2))
  // await l2_bridge.mint('0x02b260F6f47FF328496Be632678d06a564B8c4AB', USER_INITIAL_BALANCE.mul(2))
  // await tokenTwo.mint('0x02b260F6f47FF328496Be632678d06a564B8c4AB', USER_INITIAL_BALANCE.mul(2))
  // await l2_bridge.mint('0x023fFdC1530468eb8c8EEbC3e38380b5bc19Cc5d', USER_INITIAL_BALANCE.mul(2))
  // await tokenTwo.mint('0x023fFdC1530468eb8c8EEbC3e38380b5bc19Cc5d', USER_INITIAL_BALANCE.mul(2))

  console.log('DONE')
  const a_canonicalToken = await l2_bridge.l2CanonicalToken()
  console.log('a_canonicalToken', a_canonicalToken)
  let a_allowance = await l2_oDai.allowance(await user.getAddress(), l2_bridge.address)
  console.log('a_allowance', a_allowance)
  await l2_oDai.approve(l2_bridge.address, USER_INITIAL_BALANCE.mul(2))
  a_allowance = await l2_oDai.allowance(await user.getAddress(), l2_bridge.address)
  console.log('a_allowance', a_allowance)
  // Set up bridges
  console.log('000')
  // await l2_bridge.setL1BridgeAddress(l1_bridge.address)
  console.log('111')
  // let test = await l2_bridge.balanceOf(await user.getAddress())
  // await l2_bridge.approve(l2_bridge.address, USER_INITIAL_BALANCE.mul(2))
  // let test = await l2_bridge.allowance(await user.getAddress(), l2_bridge.address)
  // console.log('222', test)
  let test = await l2_oDai.balanceOf(await user.getAddress())
  console.log('222', test.toString())
  // await l2_bridge.setExchangeAddress(l2_uniswapRouter.address)
  // const _chainId = CHAIN_IDS.ARBITRUM_TESTNET_3
  // const _recipient = await user.getAddress()
  // const _amount = BigNumber.from('1000000000000000000')
  // const _transferNonce = 0
  // const _relayerFee = 0
  // const _amountOutMin = 0
  // const _deadline = 1999999999
  // const _destinationAmountOutMin = 0
  // const _destinationDeadline = 1999999999
  // // await l2_bridge.send(
  // await l2_bridge.swapAndSend(
  //   _chainId,
  //   _recipient,
  //   _amount,
  //   _transferNonce,
  //   _relayerFee,
  //   _amountOutMin,
  //   _deadline,
  //   _destinationAmountOutMin,
  //   _destinationDeadline
  // )
  // test = await l2_oDai.balanceOf(await user.getAddress())
  // console.log('333', test.toString())
  // // Set up Uniswap
  // // await l2_oDai.approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE.div(2))
  // // await l2_bridge.approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE.div(2))
  // await l2_bridge.approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE)
  // console.log("0")
  // await tokenTwo.approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE)
  // // await l2_bridge.connect(user).approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE.div(2))
  // console.log("1")
  // // await tokenTwo.connect(user).approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE.div(2))

  // let amount = await l2_bridge.allowance(await user.getAddress(), l2_uniswapRouter.address)

  // console.log("user", await user.getAddress())
  // amount = await l2_bridge.allowance('0x023fFdC1530468eb8c8EEbC3e38380b5bc19Cc5d', l2_uniswapRouter.address)
  // console.log("REMIX 1: ", amount)
  // amount = await tokenTwo.allowance('0x023fFdC1530468eb8c8EEbC3e38380b5bc19Cc5d', l2_uniswapRouter.address)
  // console.log("REMIX 2: ", amount)
  // await l2_uniswapRouter.addLiquidity(
  //   l2_bridge.address,
  //   tokenTwo.address,
  //   // l2_oDai.address,
  //   // l2_bridge.address,
  //   USER_INITIAL_BALANCE.div(2),
  //   USER_INITIAL_BALANCE.div(2),
  //   '0',
  //   '0',
  //   await user.getAddress(),
  //   '999999999999'
  // )
  // let userBal = await l2_bridge.balanceOf(await user.getAddress())
  // console.log('userBalBefore: ', userBal)

  // await l2_uniswapRouter.connect(user).swapExactTokensForTokens(
  //   123,
  //   0,
  //   [
  //     l2_bridge.address,
  //     '0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B',
  //   ],
  //   await user.getAddress(),
  //   '999999999999'
  // )

  // userBal = await l2_bridge.balanceOf(await user.getAddress())
  // console.log('userBalAfter: ', userBal)

  // console.log('**********')
  // let pairsLength = await l2_uniswapFactory.allPairsLength()
  // let pairA = await l2_uniswapFactory.getPair(l2_bridge.address, tokenTwo.address)
  // let pairB = await l2_uniswapFactory.getPair(tokenTwo.address, l2_bridge.address)
  // console.log('Length', pairsLength)
  // console.log('Pair A', pairA)
  // console.log('Pair B', pairB)

  // await l2_uniswapFactory.createPair(tokenOne.address, tokenTwo.address)
  // test = await l2_uniswapFactory.allPairsLength()
  // console.log('test', test)
}

async function verifyDeployment (name: string, contract: Contract, ethers) {
  const isCodeAtAddress = (await ethers.provider.getCode(contract.address)).length > 100
  console.log(name, '::', isCodeAtAddress, '::', contract.address)
  if (!isCodeAtAddress) {
    throw new Error('Did not deploy correctly')
  }
}
/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()