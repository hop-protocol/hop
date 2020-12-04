import { useMemo } from 'react'
import { Contract } from 'ethers'
import erc20Artifact from '@hop-exchange/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import l1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import l2BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import uniswapArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config/config'
import Network from 'src/models/Network'

export type HopContracts = {
  l1_dai?: Contract
  l1_bridge?: Contract
  arbitrum_dai?: Contract
  arbitrum_bridge?: Contract
  arbitrum_uniswap?: Contract
}

const useContracts = (networks: Network[]): HopContracts => {
  const { provider } = useWeb3Context()

  const l1_dai = useMemo(() => {
    return provider
      ? new Contract(addresses.l1Dai, erc20Artifact.abi, provider.getSigner())
      : undefined
  }, [provider])

  const l1_bridge = useMemo(() => {
    return provider
      ? new Contract(
          addresses.l1Bridge,
          l1BridgeArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const arbitrum_dai = useMemo(() => {
    return provider
      ? new Contract(
          addresses.arbitrumDai,
          erc20Artifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const arbitrum_bridge = useMemo(() => {
    return provider
      ? new Contract(
          addresses.arbitrumBridge,
          l2BridgeArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const arbitrum_uniswap = useMemo(() => {
    return provider
      ? new Contract(
          addresses.arbitrumUniswapRouter,
          uniswapArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  return {
    l1_dai,
    l1_bridge,
    arbitrum_dai,
    arbitrum_bridge,
    arbitrum_uniswap
  }
}

export default useContracts
