import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, Signer, Contract } from 'ethers'
import { expect } from 'chai'
import {
  IFixture,
  IGetMessengerWrapperDefaults,
  USER_INITIAL_BALANCE,
  LIQUIDITY_PROVIDER_INITIAL_BALANCE,
  LIQUIDITY_PROVIDER_UNISWAP_BALANCE,
  COMMITTEE_INITIAL_BALANCE,
  CHALLENGER_INITIAL_BALANCE,
  L2_NAMES,
  ARB_CHAIN_ADDRESS,
  DEFAULT_MESSENGER_WRAPPER_GAS_LIMIT,
  DEFAULT_MESSENGER_WRAPPER_GAS_PRICE,
  DEFAULT_MESSENGER_WRAPPER_GAS_CALL_VALUE,
  DEFAULT_MESSENGER_WRAPPER_SUB_MESSAGE_TYPE,
  OPTIMISM_CHAIN_ID,
  ARBITRUM_CHAIN_ID
} from './constants'

/**
 * Initialization functions
 */

export const setUpDefaults = async (fixture: IFixture, l2Name: string) => {
  const l2ChainId = getChainIdFromName(l2Name)

  const setUpL1AndL2BridgesOpts = {
    messengerWrapperChainId: l2ChainId
  }

  const distributeCanonicalTokensOpts = {
    userInitialBalance: USER_INITIAL_BALANCE,
    liquidityProviderInitialBalance: LIQUIDITY_PROVIDER_INITIAL_BALANCE,
    committeeInitialBalance: COMMITTEE_INITIAL_BALANCE,
    challengerInitialBalance: CHALLENGER_INITIAL_BALANCE
  }

  const setUpL2UniswapMarketOpts = {
    l2ChainId: l2ChainId,
    liquidityProviderBalance: LIQUIDITY_PROVIDER_UNISWAP_BALANCE
  }

  await setUpL1AndL2Bridges(fixture, setUpL1AndL2BridgesOpts)
  await setUpL1AndL2Messengers(fixture)
  await distributeCanonicalTokens(fixture, distributeCanonicalTokensOpts)
  await setUpL2UniswapMarket(fixture, setUpL2UniswapMarketOpts)
}

export const setUpL1AndL2Bridges = async (fixture: IFixture, opts: any) => {
  const {
    l1_bridge,
    messengerWrapper,
    l2_bridge,
    l2_uniswapRouter
  } = fixture

  const {
    messengerWrapperChainId
  } = opts

  // Set up L1
  await l1_bridge.setCrossDomainMessengerWrapper(messengerWrapperChainId, messengerWrapper.address)

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
    l1_canonicalBridge,
    l2_bridge,
    l2_messenger,
    liquidityProvider,
    l2_uniswapRouter,
    l2_uniswapFactory,
    l2_canonicalToken
  } = fixture

  const {
    l2ChainId,
    liquidityProviderBalance
  } = opts

  // liquidityProvider moves funds across the canonical bridge
  await l1_canonicalToken.connect(liquidityProvider).approve(l1_canonicalBridge.address, liquidityProviderBalance)
  await l1_canonicalBridge.connect(liquidityProvider).sendMessage(l2_canonicalToken.address, await liquidityProvider.getAddress(), liquidityProviderBalance)
  await l2_messenger.relayNextMessage()
  await expectBalanceOf(l2_canonicalToken, liquidityProvider, liquidityProviderBalance)

  // liquidityProvider moves funds across the Hop liquidity bridge
  await l1_canonicalToken.connect(liquidityProvider).approve(l1_bridge.address, liquidityProviderBalance)
  await l1_bridge.connect(liquidityProvider).sendToL2(l2ChainId, await liquidityProvider.getAddress(), liquidityProviderBalance)
  await l2_messenger.relayNextMessage()
  await expectBalanceOf(l2_bridge, liquidityProvider, liquidityProviderBalance)

  // liquidityProvider adds liquidity to the pool on L2
  await l2_canonicalToken.connect(liquidityProvider).approve(l2_uniswapRouter.address, liquidityProviderBalance)
  await l2_bridge.connect(liquidityProvider).approve(l2_uniswapRouter.address, liquidityProviderBalance)
  await l2_uniswapRouter.connect(liquidityProvider).addLiquidity(
    l2_canonicalToken.address,
    l2_bridge.address,
    liquidityProviderBalance,
    liquidityProviderBalance,
    '0',
    '0',
    await liquidityProvider.getAddress(),
    '999999999999'
  )
  await expectBalanceOf(l2_canonicalToken, liquidityProvider, '0')
  await expectBalanceOf(l2_bridge, liquidityProvider, '0')

  const uniswapPairAddress: string = await l2_uniswapFactory.getPair(l2_canonicalToken.address, l2_bridge.address)
  const uniswapPair = await ethers.getContractAt('@uniswap/v2-core/contracts/UniswapV2Pair.sol:UniswapV2Pair', uniswapPairAddress)
  await expectBalanceOf(uniswapPair, liquidityProvider, '499000')
  await expectBalanceOf(l2_canonicalToken, uniswapPair, liquidityProviderBalance)
  await expectBalanceOf(l2_bridge, uniswapPair, liquidityProviderBalance)
}

/**
 * General functions
 */

export const getL2MessengerId = (l2Name: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(l2Name))
}

export const getChainIdFromName = (l2Name: string): BigNumber => {
  switch(l2Name) {
    case L2_NAMES.ARBITRUM: {
      return ARBITRUM_CHAIN_ID
    }
    case L2_NAMES.OPTIMISM: {
      return OPTIMISM_CHAIN_ID
    }
    case L2_NAMES.OPTIMISM_1: {
      return OPTIMISM_CHAIN_ID
    }
    case L2_NAMES.OPTIMISM_2: {
      return OPTIMISM_CHAIN_ID
    }
  }
}

export const getMessengerWrapperDefaults = (
  l2Name: string,
  l1BridgeAddress: string,
  l2BridgeAddress: string,
  l1MessengerAddress: string
): IGetMessengerWrapperDefaults[] => {
  let defaults: IGetMessengerWrapperDefaults[] = []

  defaults.push(
    l1BridgeAddress,
    l2BridgeAddress,
    DEFAULT_MESSENGER_WRAPPER_GAS_LIMIT,
    l1MessengerAddress
  )

  if (l2Name === L2_NAMES.ARBITRUM) {
    defaults.push(
      ARB_CHAIN_ADDRESS,
      DEFAULT_MESSENGER_WRAPPER_SUB_MESSAGE_TYPE,
      DEFAULT_MESSENGER_WRAPPER_GAS_PRICE,
      DEFAULT_MESSENGER_WRAPPER_GAS_CALL_VALUE
    )
  } else if (l2Name === L2_NAMES.OPTIMISM) {
    // Nothing unique here. This function exists for consistency.
  }

  return defaults
}

export const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
  const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
  const balance = await token.balanceOf(accountAddress)
  expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
}

export const generateAmountHash = (chainIds: Number[], amounts: Number[]): Buffer => {
  const data = ethers.utils.defaultAbiCoder.encode(
    [
      'uint256[]',
      'uint256[]'
    ],
    [
      chainIds,
      amounts
    ]
  )
  const hash = ethers.utils.keccak256(data)
  return Buffer.from(hash.slice(2), 'hex')
}
