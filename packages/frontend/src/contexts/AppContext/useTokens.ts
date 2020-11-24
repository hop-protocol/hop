import { useMemo } from 'react'
import { utils as ethersUtils, Contract } from 'ethers'
import erc20Artifact from '@hop-exchange/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { addresses } from 'src/config/config'

const useTokens = (networks: Network[]) => {
  const l1_dai = useMemo(() => {
    const network = networks.find(_network => _network.name === 'kovan')
    if (!network) throw new Error('Kovan network not found')
    return new Contract(addresses.l1Dai, erc20Artifact.abi, network.provider)
  }, [networks])

  const arbitrum_dai = useMemo(() => {
    const network = networks.find(_network => _network.name === 'arbitrum')
    if (!network) throw new Error('Arbitrum network not found')
    return new Contract(
      addresses.arbitrumDai,
      erc20Artifact.abi,
      network.provider
    )
  }, [networks])

  const tokens = useMemo<Token[]>(
    () => [
      // new Token({
      //   symbol: 'ETH',
      //   tokenName: 'Ether',
      //   contracts: {},
      //   rates: {
      //     kovan: ethersUtils.parseEther('1'),
      //     arbitrum: ethersUtils.parseEther('0.998125000000000000'),
      //     optimism: ethersUtils.parseEther('0.977777000000000000')
      //   }
      // }),
      new Token({
        symbol: 'DAI',
        tokenName: 'DAI Stablecoin',
        contracts: {
          kovan: l1_dai,
          arbitrum: arbitrum_dai
        },
        rates: {
          kovan: ethersUtils.parseEther('1'),
          arbitrum: ethersUtils.parseEther('0.958125000000000000'),
          optimism: ethersUtils.parseEther('0.967777000000000000')
        }
      })
    ],
    [l1_dai, arbitrum_dai]
  )

  return tokens
}

export default useTokens
