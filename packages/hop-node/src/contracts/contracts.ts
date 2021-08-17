import '../moduleAlias'
import memoize from 'fast-memoize'
import { Chain } from 'src/constants'
import { Contract } from 'ethers'
import {
  erc20Abi,
  l1Erc20BridgeAbi,
  l1Erc20BridgeLegacyAbi,
  l2AmmWrapperAbi,
  l2BridgeAbi,
  swapAbi as saddleSwapAbi
} from '@hop-protocol/core/abi'

import wallets from 'src/wallets'
import { config as globalConfig } from 'src/config'

const getL1BridgeContract = (token: string) => {
  let abi: any
  if (token === 'USDC') {
    abi = l1Erc20BridgeLegacyAbi
  } else {
    abi = l1Erc20BridgeAbi
  }
  return new Contract(
    globalConfig.tokens[token][Chain.Ethereum].l1Bridge,
    abi,
    wallets.get(Chain.Ethereum)
  )
}

const getL1TokenContract = (token: string) => {
  return new Contract(
    globalConfig.tokens[token][Chain.Ethereum].l1CanonicalToken,
    erc20Abi,
    wallets.get(Chain.Ethereum)
  )
}

const getL2TokenContract = (token: string, network: string, wallet: any) => {
  return new Contract(
    globalConfig.tokens[token][network].l2CanonicalToken,
    erc20Abi,
    wallet
  )
}

const getL2HopBridgeTokenContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new Contract(
    globalConfig.tokens[token][network].l2HopBridgeToken,
    erc20Abi,
    wallet
  )
}

const getL2BridgeContract = (token: string, network: string, wallet: any) => {
  return new Contract(
    globalConfig.tokens[token][network].l2Bridge,
    l2BridgeAbi,
    wallet
  )
}

const getL2AmmWrapperContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new Contract(
    globalConfig.tokens[token][network].l2AmmWrapper,
    l2AmmWrapperAbi,
    wallet
  )
}

const getL2SaddleSwapContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new Contract(
    globalConfig.tokens[token][network].l2SaddleSwap,
    saddleSwapAbi,
    wallet
  )
}

const constructContractsObject = memoize((token: string) => {
  if (!globalConfig.tokens[token]) {
    return null
  }
  return Object.keys(globalConfig.tokens?.[token]).reduce((obj, network) => {
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
        saddleSwap: getL2SaddleSwapContract(token, network, wallet)
      }
    }
    return obj
  }, {} as any)
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
