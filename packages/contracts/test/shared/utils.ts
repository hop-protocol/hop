import { ethers } from 'hardhat'
import { L2_NAMES, ARB_CHAIN_ADDRESS, DEFAULT_L2_GAS_LIMIT } from './constants'
import { BigNumber, BigNumberish, Signer, Contract } from 'ethers'
import { expect } from 'chai'
import { IFixture } from './constants'

/**
 * Initialization functions
 */

export const setUpL1Bridge = async (fixture: IFixture, opts: any) => {
  const {
    l1_messenger,
    l1_bridge,
    l1_poolToken,
    l1_messengerWrapper,
    user,
    liquidityProvider,
    committee,
    challenger
  } = fixture

  const {
    messengerAddress,
    messengerWrapperChainId,
    userInitialBalance,
    liquidityProviderInitialBalance,
    committeeInitialBalance,
    challengerInitialBalance
  } = opts

  // Set up Cross Domain Messengers
  await l1_messenger.setTargetMessengerAddress(messengerAddress)

  // Set up liquidity bridge
  await l1_bridge.setCrossDomainMessengerWrapper(messengerWrapperChainId, l1_messengerWrapper.address)

  // Distribute poolToken
  await l1_poolToken.mint(await user.getAddress(), userInitialBalance)
  await l1_poolToken.mint(await liquidityProvider.getAddress(), liquidityProviderInitialBalance)
  await l1_poolToken.mint(await committee.getAddress(), committeeInitialBalance)
  await l1_poolToken.mint(await challenger.getAddress(), challengerInitialBalance)
}

/**
 * General functions
 */

export const getL2MessengerId = (l2Name: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(l2Name))
}

export const setMessengerWrapperDefaults = async (
  l2Name: string,
  l1MessengerWrapper: Contract,
  l1MessengerAddress: string,
  l2BridgeAddress: string
) => {

  await l1MessengerWrapper.setL1MessengerAddress(l1MessengerAddress)
  await l1MessengerWrapper.setL2BridgeAddress(l2BridgeAddress)

  if (l2Name === L2_NAMES.ARBITRUM) {
    return setArbitrumMessengerWrapperDefaults(l1MessengerWrapper)
  } else if (l2Name === L2_NAMES.OPTIMISM) {
    return setOptimismMessengerWrapperDefaults(l1MessengerWrapper)
  }

}

export const setArbitrumMessengerWrapperDefaults = async (l1MessengerWrapper: Contract) => {
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

export const setOptimismMessengerWrapperDefaults = async (l1MessengerWrapper: Contract) => {
  const defaultGasLimit: number = DEFAULT_L2_GAS_LIMIT

  await l1MessengerWrapper.setDefaultGasLimit(defaultGasLimit)
}

export const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
  const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
  const balance = await token.balanceOf(accountAddress)
  expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
}
