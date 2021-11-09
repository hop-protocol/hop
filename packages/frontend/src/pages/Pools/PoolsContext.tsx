import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'react'
import { Signer, BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Network from 'src/models/Network'
import Address from 'src/models/Address'
import Price from 'src/models/Price'
import Transaction from 'src/models/Transaction'
import logger from 'src/logger'
import { shiftBNDecimals } from 'src/utils'
import { reactAppNetwork } from 'src/config'
import { amountToBN, formatError } from 'src/utils/format'
import {
  useTransactionReplacement,
  useAsyncMemo,
  useInterval,
  useBalance,
  useApprove,
} from 'src/hooks'

type PoolsContextProps = {
  networks: Network[]
  canonicalToken: Token | undefined
  hopToken: Token | undefined
  address: Address | undefined
  totalSupply: string | undefined
  selectedNetwork: Network | undefined
  setSelectedNetwork: (network: Network) => void
  token0Amount: string
  setToken0Amount: (value: string) => void
  token1Amount: string
  setToken1Amount: (value: string) => void
  poolSharePercentage: string | undefined
  token0Price: string | undefined
  token1Price: string | undefined
  poolReserves: string[]
  token1Rate: string | undefined
  addLiquidity: () => void
  removeLiquidity: () => void
  userPoolBalance: BigNumber | undefined
  userPoolBalanceFormatted: string | undefined
  userPoolTokenPercentage: string | undefined
  token0Deposited: string | undefined
  token1Deposited: string | undefined
  canonicalBalance: BigNumber | undefined
  hopBalance: BigNumber | undefined
  loadingCanonicalBalance: boolean
  loadingHopBalance: boolean
  txHash: string | undefined
  sending: boolean
  validFormFields: boolean
  sendButtonText: string
  error: string | null | undefined
  setError: (error: string | null | undefined) => void
  isNativeToken: boolean
  fee: number | undefined
  apr: number | undefined
  priceImpact: number | undefined
  virtualPrice: number | undefined
  reserveTotalsUsd: number | undefined
  unsupportedAsset: any
}

const TOTAL_AMOUNTS_DECIMALS = 18

const PoolsContext = createContext<PoolsContextProps>({
  networks: [],
  canonicalToken: undefined,
  hopToken: undefined,
  address: undefined,
  totalSupply: undefined,
  selectedNetwork: undefined,
  setSelectedNetwork: (network: Network) => {},
  token0Amount: '',
  setToken0Amount: (value: string) => {},
  token1Amount: '',
  setToken1Amount: (value: string) => {},
  poolSharePercentage: undefined,
  token0Price: undefined,
  token1Price: undefined,
  poolReserves: [],
  token1Rate: undefined,
  addLiquidity: () => {},
  removeLiquidity: () => {},
  userPoolBalance: undefined,
  userPoolBalanceFormatted: undefined,
  userPoolTokenPercentage: undefined,
  token0Deposited: undefined,
  token1Deposited: undefined,
  canonicalBalance: undefined,
  hopBalance: undefined,
  loadingCanonicalBalance: false,
  loadingHopBalance: false,
  txHash: undefined,
  sending: false,
  validFormFields: false,
  sendButtonText: '',
  error: null,
  setError: (error: string | null | undefined) => {},
  isNativeToken: false,
  fee: undefined,
  apr: undefined,
  priceImpact: undefined,
  virtualPrice: undefined,
  reserveTotalsUsd: undefined,
  unsupportedAsset: null,
})

const PoolsContextProvider: FC = ({ children }) => {
  const [token0Amount, setToken0Amount] = useState<string>('')
  const [token1Amount, setToken1Amount] = useState<string>('')
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [token1Rate, setToken1Rate] = useState<string>('')
  const [poolReserves, setPoolReserves] = useState<string[]>([])
  const [poolSharePercentage, setPoolSharePercentage] = useState<string>('0')
  const [token0Price, setToken0Price] = useState<string>('-')
  const [token1Price, setToken1Price] = useState<string>('-')
  const [userPoolBalance, setUserPoolBalance] = useState<BigNumber>()
  const [userPoolBalanceFormatted, setUserPoolBalanceFormatted] = useState<string>()
  const [userPoolTokenPercentage, setUserPoolTokenPercentage] = useState<string>('')
  const [token0Deposited, setToken0Deposited] = useState<string>('')
  const [token1Deposited, setToken1Deposited] = useState<string>('')
  const [apr, setApr] = useState<number | undefined>()
  const aprRef = useRef<string>('')
  const [reserveTotalsUsd, setReserveTotalsUsd] = useState<number | undefined>()
  const [virtualPrice, setVirutalPrice] = useState<number | undefined>()
  const [fee, setFee] = useState<number | undefined>()

  const { networks, txConfirm, sdk, selectedBridge, settings } = useApp()
  const { deadline, slippageTolerance } = settings
  const { waitForTransaction, addTransaction } = useTransactionReplacement()
  const slippageToleranceBps = slippageTolerance * 100
  const minBps = Math.ceil(10000 - slippageToleranceBps)
  const { address, provider, checkConnectedNetworkId } = useWeb3Context()
  const [error, setError] = useState<string | null | undefined>(null)
  const l2Networks = useMemo(() => {
    return networks.filter(network => !network.isLayer1)
  }, [networks])
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(l2Networks[0])
  const isNativeToken =
    useMemo(() => {
      try {
        const token = selectedBridge?.getCanonicalToken(selectedNetwork.slug)
        return token?.isNativeToken
      } catch (err) {
        logger.error(err)
      }
      return false
    }, [selectedBridge, selectedNetwork]) ?? false

  const canonicalToken = useMemo(() => {
    try {
      const token = selectedBridge?.getCanonicalToken(selectedNetwork.slug)
      if (token?.isNativeToken) {
        return token?.getWrappedToken()
      }
      return token
    } catch (err) {
      logger.error(err)
    }
  }, [selectedBridge, selectedNetwork])

  const hopToken = useMemo(() => {
    try {
      return selectedBridge?.getL2HopToken(selectedNetwork.slug)
    } catch (err) {
      logger.error(err)
    }
  }, [selectedBridge, selectedNetwork])

  const [txHash, setTxHash] = useState<string | undefined>()
  const [sending, setSending] = useState<boolean>(false)

  const { balance: canonicalBalance, loading: loadingCanonicalBalance } = useBalance(
    canonicalToken,
    selectedNetwork,
    address
  )

  const { balance: hopBalance, loading: loadingHopBalance } = useBalance(
    hopToken,
    selectedNetwork,
    address
  )

  const unsupportedAsset = useMemo(() => {
    if (!(selectedBridge && selectedNetwork)) {
      return null
    }
    const unsupportedAssets = {
      Optimism: reactAppNetwork === 'kovan' ? [] : ['MATIC'],
      Arbitrum: reactAppNetwork === 'kovan' ? [] : ['MATIC'],
    }

    const selectedTokenSymbol = selectedBridge?.getTokenSymbol()
    for (const chain in unsupportedAssets) {
      const tokenSymbols = unsupportedAssets[chain]
      for (const tokenSymbol of tokenSymbols) {
        const isUnsupported =
          selectedTokenSymbol.includes(tokenSymbol) && selectedNetwork?.slug === chain.toLowerCase()
        if (isUnsupported) {
          return {
            chain,
            tokenSymbol,
          }
        }
      }
    }

    return null
  }, [selectedBridge, selectedNetwork])

  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else {
      setError('')
    }
  }, [unsupportedAsset])

  const tokenUsdPrice = useAsyncMemo(async () => {
    try {
      if (!canonicalToken) {
        return
      }
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const token = await bridge.getL1Token()
      return bridge.priceFeed.getPriceByTokenSymbol(token.symbol)
    } catch (err) {
      console.error(err)
    }
  }, [canonicalToken])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      try {
        setReserveTotalsUsd(undefined)
        if (!(selectedNetwork && canonicalToken && tokenUsdPrice)) {
          return
        }

        const tokenUsdPriceBn = amountToBN(tokenUsdPrice.toString(), TOTAL_AMOUNTS_DECIMALS)
        const bridge = await sdk.bridge(canonicalToken.symbol)
        const ammTotal = await bridge.getReservesTotal(selectedNetwork.slug)
        if (ammTotal.lte(0)) {
          setReserveTotalsUsd(0)
          return
        }
        const precision = amountToBN('1', 18)
        const ammTotal18d = shiftBNDecimals(
          ammTotal,
          TOTAL_AMOUNTS_DECIMALS - canonicalToken.decimals
        )
        if (isSubscribed) {
          setReserveTotalsUsd(Number(
            formatUnits(ammTotal18d.mul(tokenUsdPriceBn).div(precision), TOTAL_AMOUNTS_DECIMALS)
          ))
        }
      } catch (err) {
        console.error(err)
      }
    }

    update().catch(err => logger.error(err))
    return () => {
      isSubscribed = false
    }
  }, [selectedNetwork, canonicalToken, tokenUsdPrice])

  useEffect(() => {
    if (!l2Networks.includes(selectedNetwork)) {
      setSelectedNetwork(l2Networks[0])
    }
  }, [l2Networks])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      try {
        if (!(selectedBridge && selectedNetwork)) {
          setApr(undefined)
          return
        }
        const token = await selectedBridge.getCanonicalToken(selectedNetwork.slug)
        const cacheKey = `apr:${selectedNetwork.slug}:${token.symbol}`
        try {
          const cached = JSON.parse(localStorage.getItem(cacheKey) || '')
          const tenMinutes = 10 * 60 * 1000
          const isRecent = cached.timestamp > Date.now() - tenMinutes
          if (cached && isRecent && typeof cached.apr === 'number') {
            setApr(cached.apr)
            return
          }
        } catch (err) {
          // noop
        }
        if (aprRef.current === cacheKey) {
          return
        }
        setApr(undefined)
        aprRef.current = cacheKey
        let apr: number
        try {
          const url = 'https://assets.hop.exchange/v1-pool-stats.json'
          const res = await fetch(url)
          const json = await res.json()

          apr = json.data[token.symbol][selectedNetwork.slug].apr
        } catch (err) {
          const bridge = await sdk.bridge(token.symbol)
          const amm = bridge.getAmm(selectedNetwork.slug)
          apr = await amm.getApr()
        }
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              timestamp: Date.now(),
              apr,
            })
          )
        } catch (err) {
          // noop
        }
        if (isSubscribed) {
          setApr(apr)
        }
      } catch (err) {
        logger.error(err)
      }
    }

    update().catch(err => logger.error(err))
    return () => {
      isSubscribed = false
    }
  }, [sdk, selectedBridge, selectedNetwork])

  const priceImpact = useAsyncMemo(async () => {
    if (!(canonicalToken && hopToken && selectedNetwork)) {
      return
    }
    try {
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const amm = bridge.getAmm(selectedNetwork.slug)
      const amount0 = amountToBN(token0Amount || '0', canonicalToken?.decimals)
      const amount1 = amountToBN(token1Amount || '0', hopToken?.decimals)
      const price = await amm.getPriceImpact(amount0, amount1)
      return Number(formatUnits(price.toString(), 18))
    } catch (err) {
      // noop
    }
  }, [sdk, canonicalToken, hopToken, selectedNetwork, token0Amount, token1Amount])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      setVirutalPrice(undefined)
      if (!canonicalToken) {
        return
      }
      try {
        const bridge = await sdk.bridge(canonicalToken.symbol)
        const amm = bridge.getAmm(selectedNetwork.slug)
        const vPrice = await amm.getVirtualPrice()
        if (isSubscribed) {
          setVirutalPrice(Number(formatUnits(vPrice.toString(), 18)))
        }
      } catch (err) {
        logger.error(err)
      }
    }

    update().catch(err => logger.error(err))
    return () => {
      isSubscribed = false
    }
  }, [sdk, canonicalToken, selectedNetwork])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      setFee(undefined)
      if (!canonicalToken) {
        return
      }
      try {
        const poolFeePrecision = 10
        const bridge = await sdk.bridge(canonicalToken.symbol)
        const amm = bridge.getAmm(selectedNetwork.slug)
        if (isSubscribed) {
          setFee(await amm.getSwapFee())
        }
      } catch (err) {
        logger.error(err)
      }
    }

    update().catch(err => logger.error(err))
    return () => {
      isSubscribed = false
    }
  }, [sdk, canonicalToken, selectedNetwork])

  const updatePrices = useCallback(async () => {
    try {
      if (!totalSupply) return
      if (Number(token1Rate)) {
        const price = new Price(token1Rate, '1')
        setToken0Price(price.toFixed(2))
        setToken1Price(price.inverted().toFixed(2))
      }

      if (token0Amount || token1Amount) {
        let amount0 = 0
        let amount1 = 0
        if (token0Amount) {
          amount0 = (Number(token0Amount) * Number(totalSupply)) / Number(poolReserves[0])
        }
        if (token1Amount) {
          amount1 = (Number(token1Amount) * Number(totalSupply)) / Number(poolReserves[1])
        }
        const liquidity = amount0 + amount1
        const sharePercentage = Math.max(
          Math.min(Number(((liquidity / (Number(totalSupply) + liquidity)) * 100).toFixed(2)), 100),
          0
        )
        setPoolSharePercentage((sharePercentage || '0').toString())
      } else {
        setPoolSharePercentage('0')
      }
    } catch (err) {
      logger.error(err)
    }
  }, [token0Amount, totalSupply, token1Amount, token1Rate, poolReserves])

  useEffect(() => {
    updatePrices()
  }, [hopToken, token0Amount, totalSupply, token1Amount, token1Rate, poolReserves, updatePrices])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      setPoolReserves([])
      if (!(canonicalToken && hopToken)) {
        return
      }
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const lpToken = await bridge.getSaddleLpToken(selectedNetwork.slug)
      const [lpDecimalsBn, reserves] = await Promise.all([
        lpToken.decimals,
        bridge.getSaddleSwapReserves(selectedNetwork.slug),
      ])

      const lpDecimals = Number(lpDecimalsBn.toString())
      const reserve0 = formatUnits(reserves[0].toString(), canonicalToken.decimals)
      const reserve1 = formatUnits(reserves[1].toString(), hopToken.decimals)
      if (isSubscribed) {
        setPoolReserves([reserve0, reserve1])
      }
    }

    update().catch(err => logger.error(err))
    return () => {
      isSubscribed = false
    }
  }, [canonicalToken, hopToken, selectedNetwork])

  const updateUserPoolPositions = useCallback(async () => {
    try {
      if (!(canonicalToken && provider && selectedNetwork.provider && poolReserves)) {
        setToken1Rate('')
        setToken0Deposited('')
        setToken1Deposited('')
        setTotalSupply('')
        setUserPoolTokenPercentage('')
        return
      }
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const lpToken = await bridge.getSaddleLpToken(selectedNetwork.slug)

      const [lpDecimalsBn, totalSupply, balance, reserves] = await Promise.all([
        lpToken.decimals,
        (await lpToken.getErc20()).totalSupply(),
        lpToken.balanceOf(),
        bridge.getSaddleSwapReserves(selectedNetwork.slug),
      ])
      setUserPoolBalance(balance)

      const tokenDecimals = canonicalToken?.decimals
      const lpDecimals = Number(lpDecimalsBn.toString())

      const [reserve0, reserve1] = reserves
      const formattedTotalSupply = formatUnits(totalSupply.toString(), lpDecimals)
      setTotalSupply(formattedTotalSupply)

      let formattedBalance = formatUnits(balance.toString(), lpDecimals)
      formattedBalance = Number(formattedBalance).toFixed(5)
      if (Number(formattedBalance) === 0 && balance.gt(0)) {
        formattedBalance = '<0.00001'
      }
      setUserPoolBalanceFormatted(formattedBalance)

      const oneToken = parseUnits('1', lpDecimals)
      const poolPercentage = balance.mul(oneToken).div(totalSupply).mul(100)
      const formattedPoolPercentage = Number(formatUnits(poolPercentage, lpDecimals)).toFixed(2)
      setUserPoolTokenPercentage(
        formattedPoolPercentage === '0.00' ? '<0.01' : formattedPoolPercentage
      )

      const token0Deposited = balance.mul(reserve0).div(totalSupply)
      const token1Deposited = balance.mul(reserve1).div(totalSupply)
      const token0DepositedFormatted = Number(formatUnits(token0Deposited, tokenDecimals))
      const token1DepositedFormatted = Number(formatUnits(token1Deposited, tokenDecimals))

      if (token0DepositedFormatted) {
        setToken0Deposited(token0DepositedFormatted.toFixed(2))
      }
      if (token1DepositedFormatted) {
        setToken1Deposited(token1DepositedFormatted.toFixed(2))
      }
      if (reserve0?.eq(0) && reserve1?.eq(0)) {
        setToken1Rate('0')
      } else {
        const amount0 = formatUnits(reserve1.mul(oneToken).div(reserve0), tokenDecimals)
        setToken1Rate(Number(amount0).toFixed(2))
      }
    } catch (err) {
      logger.error(err)
    }
  }, [provider, selectedNetwork, canonicalToken, hopToken])

  useEffect(() => {
    updateUserPoolPositions()
  }, [provider, selectedNetwork, canonicalToken, hopToken, updateUserPoolPositions])

  useInterval(() => {
    updatePrices()
  }, 5 * 1000)

  useInterval(() => {
    updateUserPoolPositions()
  }, 5 * 1000)

  const { approve } = useApprove(canonicalToken)
  const approveTokens = async (isHop: boolean, amount: string, network: Network) => {
    if (!canonicalToken) {
      throw new Error('Canonical token is required')
    }

    if (!hopToken) {
      throw new Error('Hop token is required')
    }

    const signer = provider?.getSigner()
    const bridge = await sdk.bridge(canonicalToken.symbol).connect(signer as Signer)
    const amm = bridge.getAmm(network.slug)
    const saddleSwap = await amm.getSaddleSwap()
    const spender = saddleSwap.address
    const parsedAmount = amountToBN(amount, canonicalToken.decimals)
    let token = isHop ? bridge.getL2HopToken(network.slug) : bridge.getCanonicalToken(network.slug)
    if (token.isNativeToken) {
      token = token.getWrappedToken()
    }

    return approve(parsedAmount, token, spender)
  }

  const addLiquidity = async () => {
    if (!canonicalToken) {
      throw new Error('Canonical token is required')
    }

    if (!hopToken) {
      throw new Error('Hop token is required')
    }

    try {
      setError(null)
      const networkId = Number(selectedNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      if (!(Number(token0Amount) || Number(token1Amount))) {
        return
      }

      setSending(true)
      if (Number(token0Amount)) {
        const approval0Tx = await approveTokens(false, token0Amount, selectedNetwork)
        await approval0Tx?.wait()
      }

      if (Number(token1Amount)) {
        const approval1Tx = await approveTokens(true, token1Amount, selectedNetwork)
        await approval1Tx?.wait()
      }

      const addLiquidityTx = await txConfirm?.show({
        kind: 'addLiquidity',
        inputProps: {
          token0: {
            amount: token0Amount || '0',
            token: canonicalToken,
            network: selectedNetwork,
          },
          token1: {
            amount: token1Amount || '0',
            token: hopToken,
            network: selectedNetwork,
          },
        },
        onConfirm: async () => {
          const signer = provider?.getSigner()
          const amount0Desired = amountToBN(token0Amount || '0', canonicalToken?.decimals)
          const amount1Desired = amountToBN(token1Amount || '0', hopToken?.decimals)

          const bridge = sdk.bridge(canonicalToken.symbol)
          const amm = bridge.getAmm(selectedNetwork.slug)
          const minAmount0 = amount0Desired.mul(minBps).div(10000)
          const minAmount1 = amount1Desired.mul(minBps).div(10000)
          const minToMint = await amm.calculateAddLiquidityMinimum(minAmount0, minAmount1)

          return bridge
            .connect(signer as Signer)
            .addLiquidity(amount0Desired, amount1Desired, selectedNetwork.slug, {
              minToMint,
              deadline: deadline(),
            })
        },
      })

      setTxHash(addLiquidityTx?.hash)
      if (addLiquidityTx?.hash && selectedNetwork) {
        addTransaction(
          new Transaction({
            hash: addLiquidityTx?.hash,
            networkName: selectedNetwork?.slug,
          })
        )
      }

      const res = await waitForTransaction(addLiquidityTx, { networkName: selectedNetwork.slug })
      if (res && 'replacementTx' in res) {
        setTxHash(res.replacementTx.hash)
      }

      updateUserPoolPositions()
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, selectedNetwork))
      }
      logger.error(err)
    }

    setSending(false)
  }

  const removeLiquidity = async () => {
    if (!canonicalToken) {
      throw new Error('Canonical token is required')
    }

    if (!hopToken) {
      throw new Error('Hop token is required')
    }

    try {
      setError(null)
      const networkId = Number(selectedNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      const bridge = sdk.bridge(canonicalToken.symbol)
      const amm = bridge.getAmm(selectedNetwork.slug)
      const saddleSwap = await amm.getSaddleSwap()
      const lpToken = await bridge.getSaddleLpToken(selectedNetwork.slug)
      const lpTokenDecimals = await lpToken.decimals

      const signer = provider?.getSigner()
      const balance = await lpToken?.balanceOf()

      const approvalTx = await approve(balance, lpToken, saddleSwap.address)
      await approvalTx?.wait()

      const token0Amount = token0Deposited
      const token1Amount = token1Deposited

      const removeLiquidityTx = await txConfirm?.show({
        kind: 'removeLiquidity',
        inputProps: {
          token0: {
            amount: token0Amount,
            token: canonicalToken,
            network: selectedNetwork,
          },
          token1: {
            amount: token1Amount,
            token: hopToken,
            network: selectedNetwork,
          },
        },
        onConfirm: async (amountPercent: number) => {
          const liquidityTokenAmount = balance.mul(amountPercent).div(100)
          const liquidityTokenAmountWithSlippage = liquidityTokenAmount.mul(minBps).div(10000)
          const minimumAmounts = await amm.calculateRemoveLiquidityMinimum(
            liquidityTokenAmountWithSlippage
          )
          const amount0Min = minimumAmounts[0]
          const amount1Min = minimumAmounts[1]

          return bridge
            .connect(signer as Signer)
            .removeLiquidity(liquidityTokenAmount, selectedNetwork.slug, {
              amount0Min,
              amount1Min,
              deadline: deadline(),
            })
        },
      })

      setTxHash(removeLiquidityTx?.hash)
      if (removeLiquidityTx?.hash && selectedNetwork) {
        addTransaction(
          new Transaction({
            hash: removeLiquidityTx?.hash,
            networkName: selectedNetwork?.slug,
          })
        )
      }

      const res = await waitForTransaction(removeLiquidityTx, { networkName: selectedNetwork.slug })
      if (res && 'replacementTx' in res) {
        setTxHash(res.replacementTx.hash)
      }

      updateUserPoolPositions()
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, selectedNetwork))
      }
      logger.error(err)
    }

    setSending(false)
  }

  // ToDo: Use BigNumber everywhere and get rid of this conversion
  const token0Balance =
    canonicalToken && canonicalBalance
      ? Number(formatUnits(canonicalBalance, canonicalToken.decimals))
      : 0
  const token1Balance =
    hopToken && hopBalance ? Number(formatUnits(hopBalance, hopToken.decimals)) : 0

  const enoughBalance =
    (Number(token0Amount) ? token0Balance >= Number(token0Amount) : true) &&
    (Number(token1Amount) ? token1Balance >= Number(token1Amount) : true)
  const validFormFields = !!((token0Amount || token1Amount) && enoughBalance)
  let sendButtonText = 'Add Liquidity'
  if (!enoughBalance) {
    sendButtonText = 'Insufficient funds'
  }

  return (
    <PoolsContext.Provider
      value={{
        networks: l2Networks,
        canonicalToken,
        hopToken,
        address,
        totalSupply,
        selectedNetwork,
        setSelectedNetwork,
        token0Amount,
        setToken0Amount,
        token1Amount,
        setToken1Amount,
        poolSharePercentage,
        token0Price,
        token1Price,
        poolReserves,
        token1Rate,
        addLiquidity,
        removeLiquidity,
        userPoolBalance,
        userPoolBalanceFormatted,
        userPoolTokenPercentage,
        token0Deposited,
        token1Deposited,
        txHash,
        sending,
        validFormFields,
        canonicalBalance,
        hopBalance,
        loadingCanonicalBalance,
        loadingHopBalance,
        sendButtonText,
        error,
        setError,
        isNativeToken,
        fee,
        apr,
        priceImpact,
        virtualPrice,
        reserveTotalsUsd,
        unsupportedAsset,
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}

export const usePools = () => useContext(PoolsContext)

export default PoolsContextProvider
