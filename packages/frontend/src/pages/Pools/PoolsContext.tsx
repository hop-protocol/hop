import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  ChangeEvent,
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
import { shiftBNDecimals, BNMin } from 'src/utils'
import { l2Networks } from 'src/config/networks'
import { amountToBN, formatError } from 'src/utils/format'
import {
  useTransactionReplacement,
  useAsyncMemo,
  useBalance,
  useApprove,
  useSelectedNetwork,
  useAssets,
} from 'src/hooks'
import { useInterval } from 'react-use'

type PoolsContextProps = {
  addLiquidity: () => void
  address?: Address
  apr?: number
  canonicalBalance?: BigNumber
  canonicalToken?: Token
  error?: string | null
  fee?: number
  hopBalance?: BigNumber
  hopToken?: Token
  isNativeToken: boolean
  loadingCanonicalBalance: boolean
  loadingHopBalance: boolean
  networks: Network[]
  poolReserves: BigNumber[]
  poolSharePercentage?: string
  priceImpact?: number
  removeLiquidity: () => void
  removing: boolean
  reserveTotalsUsd?: number
  selectBothNetworks: (event: ChangeEvent<{ value: any }>) => void
  selectedNetwork?: Network
  sendButtonText: string
  sending: boolean
  setError: (error?: string | null) => void
  setToken0Amount: (value: string) => void
  setToken1Amount: (value: string) => void
  setWarning: (warning?: string) => void
  token0Amount: string
  token0Deposited?: BigNumber
  token0Price?: string
  token1Amount: string
  token1Deposited?: BigNumber
  token1Price?: string
  token1Rate?: string
  tokenSumDeposited?: BigNumber
  totalSupply?: string
  txHash?: string
  unsupportedAsset: any
  userPoolBalance?: BigNumber
  userPoolBalanceFormatted?: string
  userPoolTokenPercentage?: string
  validFormFields: boolean
  virtualPrice?: number
  warning?: string
}

const TOTAL_AMOUNTS_DECIMALS = 18

const PoolsContext = createContext<PoolsContextProps | undefined>(undefined)

