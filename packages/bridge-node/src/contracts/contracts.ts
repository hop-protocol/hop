import * as ethers from 'ethers'
import erc20Abi from 'src/abi/ERC20.json'
import l1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import l2BridgeArtifactOld from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import l2BridgeArtifact from 'src/abi/L2OptimismBridge.json'

import { tokens } from 'src/config'
import l1Wallet from 'src/wallets/l1Wallet'
import l2ArbitrumWallet from 'src/wallets/l2ArbitrumWallet'
import l2OptimismWallet from 'src/wallets/l2OptimismWallet'

const getL1BridgeContract = (tokenSymbol: string) => {
  return new ethers.Contract(
    tokens[tokenSymbol].kovan.l1Bridge,
    l1BridgeArtifact.abi,
    l1Wallet
  )
}

const getL1TokenContract = (tokenSymbol: string) => {
  return new ethers.Contract(
    tokens[tokenSymbol].kovan.l1CanonicalToken,
    erc20Abi,
    l1Wallet
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
    } else if (network === 'optimism') {
      obj[network] = {
        l2Bridge: getL2BridgeContract(token, network, l2OptimismWallet)
      }
    }
    return obj
  }, {} as any)
  return acc
}, {} as any)
