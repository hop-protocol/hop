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
    const uniswapExchange =
      contracts?.tokens[selectedToken.symbol][selectedNetworkSlug]
        ?.uniswapExchange
    const token = tokens.find(token => token.symbol === selectedToken?.symbol)
    if (!token) {
      return
    }

    const hopToken = new Token({
      symbol: `h${token?.symbol}`,
      tokenName: token?.tokenName,
      imageUrl: token?.imageUrl,
      contracts: {
        arbitrum: token?.contracts?.arbitrumHopBridge,
        optimism: token?.contracts?.optimismHopBridge
      }
    })
    const decimals = await uniswapExchange.decimals()
    const token0 = {
      symbol: selectedToken?.networkSymbol(selectedNetwork)
    }
    const token1 = {
      symbol: hopToken.networkSymbol(selectedNetwork)
    }

    const reserves = await uniswapExchange.getReserves()
    const reserve0 = Number(formatUnits(reserves[0].toString(), decimals))
    const reserve1 = Number(formatUnits(reserves[1].toString(), decimals))

    return {
      pairAddress: Address.from(uniswapExchange.address),
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
      const promises: Promise<any>[] = []
      for (let network of filteredNetworks) {
        for (let token of tokens) {
          promises.push(fetchStats(network, token))
        }
      }
      const results: any[] = await Promise.all(promises)
      setFetching(false)
      setStats(results.filter(x => x))
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
