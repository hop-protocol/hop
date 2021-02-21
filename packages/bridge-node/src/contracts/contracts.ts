import * as ethers from 'ethers'
import erc20Abi from 'src/abi/ERC20.json'
import l1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import l2BridgeArtifactOld from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import l2BridgeArtifact from 'src/abi/L2OptimismBridge.json'
import uniswapRouterArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import uniswapFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Library.sol/Factory.json'
import uniswapV2PairArtifact from 'src/abi/UniswapV2Pair.json'

import { tokens } from 'src/config'
import l1Wallet from 'src/wallets/l1Wallet'
import l2ArbitrumWallet from 'src/wallets/l2ArbitrumWallet'
import l2OptimismWallet from 'src/wallets/l2OptimismWallet'
import l2xDaiWallet from 'src/wallets/l2xDaiWallet'

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
    erc20Abi,
    l1Wallet
  )
}

const getL2TokenContract = (token: string, network: string, wallet: any) => {
  return new ethers.Contract(
    tokens[token][network].l2CanonicalToken,
    erc20Abi,
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

const getL2BridgeContractOld = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    tokens[token][network].l2Bridge,
    l2BridgeArtifactOld.abi,
    wallet
  )
}

const getL2UniswapRouterContract = (
  token: string,
  network: string,
  wallet: any
) => {
  return new ethers.Contract(
    tokens[token][network].uniswapRouter,
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
    tokens[token][network].uniswapFactory,
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
    tokens[token][network].uniswapFactory,
    uniswapV2PairArtifact.abi,
    wallet
  )
}

export const contracts = Object.keys(tokens).reduce((acc, token) => {
  acc[token] = Object.keys(tokens[token]).reduce((obj, network) => {
    if (network === 'kovan') {
      obj[network] = {
        l1Bridge: getL1BridgeContract(token),
        l1CanonicalToken: getL1TokenContract(token)
      }
    } else if (network === 'arbitrum') {
      if (token === 'ARB') {
        obj[network] = {
          l2Bridge: getL2BridgeContract(token, network, l2ArbitrumWallet)
        }
      } else {
        obj[network] = {
          l2Bridge: getL2BridgeContractOld(token, network, l2ArbitrumWallet)
        }
      }

      obj[network] = {
        ...obj[network],
        l2CanonicalToken: getL2TokenContract(token, network, l2ArbitrumWallet),
        uniswapRouter: getL2UniswapRouterContract(
          token,
          network,
          l2ArbitrumWallet
        ),
        uniswapFactory: getL2UniswapFactoryContract(
          token,
          network,
          l2ArbitrumWallet
        ),
        uniswapExchange: getL2UniswapExchangeContract(
          token,
          network,
          l2ArbitrumWallet
        )
      }
    } else if (network === 'optimism') {
      obj[network] = {
        l2Bridge: getL2BridgeContract(token, network, l2OptimismWallet),
        l2CanonicalToken: getL2TokenContract(token, network, l2OptimismWallet),
        uniswapRouter: getL2UniswapRouterContract(
          token,
          network,
          l2OptimismWallet
        ),
        uniswapFactory: getL2UniswapFactoryContract(
          token,
          network,
          l2OptimismWallet
        ),
        uniswapExchange: getL2UniswapExchangeContract(
          token,
          network,
          l2OptimismWallet
        )
      }
    } else if (network === 'xdai') {
      obj[network] = {
        l2Bridge: getL2BridgeContract(token, network, l2xDaiWallet),
        l2CanonicalToken: getL2TokenContract(token, network, l2xDaiWallet),
        uniswapRouter: getL2UniswapRouterContract(token, network, l2xDaiWallet),
        uniswapFactory: getL2UniswapFactoryContract(
          token,
          network,
          l2xDaiWallet
        ),
        uniswapExchange: getL2UniswapExchangeContract(
          token,
          network,
          l2xDaiWallet
        )
      }
    }
    return obj
  }, {} as any)
  return acc
}, {} as any)