const PoolsProvider: FC = ({ children }) => {
  const [token0Amount, setToken0Amount] = useState<string>('')
  const [token1Amount, setToken1Amount] = useState<string>('')
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [token1Rate, setToken1Rate] = useState<string>('')
  const [poolReserves, setPoolReserves] = useState<BigNumber[]>([])
  const [poolSharePercentage, setPoolSharePercentage] = useState<string>('0')
  const [token0Price, setToken0Price] = useState<string>('-')
  const [token1Price, setToken1Price] = useState<string>('-')
  const [userPoolBalance, setUserPoolBalance] = useState<BigNumber>()
  const [userPoolBalanceFormatted, setUserPoolBalanceFormatted] = useState<string>()
  const [userPoolTokenPercentage, setUserPoolTokenPercentage] = useState<string>('')
  const [token0Deposited, setToken0Deposited] = useState<BigNumber | undefined>()
  const [token1Deposited, setToken1Deposited] = useState<BigNumber | undefined>()
  const [tokenSumDeposited, setTokenSumDeposited] = useState<BigNumber | undefined>()
  const [apr, setApr] = useState<number | undefined>()
  const aprRef = useRef<string>('')
  const [reserveTotalsUsd, setReserveTotalsUsd] = useState<number | undefined>()
  const [virtualPrice, setVirutalPrice] = useState<number | undefined>()
  const [fee, setFee] = useState<number | undefined>()

  const { txConfirm, sdk, selectedBridge, settings } = useApp()
  const { deadline, slippageTolerance } = settings
  const { waitForTransaction, addTransaction } = useTransactionReplacement()
  const slippageToleranceBps = slippageTolerance * 100
  const minBps = Math.ceil(10000 - slippageToleranceBps)
  const { address, provider, checkConnectedNetworkId } = useWeb3Context()
  const [error, setError] = useState<string | null | undefined>(null)
  const [warning, setWarning] = useState<string>()
  const { selectedNetwork, selectBothNetworks } = useSelectedNetwork({
    l2Only: true,
  })
  const { unsupportedAsset } = useAssets(selectedBridge, selectedNetwork)

  const isNativeToken =
    useMemo(() => {
      try {
        if (!selectedNetwork || unsupportedAsset?.chain) return false
        const token = selectedBridge?.getCanonicalToken(selectedNetwork.slug)
        return token?.isNativeToken
      } catch (err) {
        logger.error(err)
      }
      return false
    }, [unsupportedAsset, selectedBridge, selectedNetwork]) ?? false

  const canonicalToken = useMemo(() => {
    try {
      if (!selectedNetwork || unsupportedAsset?.chain) return
      const token = selectedBridge?.getCanonicalToken(selectedNetwork.slug)
      if (token?.isNativeToken) {
        return token?.getWrappedToken()
      }
      return token
    } catch (err) {
      logger.error(err)
    }
  }, [unsupportedAsset, selectedBridge, selectedNetwork])

  const hopToken = useMemo(() => {
    try {
      if (!selectedNetwork || unsupportedAsset?.chain) return
      return selectedBridge?.getL2HopToken(selectedNetwork.slug)
    } catch (err) {
      logger.error(err)
    }
  }, [unsupportedAsset, selectedBridge, selectedNetwork])

  const [txHash, setTxHash] = useState<string | undefined>()
  const [sending, setSending] = useState<boolean>(false)
  const [removing, setRemoving] = useState<boolean>(false)

  const { balance: canonicalBalance, loading: loadingCanonicalBalance } = useBalance(
    canonicalToken,
    address
  )

  const { balance: hopBalance, loading: loadingHopBalance } = useBalance(hopToken, address)

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
      if (!canonicalToken || unsupportedAsset?.chain) {
        return
      }
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const token = await bridge.getL1Token()
      return bridge.priceFeed.getPriceByTokenSymbol(token.symbol)
    } catch (err) {
      console.error(err)
    }
  }, [unsupportedAsset, canonicalToken])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      try {
        setReserveTotalsUsd(undefined)
        if (!(selectedNetwork && canonicalToken && tokenUsdPrice && !unsupportedAsset?.chain)) {
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
          setReserveTotalsUsd(
            Number(
              formatUnits(ammTotal18d.mul(tokenUsdPriceBn).div(precision), TOTAL_AMOUNTS_DECIMALS)
            )
          )
        }
      } catch (err) {
        console.error(err)
      }
    }

    update().catch(err => logger.error(err))
    return () => {
      isSubscribed = false
    }
  }, [unsupportedAsset, selectedNetwork, canonicalToken, tokenUsdPrice])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      try {
        if (!(selectedBridge && selectedNetwork && !unsupportedAsset?.chain)) {
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
  }, [unsupportedAsset, sdk, selectedBridge, selectedNetwork])

  const priceImpact = useAsyncMemo(async () => {
    if (!(canonicalToken && hopToken && selectedNetwork && !unsupportedAsset?.chain)) {
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
  }, [unsupportedAsset, sdk, canonicalToken, hopToken, selectedNetwork, token0Amount, token1Amount])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      setVirutalPrice(undefined)
      if (!canonicalToken || !selectedNetwork || unsupportedAsset?.chain) {
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
  }, [unsupportedAsset, sdk, canonicalToken, selectedNetwork])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      setFee(undefined)
      if (!canonicalToken || !selectedNetwork || unsupportedAsset?.chain) {
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
  }, [unsupportedAsset, sdk, canonicalToken, selectedNetwork])

  const updatePrices = useCallback(async () => {
    try {
      if (!(totalSupply && canonicalToken && poolReserves.length > 0 && !unsupportedAsset?.chain)) {
        return
      }
      if (Number(token1Rate)) {
        const price = new Price(token1Rate, '1')
        setToken0Price(price.toFixed(2))
        setToken1Price(price.inverted().toFixed(2))
      }

      if (token0Amount || token1Amount) {
        let amount0 = 0
        let amount1 = 0

        const reserve0 = Number(formatUnits(poolReserves[0]?.toString(), canonicalToken?.decimals))
        const reserve1 = Number(formatUnits(poolReserves[1]?.toString(), canonicalToken.decimals))

        if (token0Amount) {
          amount0 = (Number(token0Amount) * Number(totalSupply)) / reserve0
        }
        if (token1Amount) {
          amount1 = (Number(token1Amount) * Number(totalSupply)) / reserve1
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
  }, [
    unsupportedAsset,
    token0Amount,
    totalSupply,
    token1Amount,
    token1Rate,
    poolReserves,
    canonicalToken,
  ])

  useEffect(() => {
    updatePrices()
  }, [hopToken, token0Amount, totalSupply, token1Amount, token1Rate, poolReserves, updatePrices])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      setPoolReserves([])
      if (!(canonicalToken && hopToken && selectedNetwork && !unsupportedAsset?.chain)) {
        return
      }
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const lpToken = await bridge.getSaddleLpToken(selectedNetwork.slug)
      const [lpDecimalsBn, reserves] = await Promise.all([
        lpToken.decimals,
        bridge.getSaddleSwapReserves(selectedNetwork.slug),
      ])

      const lpDecimals = Number(lpDecimalsBn.toString())
      if (isSubscribed) {
        setPoolReserves(reserves)
      }
    }

    update().catch(err => logger.error(err))
    return () => {
      isSubscribed = false
    }
  }, [unsupportedAsset, canonicalToken, hopToken, selectedNetwork])

  const updateUserPoolPositions = useCallback(async () => {
    try {
      if (
        !(
          canonicalToken &&
          provider &&
          selectedNetwork?.provider &&
          poolReserves &&
          !unsupportedAsset?.chain
        )
      ) {
        setToken1Rate('')
        setToken0Deposited(undefined)
        setToken1Deposited(undefined)
        setTokenSumDeposited(undefined)
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
      const tokenSumDeposited = token0Deposited.add(token1Deposited)

      if (token0Deposited.gt(0)) {
        setToken0Deposited(token0Deposited)
      }
      if (token1Deposited.gt(0)) {
        setToken1Deposited(token1Deposited)
      }
      if (tokenSumDeposited.gt(0)) {
        setTokenSumDeposited(tokenSumDeposited)
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
  }, [unsupportedAsset, provider, selectedNetwork, canonicalToken, hopToken])

  useEffect(() => {
    updateUserPoolPositions()
  }, [provider, selectedNetwork, canonicalToken, hopToken, updateUserPoolPositions])

  useInterval(updatePrices, 5 * 1000)

  useInterval(updateUserPoolPositions, 5 * 1000)

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
      if (!isNetworkConnected || !selectedNetwork) return

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

      setRemoving(true)
      const bridge = sdk.bridge(canonicalToken.symbol)
      const amm = bridge.getAmm(selectedNetwork!.slug)
      const saddleSwap = await amm.getSaddleSwap()
      const lpToken = await bridge.getSaddleLpToken(selectedNetwork!.slug)
      const lpTokenDecimals = await lpToken.decimals
      const token0Amount = token0Deposited
      const token1Amount = token1Deposited
      const totalAmount = token0Amount?.add(token1Amount || 0)
      const signer = provider?.getSigner()
      const balance = await lpToken?.balanceOf()
      const approvalTx = await approve(balance, lpToken, saddleSwap.address)
      await approvalTx?.wait()

      const calculatePriceImpact = async (amounts: any) => {
        try {
          const { proportional, tokenIndex, amountPercent, amount } = amounts
          if (proportional) {
            const liquidityTokenAmount = balance.mul(amountPercent).div(100)
            const minimumAmounts = await amm.calculateRemoveLiquidityMinimum(liquidityTokenAmount)
            const amount0 = minimumAmounts[0]
            const amount1 = minimumAmounts[1]
            const price = await amm.getRemoveLiquidityPriceImpact(amount0, amount1)
            const formatted = Number(formatUnits(price.toString(), 18))
            return formatted
          } else {
            const amount0 = !tokenIndex ? amount : BigNumber.from(0)
            const amount1 = tokenIndex ? amount : BigNumber.from(0)
            const price = await amm.getRemoveLiquidityPriceImpact(amount0, amount1)
            const formatted = Number(formatUnits(price.toString(), 18))
            return formatted
          }
        } catch (err) {
          logger.error(err)
        }
      }

      const removeLiquidityTx = await txConfirm?.show({
        kind: 'removeLiquidity',
        inputProps: {
          token0: {
            amount: token0Amount,
            token: canonicalToken,
            network: selectedNetwork,
            max: BNMin(poolReserves[0], totalAmount),
          },
          token1: {
            amount: token1Amount,
            token: hopToken,
            network: selectedNetwork,
            max: BNMin(poolReserves[1], totalAmount),
          },
          calculatePriceImpact,
        },
        onConfirm: async (amounts: any) => {
          const { proportional, tokenIndex, amountPercent, amount } = amounts

          if (proportional) {
            const liquidityTokenAmount = balance.mul(amountPercent).div(100)
            const liquidityTokenAmountWithSlippage = liquidityTokenAmount.mul(minBps).div(10000)
            const minimumAmounts = await amm.calculateRemoveLiquidityMinimum(
              liquidityTokenAmountWithSlippage
            )
            const amount0Min = minimumAmounts[0]
            const amount1Min = minimumAmounts[1]
            logger.debug('removeLiquidity:', {
              balance,
              proportional,
              amountPercent,
              liquidityTokenAmount,
              liquidityTokenAmountWithSlippage,
              amount0Min,
              amount1Min,
            })

            if (liquidityTokenAmount.eq(0)) {
              throw new Error('calculation error: liquidityTokenAmount cannot be 0')
            }

            return bridge
              .connect(signer as Signer)
              .removeLiquidity(liquidityTokenAmount, selectedNetwork!.slug, {
                amount0Min,
                amount1Min,
                deadline: deadline(),
              })
          } else {
            const amount18d = shiftBNDecimals(amount, lpTokenDecimals - canonicalToken.decimals)
            let tokenAmount = await amm.calculateRemoveLiquidityOneToken(amount18d, tokenIndex)
            tokenAmount = shiftBNDecimals(tokenAmount, lpTokenDecimals - canonicalToken.decimals)
            if (tokenAmount.gt(balance)) {
              tokenAmount = balance
            }
            const liquidityTokenAmountWithSlippage = tokenAmount.mul(minBps).div(10000)
            const minimumAmounts = await amm.calculateRemoveLiquidityMinimum(
              liquidityTokenAmountWithSlippage
            )
            const amountMin = minimumAmounts[tokenIndex].mul(minBps).div(10000)

            logger.debug('removeLiquidity:', {
              balance,
              amount,
              tokenIndex,
              tokenAmount,
              liquidityTokenAmountWithSlippage,
              amountMin,
            })

            if (tokenAmount.eq(0)) {
              throw new Error('calculation error: tokenAmount cannot be 0')
            }

            return bridge
              .connect(signer as Signer)
              .removeLiquidityOneToken(tokenAmount, tokenIndex, selectedNetwork!.slug, {
                amountMin: amountMin,
                deadline: deadline(),
              })
          }
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

      const res = await waitForTransaction(removeLiquidityTx, {
        networkName: selectedNetwork!.slug,
      })
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

    setRemoving(false)
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
        addLiquidity,
        address,
        apr,
        canonicalBalance,
        canonicalToken,
        error,
        fee,
        hopBalance,
        hopToken,
        isNativeToken,
        loadingCanonicalBalance,
        loadingHopBalance,
        networks: l2Networks,
        poolReserves,
        poolSharePercentage,
        priceImpact,
        removeLiquidity,
        removing,
        reserveTotalsUsd,
        selectedNetwork,
        sendButtonText,
        sending,
        selectBothNetworks,
        setError,
        setToken0Amount,
        setToken1Amount,
        setWarning,
        token0Amount,
        token0Deposited,
        token0Price,
        token1Amount,
        token1Deposited,
        token1Price,
        token1Rate,
        tokenSumDeposited,
        totalSupply,
        txHash,
        unsupportedAsset,
        userPoolBalance,
        userPoolBalanceFormatted,
        userPoolTokenPercentage,
        validFormFields,
        virtualPrice,
        warning,
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}

export function usePools() {
  const ctx = useContext(PoolsContext)
  if (ctx === undefined) {
    throw new Error('usePools must be used within PoolsProvider')
  }
  return ctx
}

export default PoolsProvider
