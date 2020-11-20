import {
  useMemo
} from 'react'
import { Contract } from 'ethers'
import erc20Artifact from '@poc/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import l1BridgeArtifact from '@poc/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import l2BridgeArtifact from '@poc/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import uniswapArtifact from '@poc/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'

import { useWeb3Context } from './web3Context'
import { addresses } from '../config/config'

export const useContracts = () => {
  const { provider } = useWeb3Context()

  const l1_dai = useMemo(() => {
    return provider ?
      new Contract(addresses.l1Dai, erc20Artifact.abi, provider.getSigner()) :
      undefined
  }, [provider])

  const l1_bridge = useMemo(() => {
    return provider ?
      new Contract(addresses.l1Bridge, l1BridgeArtifact.abi, provider.getSigner()) :
      undefined
  }, [provider])

  const arbitrum_dai = useMemo(() => {
    return provider ?
      new Contract(addresses.arbitrumDai, erc20Artifact.abi, provider.getSigner()) :
      undefined
  }, [provider])

  const arbitrum_bridge = useMemo(() => {
    return provider ?
      new Contract(addresses.arbitrumBridge, l2BridgeArtifact.abi, provider.getSigner()) :
      undefined
  }, [provider])

  const arbitrum_uniswap = useMemo(() => {
    return provider ?
      new Contract(addresses.arbitrumBridge, uniswapArtifact.abi, provider.getSigner()) :
      undefined
  }, [provider])

  return {
    l1_dai,
    l1_bridge,
    arbitrum_dai,
    arbitrum_bridge,
    arbitrum_uniswap
  }
}