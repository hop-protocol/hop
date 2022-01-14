import React, { FC, createContext, useContext, useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { getArbitrumAlias } from 'src/utils'
import { useApp } from 'src/contexts/AppContext'
import logger from 'src/logger'
import * as config from 'src/config'
import { HToken, CanonicalToken } from '@hop-protocol/sdk'

type StatsContextProps = {
  stats: any[]
  fetching: boolean

  bonderStats: any[]
  fetchingBonderStats: boolean

  pendingAmounts: any[]
  fetchingPendingAmounts: boolean

  balances: any[]
  fetchingBalances: boolean

  debitWindowStats: any[]
  fetchingDebitWindowStats: boolean
}

const StatsContext = createContext<StatsContextProps>({
  stats: [],
  fetching: false,

  bonderStats: [],
  fetchingBonderStats: false,

  pendingAmounts: [],
  fetchingPendingAmounts: false,

  balances: [],
  fetchingBalances: false,

  debitWindowStats: [],
  fetchingDebitWindowStats: false,
})

type BonderStats = {
  id: string
  bonder: string
  token: Token
  network: Network
  credit: number
  debit: number
  availableLiquidity: number
  pendingAmount: number
  virtualDebt: number
  totalAmount: number
  availableEth: number
}

type BalanceStats = {
  network: string
  name: string
  address: string
  balance: number
}

type DebitWindowStats = {
  token: Token
  amountBonded: number[]
  remainingMin: number
}

const StatsContextProvider: FC = ({ children }) => {
  const { networks, tokens, sdk } = useApp()
  const [stats, setStats] = useState<any[]>([])
  const [fetching, setFetching] = useState<boolean>(true)
  const [bonderStats, setBonderStats] = useState<any[]>([])
  const [fetchingBonderStats, setFetchingBonderStats] = useState<boolean>(true)
  const [pendingAmounts, setPendingAmounts] = useState<any[]>([])
  const [fetchingPendingAmounts, setFetchingPendingAmounts] = useState<boolean>(true)
  const [balances, setBalances] = useState<any[]>([])
  const [fetchingBalances, setFetchingBalances] = useState<boolean>(true)
  const [debitWindowStats, setDebitWindowStats] = useState<any[]>([])
  const [fetchingDebitWindowStats, setFetchingDebitWindowStats] = useState<boolean>(true)
  const filteredNetworks = networks?.filter(token => !token.isLayer1)

  async function fetchStats(selectedNetwork: Network, selectedToken: Token) {
    if (!selectedNetwork) {
      return
    }
    const token = tokens.find(token => token.symbol === selectedToken?.symbol)
    if (!token) {
      return
    }

    const hopToken = new Token({
      symbol: `h${token?.symbol}` as HToken,
      tokenName: token?.tokenName,
      imageUrl: token?.imageUrl,
      decimals: token?.decimals,
    })
    const decimals = hopToken.decimals
    const token0 = {
      symbol: selectedToken?.networkSymbol(selectedNetwork),
    }
    const token1 = {
      symbol: hopToken.networkSymbol(selectedNetwork),
    }

    const bridge = sdk.bridge(selectedToken.symbol)
    if (!bridge.isSupportedAsset(selectedNetwork.slug)) {
      return
    }
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
      network: selectedNetwork,
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
          promises.push(fetchStats(network, token).catch(logger.error))
        }
      }
      const results: any[] = await Promise.all(promises)
      setFetching(false)
      setStats(results.filter(x => x))
    }

    update().catch(logger.error)
  }, [])

  async function fetchBonderStats(
    selectedNetwork: Network,
    selectedToken: Token,
    bonder: string
  ): Promise<BonderStats | undefined> {
    if (!selectedNetwork) {
      return
    }
    if (!pendingAmounts?.length) {
      return
    }
    const token = tokens.find(token => token.symbol === selectedToken?.symbol)
    if (!token) {
      return
    }

    const bridge = sdk.bridge(selectedToken.symbol)
    if (!bridge.isSupportedAsset(selectedNetwork.slug)) {
      return
    }
    const [credit, debit, totalDebit, availableLiquidity, eth] = await Promise.all([
      bridge.getCredit(selectedNetwork.slug, bonder),
      bridge.getDebit(selectedNetwork.slug, bonder),
      bridge.getTotalDebit(selectedNetwork.slug, bonder),
      bridge.getAvailableLiquidity(selectedNetwork.slug, bonder),
      bridge.getEthBalance(selectedNetwork.slug, bonder),
    ])

    const virtualDebt = totalDebit.sub(debit)
    let pendingAmount = BigNumber.from(0)
    for (const obj of pendingAmounts) {
      if (
        obj.destinationNetwork.slug === selectedNetwork.slug &&
        obj.token.symbol === token.symbol
      ) {
        pendingAmount = pendingAmount.add(obj.pendingAmount)
      }
    }

    return {
      id: `${selectedNetwork.slug}-${token.symbol}-${bonder}`,
      bonder,
      token,
      network: selectedNetwork,
      credit: Number(formatUnits(credit.toString(), token.decimals)),
      debit: Number(formatUnits(totalDebit.toString(), token.decimals)),
      availableLiquidity: Number(formatUnits(availableLiquidity.toString(), token.decimals)),
      pendingAmount: Number(formatUnits(pendingAmount.toString(), token.decimals)),
      virtualDebt: Number(formatUnits(virtualDebt.toString(), token.decimals)),
      totalAmount: Number(
        formatUnits(availableLiquidity.add(pendingAmount).add(virtualDebt), token.decimals)
      ),
      availableEth: Number(formatUnits(eth.toString(), 18)),
    }
  }

  useEffect(() => {
    const update = async () => {
      setFetchingBonderStats(true)
      if (!networks) {
        return
      }
      const promises: Promise<any>[] = []
      for (const network of networks) {
        for (const token of tokens) {
          const bonders = new Set<string>()
          if (!config.addresses.bonders?.[token.symbol]?.[network.slug]) {
            continue
          }
          for (const destinationChain in config.addresses.bonders?.[token.symbol]?.[network.slug]) {
            const bonder = config.addresses.bonders?.[token.symbol][network.slug][destinationChain]
            if (bonder) {
              bonders.add(bonder)
            }
          }
          for (const bonder of bonders) {
            promises.push(fetchBonderStats(network, token, bonder).catch(logger.error))
          }
        }
      }
      let results: any[] = await Promise.all(promises)
      results = results.filter(x => x)
      setFetchingBonderStats(!results.length)
      setBonderStats(results)
    }

    update().catch(logger.error)
  }, [pendingAmounts])

  async function fetchPendingAmounts(
    sourceNetwork: Network,
    destinationNetwork: Network,
    token: Token
  ) {
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
    if (!bridge.isSupportedAsset(sourceNetwork.slug)) {
      return
    }
    const contract = await bridge.getBridgeContract(sourceNetwork.slug)
    const pendingAmount = await contract.pendingAmountForChainId(destinationNetwork.networkId)
    const formattedPendingAmount = Number(formatUnits(pendingAmount, token.decimals))

    return {
      id: `${sourceNetwork.slug}-${destinationNetwork.slug}-${token.symbol}`,
      sourceNetwork,
      destinationNetwork,
      token,
      pendingAmount,
      formattedPendingAmount,
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
            promises.push(
              fetchPendingAmounts(sourceNetwork, destinationNetwork, token).catch(logger.error)
            )
          }
        }
      }
      const results: any[] = await Promise.all(promises)
      setFetchingPendingAmounts(false)
      setPendingAmounts(results.filter(x => x))
    }

    update().catch(logger.error)
  }, [])

  async function fetchBalances(
    slug: string,
    name: string,
    address: string
  ): Promise<BalanceStats | undefined> {
    if (!slug) {
      return
    }
    if (!name) {
      return
    }
    if (!address) {
      return
    }

    // The token doesn't matter as long as the bridge set exists
    const arbitraryToken = CanonicalToken.USDC
    const bridge = sdk.bridge(arbitraryToken)
    if (!bridge.isSupportedAsset(slug)) {
      return
    }

    // The canonical token decimals is always 18
    const decimals = 18
    const balance = await bridge.getEthBalance(slug, address)
    const formattedBalance: number = Number(formatUnits(balance, decimals))

    return {
      network: slug,
      name,
      address,
      balance: formattedBalance,
    }
  }

  useEffect(() => {
    const update = async () => {
      if (!filteredNetworks) {
        return
      }
      setFetchingBalances(true)
      const addressDatas = [['ethereum', 'relayer', '0x2A6303e6b99d451Df3566068EBb110708335658f']]

      const arbitrumSlug = 'arbitrum'
      for (const token of tokens) {
        const tokenConfig = config.addresses.tokens[token.symbol][arbitrumSlug]
        if (!tokenConfig) {
          continue
        }
        const messengerWrapperAddress: string = tokenConfig.l1MessengerWrapper
        const aliasAddress: string = getArbitrumAlias(messengerWrapperAddress)
        addressDatas.push([arbitrumSlug, `${token.symbol} Alias`, aliasAddress])
      }
      const promises: Promise<any>[] = []
      for (const addressData of addressDatas) {
        const slug: string = addressData[0]
        const name: string = addressData[1]
        const address: string = addressData[2]
        promises.push(fetchBalances(slug, name, address).catch(logger.error))
      }
      const results: any[] = await Promise.all(promises)
      setFetchingBalances(false)
      setBalances(results.filter(x => x))
    }

    update().catch(logger.error)
  }, [])

  async function fetchDebitWindowStats(
    selectedToken: Token,
    bonder: string
  ): Promise<DebitWindowStats | undefined> {
    if (!pendingAmounts?.length) {
      return
    }
    const token = tokens.find(token => token.symbol === selectedToken?.symbol)
    if (!token) {
      return
    }

    const bridge = sdk.bridge(selectedToken.symbol)

    const currentTime: number = Math.floor(Date.now() / 1000)
    const currentTimeSlot: BigNumber = await bridge.getTimeSlot(currentTime)
    const challengePeriod: BigNumber = await bridge.challengePeriod()
    const timeSlotSize: BigNumber = await bridge.timeSlotSize()
    const numTimeSlots: BigNumber = challengePeriod.div(timeSlotSize)
    const amountBonded: number[] = []

    for (let i = 0; i < Number(numTimeSlots); i++) {
      const timeSlot: number = Number(currentTimeSlot.sub(i))
      const amount: BigNumber = await bridge.timeSlotToAmountBonded(timeSlot, bonder)
      amountBonded.push(Number(formatUnits(amount.toString(), token.decimals)))
    }

    const timeElapsedInSlot: number = currentTime % Number(timeSlotSize)
    const remainingSec: number = Number(timeSlotSize.sub(timeElapsedInSlot))
    const remainingMin: number = Math.ceil(remainingSec / 60)

    return {
      token,
      amountBonded,
      remainingMin,
    }
  }

  useEffect(() => {
    const update = async () => {
      setFetchingDebitWindowStats(true)
      if (!networks) {
        return
      }
      const promises: Promise<any>[] = []
      for (const token of tokens) {
        const bonders = new Set<string>()
        for (const bonder in config.addresses.bonders?.[token.symbol]) {
          for (const sourceChain in config.addresses.bonders?.[token.symbol]) {
            for (const destinationChain in config.addresses.bonders?.[token.symbol][sourceChain as string]) {
              const bonder = config.addresses.bonders?.[token.symbol][sourceChain][destinationChain]
              if (bonder) {
                bonders.add(bonder)
              }
            }
          }
        }
        for (const bonder of bonders) {
          promises.push(fetchDebitWindowStats(token, bonder).catch(logger.error))
        }
      }
      let results: any[] = await Promise.all(promises)
      results = results.filter(x => x)
      setFetchingDebitWindowStats(!results.length)
      setDebitWindowStats(results)
    }

    update().catch(logger.error)
  }, [pendingAmounts])

  return (
    <StatsContext.Provider
      value={{
        stats,
        fetching,

        bonderStats,
        fetchingBonderStats,

        pendingAmounts,
        fetchingPendingAmounts,

        balances,
        fetchingBalances,

        debitWindowStats,
        fetchingDebitWindowStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = () => useContext(StatsContext)

export default StatsContextProvider
