import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback
} from 'react'
import { ethers, Signer, BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import Network from 'src/models/Network'
import Address from 'src/models/Address'
import Price from 'src/models/Price'
import { UINT256 } from 'src/constants'
import Transaction from 'src/models/Transaction'
import useInterval from 'src/hooks/useInterval'
import useBalance from 'src/hooks/useBalance'
import logger from 'src/logger'
import useApprove from 'src/hooks/useApprove'

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
  userPoolBalance: string | undefined
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
  apr: number | undefined,
  priceImpact: number | undefined
}

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
  priceImpact: undefined
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
  const [userPoolBalance, setUserPoolBalance] = useState<string>('')
  const [userPoolTokenPercentage, setUserPoolTokenPercentage] = useState<
    string
  >('')
  const [token0Deposited, setToken0Deposited] = useState<string>('')
  const [token1Deposited, setToken1Deposited] = useState<string>('')
  const [apr, setApr] = useState<number|undefined>()
  const aprRef = useRef<string>('');

  const {
    networks,
    txConfirm,
    txHistory,
    sdk,
    selectedBridge,
    settings
  } = useApp()
  const {
    deadline,
    slippageTolerance
  } = settings
  const slippageToleranceBps = slippageTolerance * 100
  const minBps = Math.ceil(10000 - slippageToleranceBps)
  const { address, provider, checkConnectedNetworkId } = useWeb3Context()
  const [error, setError] = useState<string | null | undefined>(null)
  const l2Networks = useMemo(() => {
    return networks.filter(network => !network.isLayer1)
  }, [networks])
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(l2Networks[0])
  const isNativeToken = useMemo(() => {
    const token = selectedBridge?.getCanonicalToken(selectedNetwork.slug)
    return token?.isNativeToken
  }, [selectedBridge, selectedNetwork]) ?? false

  const canonicalToken = useMemo(() => {
    const token = selectedBridge?.getCanonicalToken(selectedNetwork.slug)
    if (token?.isNativeToken) {
      return token?.getWrappedToken()
    }
    return token
  }, [selectedBridge, selectedNetwork])

  const hopToken = useMemo(() => {
    return selectedBridge?.getL2HopToken(selectedNetwork.slug)
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

  useEffect(() => {
    if (!l2Networks.includes(selectedNetwork)) {
      setSelectedNetwork(l2Networks[0])
    }
  }, [l2Networks])

  useEffect(() => {
    const update = async () => {
      try {
        if (!canonicalToken) {
          return
        }
        if (!selectedNetwork) {
          return
        }
        const cacheKey = `apr:${selectedNetwork.slug}:${canonicalToken.symbol}`
        try {
          const cached = JSON.parse(localStorage.getItem(cacheKey) || '')
          const tenMinutes = 10 * 60 * 1000
          const isRecent = cached.timestamp > Date.now() - tenMinutes
          if (cached && isRecent && cached.apr) {
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
        const bridge = await sdk.bridge(canonicalToken.symbol)
        const amm = bridge.getAmm(selectedNetwork.slug)
        const apr = await amm.getApr()
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            apr
          }))
        } catch (err) {
          // noop
        }
        setApr(apr)
      } catch (err) {
        setApr(undefined)
        logger.error(err)
      }
    }

    update()
  }, [sdk, canonicalToken, selectedNetwork])

  const priceImpact = useAsyncMemo(async () => {
    if (!(
      canonicalToken &&
      hopToken &&
      selectedNetwork
    )) {
      return
    }
    try {
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const amm = bridge.getAmm(selectedNetwork.slug)
      const amount0 = parseUnits(token0Amount || '0', canonicalToken?.decimals)
      const amount1 = parseUnits(token1Amount || '0', hopToken?.decimals)
      const price = await amm.getPriceImpact(amount0, amount1)
      return Number(formatUnits(price.toString(), 18))
    } catch (err) {
      // noop
    }
  }, [sdk, canonicalToken, hopToken, selectedNetwork, token0Amount, token1Amount])

  const fee = useAsyncMemo(async () => {
    if (!canonicalToken) {
      return
    }
    const poolFeePrecision = 10
    const bridge = await sdk.bridge(canonicalToken.symbol)
    const amm = bridge.getAmm(selectedNetwork.slug)
    return amm.getSwapFee()
  }, [sdk, canonicalToken, selectedNetwork])

  const updatePrices = useCallback(async () => {
    if (!totalSupply) return
    if (Number(token1Rate)) {
      const price = new Price(token1Rate, '1')
      setToken0Price(price.toFixed(2))
      setToken1Price(price.inverted().toFixed(2))
    }

    if (token0Amount && token1Amount) {
      const amount0 =
        (Number(token0Amount) * Number(totalSupply)) / Number(poolReserves[0])
      const amount1 =
        (Number(token1Amount) * Number(totalSupply)) / Number(poolReserves[1])
      const liquidity = Math.min(amount0, amount1)
      const sharePercentage = Math.max(
        Math.min(
          Number(
            ((liquidity / (Number(totalSupply) + liquidity)) * 100).toFixed(2)
          ),
          100
        ),
        0
      )
      setPoolSharePercentage((sharePercentage || '0').toString())
    } else {
      setPoolSharePercentage('0')
    }
  }, [token0Amount, totalSupply, token1Amount, token1Rate, poolReserves])

  useEffect(() => {
    updatePrices()
  }, [
    hopToken,
    token0Amount,
    totalSupply,
    token1Amount,
    token1Rate,
    poolReserves,
    updatePrices
  ])

  useEffect(() => {
    const update = async () => {
      if (!(canonicalToken && hopToken)) {
        return
      }
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const lpToken = await bridge.getSaddleLpToken(selectedNetwork.slug)
      const [lpDecimalsBn, reserves] = await Promise.all([
        lpToken.decimals,
        bridge.getSaddleSwapReserves(selectedNetwork.slug)
      ])

      const lpDecimals = Number(lpDecimalsBn.toString())
      const reserve0 = formatUnits(reserves[0].toString(), canonicalToken.decimals)
      const reserve1 = formatUnits(reserves[1].toString(), hopToken.decimals)
      setPoolReserves([reserve0, reserve1])
    }

    update()
  }, [canonicalToken, hopToken])

  const updateUserPoolPositions = useCallback(async () => {
    try {
      if (!(canonicalToken && provider && selectedNetwork.provider && poolReserves)) {
        return
      }
      const [reserve0, reserve1] = poolReserves
      const bridge = await sdk.bridge(canonicalToken.symbol)
      const lpToken = await bridge.getSaddleLpToken(selectedNetwork.slug)

      const [lpDecimalsBn, totalSupply, balance] = await Promise.all([
        lpToken.decimals,
        (await lpToken.getErc20()).totalSupply(),
        lpToken.balanceOf(),
      ])
      const lpDecimals = Number(lpDecimalsBn.toString())

      const formattedTotalSupply = formatUnits(
        totalSupply.toString(),
        lpDecimals
      )
      setTotalSupply(formattedTotalSupply)

      const formattedBalance = formatUnits(balance.toString(), lpDecimals)
      setUserPoolBalance(Number(formattedBalance).toFixed(2))

      const poolPercentage =
        (Number(formattedBalance) / Number(formattedTotalSupply)) * 100
      const formattedPoolPercentage =
        poolPercentage.toFixed(2) === '0.00'
          ? '<0.01'
          : poolPercentage.toFixed(2)
      setUserPoolTokenPercentage(formattedPoolPercentage)

      const token0Deposited =
        (Number(formattedBalance) * Number(reserve0)) /
        Number(formattedTotalSupply)
      const token1Deposited =
        (Number(formattedBalance) * Number(reserve1)) /
        Number(formattedTotalSupply)
      setToken0Deposited(token0Deposited.toFixed(2))
      setToken1Deposited(token1Deposited.toFixed(2))

      if (!Number(reserve0) && !Number(reserve1)) {
        setToken1Rate('0')
      } else {
        const amount0 = (1 * Number(reserve1)) / Number(reserve0)
        setToken1Rate(amount0.toString())
      }
    } catch (err) {
      logger.error(err)
    }
  }, [provider, selectedNetwork, canonicalToken, hopToken, poolReserves])

  useEffect(() => {
    updateUserPoolPositions()
  }, [
    provider,
    selectedNetwork,
    canonicalToken,
    hopToken,
    updateUserPoolPositions
  ])

  useInterval(() => {
    updatePrices()
  }, 5 * 1000)

  useInterval(() => {
    updateUserPoolPositions()
  }, 20 * 1000)

  const approve = useApprove()
  const approveTokens = async (
    isHop: boolean,
    amount: string,
    network: Network
  ) => {
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
    const parsedAmount = parseUnits(amount, canonicalToken.decimals)
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

      const signer = provider?.getSigner()
      const amount0Desired = parseUnits(token0Amount || '0', canonicalToken?.decimals)
      const amount1Desired = parseUnits(token1Amount || '0', hopToken?.decimals)

      const bridge = sdk.bridge(canonicalToken.symbol)
      const amm = bridge.getAmm(selectedNetwork.slug)
      const minAmount0 = amount0Desired.mul(minBps).div(10000)
      const minAmount1 = amount1Desired.mul(minBps).div(10000)
      const minToMint = await amm.calculateAddLiquidityMinimum(minAmount0, minAmount1)

      const addLiquidityTx = await txConfirm?.show({
        kind: 'addLiquidity',
        inputProps: {
          token0: {
            amount: token0Amount || '0',
            token: canonicalToken,
            network: selectedNetwork
          },
          token1: {
            amount: token1Amount || '0',
            token: hopToken,
            network: selectedNetwork
          }
        },
        onConfirm: async () => {
          return bridge
            .connect(signer as Signer)
            .addLiquidity(
              amount0Desired,
              amount1Desired,
              selectedNetwork.slug,
              {
                minToMint,
                deadline: deadline()
              }
            )
        }
      })

      setTxHash(addLiquidityTx?.hash)
      if (addLiquidityTx?.hash && selectedNetwork) {
        txHistory?.addTransaction(
          new Transaction({
            hash: addLiquidityTx?.hash,
            networkName: selectedNetwork?.slug
          })
        )
      }
      await addLiquidityTx?.wait()
      updateUserPoolPositions()
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
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
      const formattedBalance = Number(
        formatUnits(balance.toString(), lpTokenDecimals)
      )

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
            network: selectedNetwork
          },
          token1: {
            amount: token1Amount,
            token: hopToken,
            network: selectedNetwork
          }
        },
        onConfirm: async (amountPercent: number) => {
          const liquidityTokenAmount = balance.mul(amountPercent).div(100)
          const liquidityTokenAmountWithSlippage = liquidityTokenAmount.mul(minBps).div(10000)
          const minimumAmounts = await amm.calculateRemoveLiquidityMinimum(liquidityTokenAmountWithSlippage)
          const amount0Min = minimumAmounts[0]
          const amount1Min = minimumAmounts[1]

          return bridge
            .connect(signer as Signer)
            .removeLiquidity(
              liquidityTokenAmount,
              selectedNetwork.slug,
              {
                amount0Min,
                amount1Min,
                deadline: deadline()
              }
            )
        }
      })

      setTxHash(removeLiquidityTx?.hash)
      if (removeLiquidityTx?.hash && selectedNetwork) {
        txHistory?.addTransaction(
          new Transaction({
            hash: removeLiquidityTx?.hash,
            networkName: selectedNetwork?.slug
          })
        )
      }
      await removeLiquidityTx?.wait()
      updateUserPoolPositions()
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      logger.error(err)
    }

    setSending(false)
  }

  // ToDo: Use BigNumber everywhere and get rid of this conversion
  const token0Balance = canonicalToken && canonicalBalance ? Number(formatUnits(canonicalBalance, canonicalToken.decimals)) : 0
  const token1Balance = hopToken && hopBalance ? Number(formatUnits(hopBalance, hopToken.decimals)) : 0

  const enoughBalance = (Number(token0Amount) ? token0Balance >= Number(token0Amount) : true) && (Number(token1Amount) ? token1Balance >= Number(token1Amount) : true)
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
        priceImpact
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}

export const usePools = () => useContext(PoolsContext)

export default PoolsContextProvider
