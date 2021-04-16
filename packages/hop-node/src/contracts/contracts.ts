import '../moduleAlias'
import { ethers } from 'ethers'
import memoize from 'fast-memoize'
import { ETHEREUM } from 'src/constants'
import erc20Artifact from 'src/abi/ERC20.json'
import l1BridgeArtifact from 'src/abi/L1_Bridge.json'
import l2BridgeArtifact from 'src/abi/L2_Bridge.json'
import ammWrapperArtifact from 'src/abi/L2_AmmWrapper.json'
import uniswapRouterArtifact from 'src/abi/UniswapV2Router02.json'
import uniswapFactoryArtifact from 'src/abi/UniswapV2Factory.json'
import uniswapV2PairArtifact from 'src/abi/UniswapV2Pair.json'
import saddleSwapArtifact from 'src/abi/SaddleSwap.json'

import { config } from 'src/config'
import wallets from 'src/wallets'

const getL1BridgeContract = (token: string) => {
  return new ethers.Contract(
    config.tokens[token][ETHEREUM].l1Bridge,
    l1BridgeArtifact.abi,
    wallets.get(ETHEREUM)
  )
}

const getL1TokenContract = (token: string) => {
  return new ethers.Contract(
    config.tokens[token][ETHEREUM].l1CanonicalToken,
    erc20Artifact.abi,
    wallets.get(ETHEREUM)
  )
}

const getL2TokenContract = (token: string, network: string, wallet: any) => {
  return new ethers.Contract(
    config.tokens[token][network].l2CanonicalToken,
    erc20Artifact.abi,
    wallet
  )
}

const getL2HopBridgeTokenContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    config.tokens[token][network].l2HopBridgeToken,
    erc20Artifact.abi,
    wallet
  )
}

const getL2BridgeContract = (token: string, network: string, wallet: any) => {
  return new ethers.Contract(
    config.tokens[token][network].l2Bridge,
    l2BridgeArtifact.abi,
    wallet
  )
}

const getL2AmmWrapperContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    config.tokens[token][network].l2AmmWrapper,
    ammWrapperArtifact.abi,
    wallet
  )
}

const getL2UniswapRouterContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    config.tokens[token][network].l2UniswapRouter,
    uniswapRouterArtifact.abi,
    wallet
  )
}

const getL2UniswapFactoryContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    config.tokens[token][network].l2UniswapFactory,
    uniswapFactoryArtifact.abi,
    wallet
  )
}

const getL2UniswapExchangeContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    config.tokens[token][network].l2UniswapExchange,
    uniswapV2PairArtifact.abi,
    wallet
  )
}

const getL2SaddleSwapContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    config.tokens[token][network].l2SaddleSwap,
    saddleSwapArtifact.abi,
    wallet
  )
}

const constructContractsObject = memoize((token: string) => {
  if (!config.tokens[token]) {
    return null
  }
  return Object.keys(config.tokens?.[token]).reduce((obj, network) => {
    const wallet = wallets.get(network)
    if (!wallet) {
      return obj
    }
    if (network === ETHEREUM) {
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
        //uniswapRouter: getL2UniswapRouterContract(token, network, wallet),
        //uniswapFactory: getL2UniswapFactoryContract(token, network, wallet),
        //uniswapExchange: getL2UniswapExchangeContract(token, network, wallet),
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
} as any
