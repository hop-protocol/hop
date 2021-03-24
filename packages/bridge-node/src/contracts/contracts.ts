import '../moduleAlias'
import * as ethers from 'ethers'
import erc20Artifact from 'src/abi/ERC20.json'
import l1BridgeArtifact from 'src/abi/L1_Bridge.json'
import l2BridgeArtifact from 'src/abi/L2_Bridge.json'
import l2UniswapWrapperArtifact from 'src/abi/L2_UniswapWrapper.json'
import uniswapRouterArtifact from 'src/abi/UniswapV2Router02.json'
import uniswapFactoryArtifact from 'src/abi/UniswapV2Factory.json'
import uniswapV2PairArtifact from 'src/abi/UniswapV2Pair.json'

import { tokens } from 'src/config'
import { wallets } from 'src/wallets'
import l1Wallet from 'src/wallets/l1Wallet'

const getL1BridgeContract = (token: string) => {
  return new ethers.Contract(
    tokens[token].kovan.l1Bridge,
    l1BridgeArtifact.abi,
    l1Wallet
  )
}

const getL1TokenContract = (token: string) => {
  return new ethers.Contract(
    tokens[token].kovan.l1CanonicalToken,
    erc20Artifact.abi,
    l1Wallet
  )
}

const getL2TokenContract = (token: string, network: string, wallet: any) => {
  return new ethers.Contract(
    tokens[token][network].l2CanonicalToken,
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
    tokens[token][network].l2HopBridgeToken,
    erc20Artifact.abi,
    wallet
  )
}

const getL2BridgeContract = (token: string, network: string, wallet: any) => {
  return new ethers.Contract(
    tokens[token][network].l2Bridge,
    l2BridgeArtifact.abi,
    wallet
  )
}

const getL2UniswapWrapperContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    tokens[token][network].l2UniswapWrapper,
    l2UniswapWrapperArtifact.abi,
    wallet
  )
}

const getL2UniswapRouterContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    tokens[token][network].l2UniswapRouter,
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
    tokens[token][network].l2UniswapFactory,
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
    tokens[token][network].l2UniswapExchange,
    uniswapV2PairArtifact.abi,
    wallet
  )
}

export const contracts = Object.keys(tokens).reduce((acc, token) => {
  acc[token] = Object.keys(tokens[token]).reduce((obj, network) => {
    const wallet = wallets[network]
    if (network === 'kovan') {
      obj[network] = {
        l1Bridge: getL1BridgeContract(token),
        l1CanonicalToken: getL1TokenContract(token)
      }
    } else {
      obj[network] = {
        l2Bridge: getL2BridgeContract(token, network, wallet),
        l2CanonicalToken: getL2TokenContract(token, network, wallet),
        l2HopBridgeToken: getL2HopBridgeTokenContract(token, network, wallet),
        l2UniswapWrapper: getL2UniswapWrapperContract(token, network, wallet),
        uniswapRouter: getL2UniswapRouterContract(token, network, wallet),
        uniswapFactory: getL2UniswapFactoryContract(token, network, wallet),
        uniswapExchange: getL2UniswapExchangeContract(token, network, wallet)
      }
    }
    return obj
  }, {} as any)
  return acc
}, {} as any)
