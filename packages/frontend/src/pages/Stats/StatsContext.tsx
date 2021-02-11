import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import Address from 'src/models/Address'
import uniswapV2PairArtifact from 'src/abi/UniswapV2Pair.json'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'

type StatsContextProps = {
  stats: any[]
  fetching: boolean
}

const StatsContext = createContext<StatsContextProps>({
  stats: [],
  fetching: false
})

const StatsContextProvider: FC = ({ children }) => {
  let { networks, tokens, contracts } = useApp()
  const [stats, setStats] = useState<any[]>([])
  const [fetching, setFetching] = useState<boolean>(false)
  const filteredNetworks = networks?.filter(token => !token.isLayer1)

  async function fetchStats (selectedNetwork: Network, selectedToken: Token) {
    if (!selectedNetwork) {
      return
    }
    const selectedNetworkSlug = selectedNetwork?.slug
    if (!contracts?.tokens[selectedToken.symbol][selectedNetworkSlug]) {
      return
    }
    const uniswapFactory =
      contracts?.tokens[selectedToken.symbol][selectedNetworkSlug]
        ?.uniswapFactory
    const token = tokens.find(token => token.symbol === selectedToken?.symbol)
    if (!token) {
      return
    }

    const hopToken = new Token({
      symbol: `h${token?.symbol}`,
      tokenName: token?.tokenName,
      contracts: {
        arbitrum: token?.contracts?.arbitrumHopBridge,
        optimism: token?.contracts?.optimismHopBridge
      }
    })
    const pairAddress = await uniswapFactory?.getPair(
      selectedToken?.addressForNetwork(selectedNetwork)?.toString(),
      hopToken?.addressForNetwork(selectedNetwork)?.toString()
    )
    const contractProvider = selectedNetwork.provider
    const pair = new Contract(
      pairAddress,
      uniswapV2PairArtifact.abi,
      contractProvider
    )
    const decimals = await pair.decimals()
    const token0 = {
      symbol: selectedToken?.networkSymbol(selectedNetwork)
    }
    const token1 = {
      symbol: hopToken.networkSymbol(selectedNetwork)
    }

    const reserves = await pair.getReserves()
    const reserve0 = Number(formatUnits(reserves[0].toString(), decimals))
    const reserve1 = Number(formatUnits(reserves[1].toString(), decimals))

    return {
      pairAddress: Address.from(pairAddress),
      pairUrl: '#',
      totalLiquidity: reserve0 + reserve1,
      token0,
      token1,
      reserve0,
      reserve1,
      network: selectedNetwork
    }
  }

  useEffect(() => {
    const update = async () => {
      if (!filteredNetworks) {
        return
      }
      setFetching(true)
      const results: any = []
      for (let network of filteredNetworks) {
        for (let token of tokens.slice(0, 2)) {
          const result = await fetchStats(network, token)
          if (result) {
            results.push(result)
          }
        }
      }
      setFetching(false)
      setStats(results)
    }

    update().catch(logger.error)
  }, [])

  return (
    <StatsContext.Provider
      value={{
        fetching,
        stats
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = () => useContext(StatsContext)

export default StatsContextProvider
