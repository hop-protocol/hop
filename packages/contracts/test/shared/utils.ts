import { ethers } from 'hardhat'
import { L2_NAMES, ARB_CHAIN_ADDRESS, DEFAULT_L2_GAS_LIMIT } from './constants'
import { BigNumber, BigNumberish, Signer, Contract } from 'ethers'
import { expect } from 'chai'
import { IFixture } from './constants'

/**
 * Initialization functions
 */

export const setUpL1AndL2Bridges = async (fixture: IFixture, opts: any) => {
  const {
    l1_bridge,
    l1_messengerWrapper,
    l2_bridge,
    l2_uniswapRouter
  } = fixture

  const {
    messengerWrapperChainId
  } = opts

  // Set up L1
  await l1_bridge.setCrossDomainMessengerWrapper(messengerWrapperChainId, l1_messengerWrapper.address)

  // Set up L2
  await l2_bridge.setL1BridgeAddress(l1_bridge.address)
  await l2_bridge.setExchangeAddress(l2_uniswapRouter.address)
}

export const setUpL1AndL2Messengers = async (fixture: IFixture) => {
  const {
    l1_messenger,
    l2_messenger
  } = fixture

  // Set up L1
  await l1_messenger.setTargetMessenger(l2_messenger.address)

  // Set up L2
  await l2_messenger.setTargetMessenger(l1_messenger.address)
}

export const setUpL1MessengerWrapper = async (fixture: IFixture, opts: any) => {
  const {
    l2_bridge,
    l1_messengerWrapper,
    l1_messenger,
  } = fixture

  const {
    l2Name
  } = opts

  await setMessengerWrapperDefaults(l2Name, l1_messengerWrapper, l1_messenger.address, l2_bridge.address)
}

export const distributeCanonicalTokens = async (fixture: IFixture, opts: any) => {
  const {
    l1_canonicalToken,
    user,
    liquidityProvider,
    committee,
    challenger
  } = fixture

  const {
    userInitialBalance,
    liquidityProviderInitialBalance,
    committeeInitialBalance,
    challengerInitialBalance
  } = opts

  await l1_canonicalToken.mint(await user.getAddress(), userInitialBalance)
  await l1_canonicalToken.mint(await liquidityProvider.getAddress(), liquidityProviderInitialBalance)
  await l1_canonicalToken.mint(await committee.getAddress(), committeeInitialBalance)
  await l1_canonicalToken.mint(await challenger.getAddress(), challengerInitialBalance)
}

export const setUpL2UniswapMarket = async (fixture: IFixture, opts: any) => {
  const {
    l1_bridge,
    l1_canonicalToken,
    l1_messenger,
    l2_bridge,
    l2_messenger,
    liquidityProvider,
    l2_uniswapRouter,
    l2_uniswapFactory,
  } = fixture

  const {
    l2ChainId,
    liquidityProviderBalance
  } = opts

  // liquidityProvider moves funds across the messenger
  await l1_canonicalToken.connect(liquidityProvider).approve(l1_messenger.address, liquidityProviderBalance)
  await l1_messenger.connect(liquidityProvider).xDomainTransfer(await liquidityProvider.getAddress(), liquidityProviderBalance, l2_messenger.address)
  await l2_messenger.relayNextMessage()
  await expectBalanceOf(l2_messenger, liquidityProvider, liquidityProviderBalance)

  // liquidityProvider moves funds across the liquidity bridge
  await l1_canonicalToken.connect(liquidityProvider).approve(l1_bridge.address, liquidityProviderBalance)
  await l1_bridge.connect(liquidityProvider).sendToL2(l2ChainId, await liquidityProvider.getAddress(), liquidityProviderBalance)
  await l2_messenger.relayNextMessage()
  await expectBalanceOf(l2_bridge, liquidityProvider, liquidityProviderBalance)

  // liquidityProvider adds liquidity to the pool on L2
  await l2_messenger.connect(liquidityProvider).approve(l2_uniswapRouter.address, liquidityProviderBalance)
  await l2_bridge.connect(liquidityProvider).approve(l2_uniswapRouter.address, liquidityProviderBalance)
  await l2_uniswapRouter.connect(liquidityProvider).addLiquidity(
    l2_messenger.address,
    l2_bridge.address,
    liquidityProviderBalance,
    liquidityProviderBalance,
    '0',
    '0',
    await liquidityProvider.getAddress(),
    '999999999999'
  )
  await expectBalanceOf(l2_messenger, liquidityProvider, '0')
  await expectBalanceOf(l2_bridge, liquidityProvider, '0')

  const uniswapPairAddress: string = await l2_uniswapFactory.getPair(l2_messenger.address, l2_bridge.address)
  const uniswapPair = await ethers.getContractAt('@uniswap/v2-core/contracts/UniswapV2Pair.sol:UniswapV2Pair', uniswapPairAddress)
  await expectBalanceOf(uniswapPair, liquidityProvider, '499000')
  await expectBalanceOf(l2_messenger, uniswapPair, liquidityProviderBalance)
  await expectBalanceOf(l2_bridge, uniswapPair, liquidityProviderBalance)
}

/**
 * General functions
 */

export const getL2MessengerId = (l2Name: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(l2Name))
}

const setMessengerWrapperDefaults = async (
  l2Name: string,
  l1MessengerWrapper: Contract,
  l1BridgeAddress: string,
  l2BridgeAddress: string
) => {

  await l1MessengerWrapper.setL1MessengerAddress(l1BridgeAddress)
  await l1MessengerWrapper.setL2BridgeAddress(l2BridgeAddress)

  if (l2Name === L2_NAMES.ARBITRUM) {
    return setArbitrumMessengerWrapperDefaults(l1MessengerWrapper)
  } else if (l2Name === L2_NAMES.OPTIMISM) {
    return setOptimismMessengerWrapperDefaults(l1MessengerWrapper)
  }

}

const setArbitrumMessengerWrapperDefaults = async (l1MessengerWrapper: Contract) => {
  const arbChain: string = ARB_CHAIN_ADDRESS
  const defaultGasLimit: number = DEFAULT_L2_GAS_LIMIT
  const defaultGasPrice: number = 0
  const defaultCallValue: number = 0
  const defaultSubMessageType: string = '0x01'

  await l1MessengerWrapper.setArbChain(arbChain)
  await l1MessengerWrapper.setDefaultGasLimit(defaultGasLimit)
  await l1MessengerWrapper.setDefaultGasPrice(defaultGasPrice)
  await l1MessengerWrapper.setDefaultCallValue(defaultCallValue)
  await l1MessengerWrapper.setDefaultSubMessageType(defaultSubMessageType)
}

const setOptimismMessengerWrapperDefaults = async (l1MessengerWrapper: Contract) => {
  const defaultGasLimit: number = DEFAULT_L2_GAS_LIMIT

  await l1MessengerWrapper.setDefaultGasLimit(defaultGasLimit)
}

export const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
  const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
  const balance = await token.balanceOf(accountAddress)
  expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
}
