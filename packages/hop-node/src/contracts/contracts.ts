import '../moduleAlias'
import memoize from 'fast-memoize'
import { Chain } from 'src/constants'
import { Signer, providers } from 'ethers'

import wallets from 'src/wallets'
import { config as globalConfig } from 'src/config'
import {
  ERC20__factory,
  L1_ERC20_Bridge_Legacy__factory,
  L1_ERC20_Bridge__factory,
  L2_AmmWrapper__factory,
  L2_Bridge__factory,
  MessengerWrapper__factory,
  SaddleLpToken__factory
} from '@hop-protocol/core/contracts'

const getL1BridgeContract = (token: string) => {
  if (token === 'USDC') {
    return L1_ERC20_Bridge_Legacy__factory.connect(
      globalConfig.addresses[token][Chain.Ethereum].l1Bridge,
      wallets.get(Chain.Ethereum)
    )
  }
  return L1_ERC20_Bridge__factory.connect(
    globalConfig.addresses[token][Chain.Ethereum].l1Bridge,
    wallets.get(Chain.Ethereum)
  )
}

const getL1TokenContract = (token: string) => {
  return ERC20__factory.connect(
    globalConfig.addresses[token][Chain.Ethereum].l1CanonicalToken,
    wallets.get(Chain.Ethereum)
  )
}

const getL2TokenContract = (token: string, network: string, wallet: Signer | providers.Provider) => {
  return ERC20__factory.connect(
    globalConfig.addresses[token][network].l2CanonicalToken,
    wallet
  )
}

const getL2HopBridgeTokenContract = (
  token: string,
  network: string,
  wallet: Signer | providers.Provider
) => {
  return ERC20__factory.connect(
    globalConfig.addresses[token][network].l2HopBridgeToken,
    wallet
  )
}

const getL2BridgeContract = (token: string, network: string, wallet: Signer | providers.Provider) => {
  return L2_Bridge__factory.connect(
    globalConfig.addresses[token][network].l2Bridge,
    wallet
  )
}

const getL2AmmWrapperContract = (
  token: string,
  network: string,
  wallet: Signer | providers.Provider
) => {
  return L2_AmmWrapper__factory.connect(
    globalConfig.addresses[token][network].l2AmmWrapper,
    wallet
  )
}

const getL2SaddleSwapContract = (
  token: string,
  network: string,
  wallet: Signer | providers.Provider
) => {
  return SaddleLpToken__factory.connect(
    globalConfig.addresses[token][network].l2SaddleSwap,
    wallet
  )
}

const getMessengerWrapperContract = (
  token: string,
  network: string
) => {
  // Note: This only returns the base implementation, not the chain-specific implementation
  return MessengerWrapper__factory.connect(
    globalConfig.addresses[token][network].l1MessengerWrapper,
    wallets.get(Chain.Ethereum)
  )
}

const constructContractsObject = memoize((token: string) => {
  if (!globalConfig.addresses[token]) {
    return null
  }
  return Object.keys(globalConfig.addresses[token]).reduce<any>((obj, network) => {
    const wallet = wallets.get(network)
    if (!wallet) {
      return obj
    }
    if (network === Chain.Ethereum) {
      obj[network] = {
        l1Bridge: getL1BridgeContract(token),
        l1CanonicalToken: getL1TokenContract(token)
      }
    } else {
      obj[network] = {
        l2Bridge: getL2BridgeContract(token, network, wallet),
        l2CanonicalToken: getL2TokenContract(token, network, wallet),
        l2HopBridgeToken: getL2HopBridgeTokenContract(token, network, wallet),
        ammWrapper: getL2AmmWrapperContract(token, network, wallet),
        saddleSwap: getL2SaddleSwapContract(token, network, wallet),
        messengerWrapper: getMessengerWrapperContract(token, network)
      }
    }
    return obj
  }, {})
})

export default {
  has (token: string, network: string) {
    const contracts = constructContractsObject(token)
    return !!contracts?.[network]
  },
  get (token: string, network: string) {
    const contracts = constructContractsObject(token)
    return contracts?.[network]
  }
}
