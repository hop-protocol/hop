import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { formatUnits } from 'ethers/lib/utils'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { useApp } from 'src/contexts/AppContext'
import logger from 'src/logger'
import * as config from 'src/config'

type StatsContextProps = {
  stats: any[]
  fetching: boolean,

  bonderStats: any[],
  fetchingBonderStats: boolean,

  pendingAmounts: any[],
  fetchingPendingAmounts: boolean
}

const StatsContext = createContext<StatsContextProps>({
  stats: [],
  fetching: false,

  bonderStats: [],
  fetchingBonderStats: false,

  pendingAmounts: [],
  fetchingPendingAmounts: false
})

type BonderStats = {
  id: string
  bonder: string,
  token: Token,
  network: Network,
  credit: number,
  debit: number,
  availableLiquidity: number
  eth: number
}

const StatsContextProvider: FC = ({ children }) => {
  const { networks, tokens, sdk } = useApp()
  const [stats, setStats] = useState<any[]>([])
  const [fetching, setFetching] = useState<boolean>(false)
  const [bonderStats, setBonderStats] = useState<any[]>([])
  const [fetchingBonderStats, setFetchingBonderStats] = useState<boolean>(false)
  const [pendingAmounts, setPendingAmounts] = useState<any[]>([])
  const [fetchingPendingAmounts, setFetchingPendingAmounts] = useState<boolean>(false)
  const filteredNetworks = networks?.filter(token => !token.isLayer1)

  async function fetchStats (selectedNetwork: Network, selectedToken: Token) {
    if (!selectedNetwork) {
      return
    }
    const token = tokens.find(token => token.symbol === selectedToken?.symbol)
    if (!token) {
      return
    }

    const hopToken = new Token({
      symbol: `h${token?.symbol}`,
      tokenName: token?.tokenName,
      imageUrl: token?.imageUrl,
      decimals: token?.decimals,
    })
    const decimals = hopToken.decimals
    const token0 = {
      symbol: selectedToken?.networkSymbol(selectedNetwork)
    }
    const token1 = {
      symbol: hopToken.networkSymbol(selectedNetwork)
    }

    const bridge = sdk.bridge(selectedToken.symbol)
    const reserves = await bridge.getSaddleSwapReserves(selectedNetwork.slug)
    const reserve0 = Number(formatUnits(reserves[0].toString(), decimals))
    const reserve1 = Number(formatUnits(reserves[1].toString(), decimals))

    return {
      id: `${selectedNetwork.slug}-${token0.symbol}-${token1.symbol}`,
      pairAddress: null,
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
      for (const network of filteredNetworks) {
        for (const token of tokens) {
          promises.push(fetchStats(network, token))
        }
      }
      const results: any[] = await Promise.all(promises)
      setFetching(false)
      setStats(results.filter(x => x))
    }

    update().catch(logger.error)
  }, [])

  async function fetchBonderStats (selectedNetwork: Network, selectedToken: Token, bonder: string): Promise<BonderStats | undefined> {
    if (!selectedNetwork) {
      return
    }
    const token = tokens.find(token => token.symbol === selectedToken?.symbol)
    if (!token) {
      return
    }

    const bridge = sdk.bridge(selectedToken.symbol)
    const [credit, debit, availableLiquidity, eth] = await Promise.all([
      bridge.getCredit(selectedNetwork.slug, bonder),
      bridge.getDebit(selectedNetwork.slug, bonder),
      bridge.getAvailableLiquidity(selectedNetwork.slug, bonder),
      bridge.getEthBalance(selectedNetwork.slug, bonder)
    ])

    return {
      id: `${selectedNetwork.slug}-${token.symbol}-${bonder}`,
      bonder,
      token,
      network: selectedNetwork,
      credit: Number(formatUnits(credit.toString(), token.decimals)),
      debit: Number(formatUnits(debit.toString(), token.decimals)),
      availableLiquidity: Number(formatUnits(availableLiquidity.toString(), token.decimals)),
      eth: Number(formatUnits(eth.toString(), 18))
    }
  }

  useEffect(() => {
    const update = async () => {
      if (!networks) {
        return
      }
      setFetchingBonderStats(true)
      const promises: Promise<any>[] = []
      for (const network of networks) {
        for (const token of tokens) {
          for (const bonder of config.addresses.bonders?.[token.symbol]) {
            promises.push(fetchBonderStats(network, token, bonder))
          }
        }
      }
      const results: any[] = await Promise.all(promises)
      setFetchingBonderStats(false)
      setBonderStats(results.filter(x => x))
    }

    update().catch(logger.error)
  }, [])

  async function fetchPendingAmounts (sourceNetwork: Network, destinationNetwork: Network, token: Token) {
    if (!sourceNetwork) {
      return
    }
    if (!destinationNetwork) {
      return
    }
    if (!token) {
      return
    }

    const bridge = sdk.bridge(token.symbol)
    const contract = await bridge.getBridgeContract(sourceNetwork.slug)
    const pendingAmountBn = await contract.pendingAmountForChainId(destinationNetwork.networkId)
    const pendingAmount = formatUnits(pendingAmountBn, token.decimals)

    return {
      id: `${sourceNetwork.slug}-${destinationNetwork.slug}-${token.symbol}`,
      sourceNetwork,
      destinationNetwork,
      token,
      pendingAmount
    }
  }

  useEffect(() => {
    const update = async () => {
      if (!filteredNetworks) {
        return
      }
      setFetchingPendingAmounts(true)
      const promises: Promise<any>[] = []
      for (const sourceNetwork of filteredNetworks) {
        for (const token of tokens) {
          for (const destinationNetwork of networks) {
            if (destinationNetwork === sourceNetwork) {
              continue
            }
            promises.push(fetchPendingAmounts(sourceNetwork, destinationNetwork, token))
          }
        }
      }
      const results: any[] = await Promise.all(promises)
      setFetchingPendingAmounts(false)
      setPendingAmounts(results.filter(x => x))
    }

    update().catch(logger.error)
  }, [])

  return (
    <StatsContext.Provider
      value={{
        stats,
        fetching,

        bonderStats,
        fetchingBonderStats,

        pendingAmounts,
        fetchingPendingAmounts,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = () => useContext(StatsContext)

export default StatsContextProvider
