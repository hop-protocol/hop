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
import Address from 'src/models/Address'
import Network from 'src/models/Network'
import Price from 'src/models/Price'
import logger from 'src/logger'
import { Signer, BigNumber, constants } from 'ethers'
import { StakingRewards__factory } from '@hop-protocol/core/contracts'
import { Token } from '@hop-protocol/sdk'
import { amountToBN, formatError } from 'src/utils/format'
import { commafy, shiftBNDecimals, toTokenDisplay, toPercentDisplay, getTokenDecimals } from 'src/utils'
import { stableCoins } from 'src/utils/constants'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { getTokenImage } from 'src/utils/tokens'
import { hopStakingRewardsContracts, stakingRewardsContracts, reactAppNetwork } from 'src/config'
import { l2Networks } from 'src/config/networks'
import { useApp } from 'src/contexts/AppContext'
import { useInterval } from 'react-use'
import { usePoolStats } from './usePoolStats'
import { useQuery } from 'react-query'
import { useQueryParams, useTransactionReplacement, useAsyncMemo, useBalance, useApprove, useSelectedNetwork, useAssets } from 'src/hooks'
import { useStaking } from './useStaking'
import { useWeb3Context } from 'src/contexts/Web3Context'

type PoolsContextProps = {
  addLiquidityAndStake: () => void
  address?: Address
  apr: number
  aprFormatted: string
  assetWithoutAmm: any
  calculateRemoveLiquidityPriceImpactFn: any,
  canonicalBalance?: BigNumber
  canonicalToken?: Token
  canonicalTokenSymbol: string
  chainImageUrl: string
  chainName: string
  chainSlug: string
  depositAmountTotalDisplayFormatted: string
  enoughBalance: boolean
  error?: string | null
  fee?: number
  feeFormatted: string
  hasBalance: boolean
  hasStakeContract: boolean
  hasStaked: boolean
  hopBalance?: BigNumber
  hopToken?: Token
  hopTokenSymbol: string
  isDepositing: boolean
  isNativeToken: boolean
  isWithdrawing: boolean
  loading: boolean
  loadingCanonicalBalance: boolean
  loadingHopBalance: boolean
  lpTokenTotalSupply?: BigNumber
  lpTokenTotalSupplyFormatted: string
  networks: Network[]
  overallToken0DepositedFormatted: string
  overallToken1DepositedFormatted: string
  overallUserPoolBalanceFormatted: string
  overallUserPoolBalanceUsdFormatted: string
  overallUserPoolTokenPercentageFormatted: string
  poolName: string
  poolReserves: BigNumber[]
  poolSharePercentage?: string
  poolSharePercentageFormatted: string
  priceImpact?: number
  priceImpactFormatted: string
  priceImpactLabel: string
  reserve0: string
  reserve0Formatted: string
  reserve1: string
  reserve1Formatted: string
  reserveTotalsUsd?: number
  reserveTotalsUsdFormatted: string
  selectBothNetworks: (event: ChangeEvent<{ value: any }>) => void
  selectedNetwork?: Network
  sendButtonText: string
  setError: (error?: string | null) => void
  setToken0Amount: (value: string) => void
  setToken1Amount: (value: string) => void
  setWarning: (warning?: string) => void
  token0Amount: string
  token0Balance: number
  token0BalanceBn: BigNumber
  token0BalanceFormatted: string
  token0Deposited?: BigNumber
  token0DepositedFormatted: string
  token0Price?: string
  token1Amount: string
  token1Balance: number
  token1BalanceBn: BigNumber
  token1BalanceFormatted: string
  token1Deposited?: BigNumber
  token1DepositedFormatted: string
  token1Price?: string
  token1Rate?: string
  tokenDecimals: number
  tokenImageUrl: string
  tokenSumDeposited?: BigNumber
  tokenSumDepositedFormatted: string
  tokenSymbol: string
  totalApr?: number
  totalAprFormatted: string
  totalSupply?: string
  tvlFormatted: string
  unstakeAndRemoveLiquidity: (amounts: any) => void
  unsupportedAsset: any
  userPoolBalance?: BigNumber
  userPoolBalanceFormatted?: string
  userPoolBalanceUsd: number
  userPoolBalanceUsdFormatted: string
  userPoolTokenPercentage?: string
  userPoolTokenPercentageFormatted?: string
  validFormFields: boolean
  virtualPrice?: number
  virtualPriceFormatted: string
  volumeUsdFormatted : string
  walletConnected: boolean,
  warning?: string
}

const TOTAL_AMOUNTS_DECIMALS = 18

const PoolsContext = createContext<PoolsContextProps | undefined>(undefined)

const PoolsProvider: FC = ({ children }) => {
  const { queryParams } = useQueryParams()
  const [token0Amount, setToken0Amount] = useState<string>('')
  const [token1Amount, setToken1Amount] = useState<string>('')
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [totalSupplyBn, setTotalSupplyBn] = useState<any>(BigNumber.from(0))
  const [token1Rate, setToken1Rate] = useState<string>('')
  const [poolReserves, setPoolReserves] = useState<BigNumber[]>([])
  const [poolSharePercentage, setPoolSharePercentage] = useState<string>('0')
  const [token0Price, setToken0Price] = useState<string>('-')
  const [token1Price, setToken1Price] = useState<string>('-')
  const [userPoolBalance, setUserPoolBalance] = useState<BigNumber>()
  const [userPoolTokenPercentage, setUserPoolTokenPercentage] = useState<string>('')
  const [token0Deposited, setToken0Deposited] = useState<BigNumber | undefined>()
  const [token1Deposited, setToken1Deposited] = useState<BigNumber | undefined>()
  const [overallToken0Deposited, setOverallToken0Deposited] = useState<BigNumber>(BigNumber.from(0))
  const [overallToken1Deposited, setOverallToken1Deposited] = useState<BigNumber>(BigNumber.from(0))
  const [tokenSumDeposited, setTokenSumDeposited] = useState<BigNumber | undefined>()
  const [stakedBalance, setStakedBalance] = useState<any>(BigNumber.from(0))
  const [reserveTotalsUsd, setReserveTotalsUsd] = useState<number | undefined>()
  const [virtualPrice, setVirutalPrice] = useState<number | undefined>()
  const [fee, setFee] = useState<number | undefined>()
  const [lpTokenTotalSupply, setLpTokenTotalSupply] = useState<BigNumber | undefined>()
  const [lpTokenTotalSupplyFormatted, setLpTokenTotalSupplyFormatted] = useState<string>('-')

  const { txConfirm, sdk, selectedBridge, settings } = useApp()
  const { deadline, slippageTolerance } = settings
  const slippageToleranceBps = slippageTolerance * 100
  const minBps = Math.ceil(10000 - slippageToleranceBps)
  const { address, provider, checkConnectedNetworkId, walletConnected } = useWeb3Context()
  const [error, setError] = useState<string | null | undefined>(null)
  const [warning, setWarning] = useState<string>()
  const { selectedNetwork, selectBothNetworks } = useSelectedNetwork({
    l2Only: true,
  })
  const { unsupportedAsset, assetWithoutAmm } = useAssets(selectedBridge, selectedNetwork)
  const [loading, setLoading] = useState(true)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const { getPoolStats } = usePoolStats()
  const lpDecimals = 18
  const accountAddress = (queryParams?.address as string) || address?.address

  const chainSlug = selectedNetwork?.slug ?? ''
  const tokenSymbol = selectedBridge?.getTokenSymbol() ?? ''
  const hopStakingContractAddress = hopStakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]
  const stakingContractAddress = stakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]
  const { lpToken, lpTokenSymbol, stakingContract: hopStakingContract } = useStaking(chainSlug, tokenSymbol, hopStakingContractAddress)
  const { stakingContract } = useStaking(chainSlug, tokenSymbol, stakingContractAddress)
  const tokenDecimals = getTokenDecimals(tokenSymbol)

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

  const { balance: canonicalBalance, loading: loadingCanonicalBalance } = useBalance(
    canonicalToken,
    address
  )

  const { balance: hopBalance, loading: loadingHopBalance } = useBalance(hopToken, address)

  const tokenUsdPrice = useAsyncMemo(async () => {
    try {
      if (!canonicalToken || unsupportedAsset?.chain) {
        return
      }
      const bridge = sdk.bridge(canonicalToken.symbol)
      const token = bridge.getL1Token()
      return stableCoins.has(token.symbol) ? 1 : bridge.priceFeed.getPriceByTokenSymbol(token.symbol)
    } catch (err) {
      console.error(err)
    }
  }, [unsupportedAsset, canonicalToken])

  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else if (assetWithoutAmm) {
      const { chain, tokenSymbol } = assetWithoutAmm
      setError(`${tokenSymbol} does not use an AMM on ${chain}`)
    } else {
      setError('')
    }
  }, [unsupportedAsset, assetWithoutAmm])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      try {
        setReserveTotalsUsd(undefined)
        if (!(selectedNetwork && canonicalToken && tokenUsdPrice && !unsupportedAsset?.chain)) {
          return
        }

        const tokenUsdPriceBn = amountToBN(tokenUsdPrice.toString(), TOTAL_AMOUNTS_DECIMALS)
        const bridge = sdk.bridge(canonicalToken.symbol)
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

  const priceImpact = useAsyncMemo(async () => {
    if (!(canonicalToken && hopToken && selectedNetwork && !unsupportedAsset?.chain)) {
      return
    }
    try {
      const bridge = sdk.bridge(canonicalToken.symbol)
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
        const bridge = sdk.bridge(canonicalToken.symbol)
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
        const bridge = sdk.bridge(canonicalToken.symbol)
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
        let token0AmountBn = BigNumber.from(0)
        let token1AmountBn = BigNumber.from(0)

        // const reserve0 = Number(formatUnits(poolReserves[0]?.toString(), canonicalToken?.decimals))
        // const reserve1 = Number(formatUnits(poolReserves[1]?.toString(), canonicalToken.decimals))

        if (token0Amount) {
          token0AmountBn = parseUnits(token0Amount?.toString(), canonicalToken?.decimals)
          amount0 = Number(token0Amount)
        }
        if (token1Amount) {
          token1AmountBn = parseUnits(token1Amount?.toString(), canonicalToken?.decimals)
          amount1 = Number(token1Amount)
        }
        const liquidity = amount0 + amount1
        const bridge = sdk.bridge(canonicalToken.symbol)
        const amm = bridge.getAmm(selectedNetwork.slug)
        const lpTokensForDepositBn = await amm.calculateAddLiquidityMinimum(token0AmountBn, token1AmountBn)
        const lpTokensForDeposit = Number(formatUnits(lpTokensForDepositBn.toString(), TOTAL_AMOUNTS_DECIMALS))
        const sharePercentage = Math.max(
          Math.min(Number(((liquidity / (Number(totalSupply) + lpTokensForDeposit)) * 100).toFixed(2)), 100),
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
      setLpTokenTotalSupply(undefined)
      setLpTokenTotalSupplyFormatted('-')
      if (!(canonicalToken && hopToken && selectedNetwork && !unsupportedAsset?.chain)) {
        return
      }
      const bridge = sdk.bridge(canonicalToken.symbol)
      const lpToken = bridge.getSaddleLpToken(selectedNetwork.slug)
      const [reserves, lpTokenTotalSupply] = await Promise.all([
        bridge.getSaddleSwapReserves(selectedNetwork.slug),
        lpToken.totalSupply(),
      ])

      if (isSubscribed) {
        setPoolReserves(reserves)
        setLpTokenTotalSupply(lpTokenTotalSupply)
        const lpTokenTotalSupplyFormatted = commafy(Number(formatUnits(lpTokenTotalSupply.toString(), lpDecimals)), 0)
        setLpTokenTotalSupplyFormatted(lpTokenTotalSupplyFormatted)
      }
    }

    update().catch(err => logger.error(err))
    return () => {
      isSubscribed = false
    }
  }, [unsupportedAsset, canonicalToken, hopToken, selectedNetwork])

  useEffect(() => {
    setToken0Deposited(undefined)
    setToken1Deposited(undefined)
    setTokenSumDeposited(undefined)
    setUserPoolBalance(undefined)
    setLoading(true)
  }, [accountAddress, selectedNetwork, selectedBridge, tokenDecimals])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 8 * 1000)
  }, [])

  const updateUserPoolPositions = useCallback(async () => {
    try {
      if (
        !(
          canonicalToken &&
          provider &&
          selectedNetwork?.provider &&
          poolReserves &&
          !unsupportedAsset?.chain &&
          accountAddress
        )
      ) {
        setToken1Rate('')
        setToken0Deposited(undefined)
        setToken1Deposited(undefined)
        setTokenSumDeposited(undefined)
        setTotalSupply('')
        setTotalSupplyBn(BigNumber.from(0))
        setUserPoolTokenPercentage('')
        setStakedBalance(BigNumber.from(0))
        setOverallToken0Deposited(BigNumber.from(0))
        setOverallToken1Deposited(BigNumber.from(0))
        return
      }
      const bridge = sdk.bridge(canonicalToken.symbol)
      const lpToken = bridge.getSaddleLpToken(selectedNetwork.slug)

      const [_totalSupplyBn, balance, reserves] = await Promise.all([
        (await lpToken.getErc20()).totalSupply(),
        lpToken.balanceOf(),
        bridge.getSaddleSwapReserves(selectedNetwork.slug),
      ])
      setUserPoolBalance(balance)

      const [reserve0, reserve1] = reserves
      const formattedTotalSupply = formatUnits(_totalSupplyBn.toString(), lpDecimals)
      setTotalSupply(formattedTotalSupply)
      setTotalSupplyBn(_totalSupplyBn)

      const oneToken = parseUnits('1', lpDecimals)
      const poolPercentage = balance.mul(oneToken).div(_totalSupplyBn).mul(100)
      const formattedPoolPercentage = Number(formatUnits(poolPercentage, lpDecimals)).toFixed(2)
      setUserPoolTokenPercentage(
        formattedPoolPercentage === '0.00' ? '<0.01' : formattedPoolPercentage
      )

      const token0Deposited = balance.mul(reserve0).div(_totalSupplyBn)
      const token1Deposited = balance.mul(reserve1).div(_totalSupplyBn)
      const tokenSumDeposited = token0Deposited.add(token1Deposited)

      setToken0Deposited(token0Deposited)
      setToken1Deposited(token1Deposited)
      setTokenSumDeposited(tokenSumDeposited)
      if (reserve0?.eq(0) && reserve1?.eq(0)) {
        setToken1Rate('0')
      } else {
        const amount0 = formatUnits(reserve1.mul(oneToken).div(reserve0), tokenDecimals)
        setToken1Rate(Number(amount0).toFixed(2))
      }

      let stakedBalance = BigNumber.from(0)
      if (stakingContract) {
        const balance = await stakingContract.balanceOf(accountAddress)
        stakedBalance = stakedBalance.add(balance)
      }
      if (hopStakingContract) {
        const balance = await hopStakingContract.balanceOf(accountAddress)
        stakedBalance = stakedBalance.add(balance)
      }

      const totalLpTokens = balance.add(stakedBalance)
      const _overallToken0Deposited = totalLpTokens.mul(BigNumber.from(poolReserves[0] || 0)).div(_totalSupplyBn)
      const _overallToken1Deposited = totalLpTokens.mul(BigNumber.from(poolReserves[1] || 0)).div(_totalSupplyBn)
      setOverallToken0Deposited(_overallToken0Deposited)
      setOverallToken1Deposited(_overallToken1Deposited)
      setStakedBalance(stakedBalance)
    } catch (err) {
      logger.error(err)
    }
    setLoading(false)
  }, [unsupportedAsset, provider, selectedNetwork, canonicalToken, hopToken, address, accountAddress, stakingContract, hopStakingContract, poolReserves, selectedBridge])

  useEffect(() => {
    updateUserPoolPositions()
  }, [provider, selectedNetwork, canonicalToken, hopToken, updateUserPoolPositions])

  useInterval(updatePrices, 5 * 1000)
  useInterval(updateUserPoolPositions, 5 * 1000)

  async function addLiquidityAndStake() {
    try {
      const networkId = Number(selectedNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected || !selectedNetwork) {
        throw new Error('wrong network connected')
      }

      if (!(Number(token0Amount) || Number(token1Amount))) {
        return
      }

      if (!(canonicalToken && hopToken && accountAddress && lpToken)) {
        return
      }

      const signer = provider?.getSigner()
      if (!signer) {
        return
      }

      setIsDepositing(true)
      setError('')
      const chainSlug = selectedNetwork?.slug
      const bridge = sdk.bridge(tokenSymbol).connect(signer as Signer)
      const amm = bridge.getAmm(chainSlug)
      const saddleSwap = await amm.getSaddleSwap()
      const spender = saddleSwap.address

      const txList:any = []

      if (Number(token0Amount)) {
        txList.push({
          label: `Approve ${canonicalToken.symbol}`,
          fn: async () => {
            const isNetworkConnected = await checkConnectedNetworkId(networkId)
            if (!isNetworkConnected) {
              throw new Error('wrong network connected')
            }

            let token = bridge.getCanonicalToken(chainSlug)
            if (token.isNativeToken) {
              token = token.getWrappedToken()
            }

            const allowance = await token.allowance(spender)
            if (allowance.lt(amountToBN(token0Amount, canonicalToken.decimals))) {
              return token.approve(spender)
            }
          }
        })
      }

      if (Number(token1Amount)) {
        txList.push({
          label: `Approve ${hopToken.symbol}`,
          fn: async () => {
            const isNetworkConnected = await checkConnectedNetworkId(networkId)
            if (!isNetworkConnected) {
              throw new Error('wrong network connected')
            }

            let token = bridge.getL2HopToken(chainSlug)
            if (token.isNativeToken) {
              token = token.getWrappedToken()
            }

            const allowance = await token.allowance(spender)
            if (allowance.lt(amountToBN(token1Amount, hopToken.decimals))) {
              return token.approve(spender)
            }
          }
        })
      }

      const getDepositedLpTokens :any = { fn: async () => {} }

      let depositLabel = 'Deposit'
      if (Number(token0Amount) && Number(token1Amount)) {
        depositLabel = `Deposit ${canonicalToken.symbol} + ${hopToken.symbol}`
      } else if (Number(token0Amount)) {
        depositLabel = `Deposit ${canonicalToken.symbol}`
      } else if (Number(token1Amount)) {
        depositLabel = `Deposit ${hopToken.symbol}`
      }

      txList.push({
        label: depositLabel,
        fn: async () => {
          const isNetworkConnected = await checkConnectedNetworkId(networkId)
          if (!isNetworkConnected) {
            throw new Error('wrong network connected')
          }

          let amount0Desired = amountToBN(token0Amount || '0', canonicalToken?.decimals)
          let amount1Desired = amountToBN(token1Amount || '0', hopToken?.decimals)

          const balance0 = await canonicalToken.balanceOf(accountAddress)
          const balance1 = await hopToken.balanceOf(accountAddress)
          if (amount0Desired.gt(balance0)) {
            amount0Desired = balance0
          }
          if (amount1Desired.gt(balance1)) {
            amount1Desired = balance1
          }

          const minAmount0 = amount0Desired.mul(minBps).div(10000)
          const minAmount1 = amount1Desired.mul(minBps).div(10000)
          const minToMint = await amm.calculateAddLiquidityMinimum(minAmount0, minAmount1)

          const tx = await bridge
            .connect(signer as Signer)
            .addLiquidity(amount0Desired, amount1Desired, selectedNetwork.slug, {
              minToMint,
              deadline: deadline(),
            })

          getDepositedLpTokens.fn = async () => {
            const receipt = await tx.wait()
            let amount = BigNumber.from(0)
            for (const log of receipt.logs) {
              if (log.topics[0].startsWith('0xddf252ad')) {
                amount = BigNumber.from(log.data)
              }
            }
            return amount
          }

          return tx
        }
      })

      await txConfirm?.show({
        kind: 'addLiquidityAndStake',
        inputProps: {
          token0: {
            amount: commafy(token0Amount || '0', 4),
            amountUsd: tokenUsdPrice ? `$${commafy(Number(token0Amount || 0) * tokenUsdPrice)}` : '',
            token: canonicalToken,
          },
          token1: {
            amount: commafy(token1Amount || '0', 4),
            amountUsd: tokenUsdPrice ? `$${commafy(Number(token1Amount || 0) * tokenUsdPrice)}` : '',
            token: hopToken,
          },
          priceImpact: priceImpactFormatted || '-',
          total: depositAmountTotalDisplayFormatted,
          showStakeOption: !!hopStakingContractAddress
        },
        onConfirm: async (opts: any) => {
          const { stake } = opts

          if (stake) {
            txList.push({
              label: `Approve ${lpTokenSymbol}`,
              fn: async () => {
                const isNetworkConnected = await checkConnectedNetworkId(networkId)
                if (!isNetworkConnected) {
                  throw new Error('wrong network connected')
                }

                const amount = await getDepositedLpTokens.fn()
                if (amount.gt(0)) {
                  const allowance = await lpToken.allowance(hopStakingContractAddress)
                  const amount = await getDepositedLpTokens.fn()
                  if (allowance.lt(amount)) {
                    return lpToken.approve(hopStakingContractAddress, constants.MaxUint256)
                  }
                }
              }
            })
            txList.push({
              label: `Stake ${lpTokenSymbol}`,
              fn: async () => {
                const isNetworkConnected = await checkConnectedNetworkId(networkId)
                if (!isNetworkConnected) {
                  throw new Error('wrong network connected')
                }

                if (!hopStakingContract) {
                  return
                }
                const amount = await getDepositedLpTokens.fn()
                if (amount.gt(0)) {
                  return hopStakingContract.connect(signer).stake(amount)
                }
              }
            })
          }

          const _txList = txList.filter((x: any) => x)
          await txConfirm?.show({
            kind: 'txList',
            inputProps: {
              title: 'Add Liquidity',
              txList: _txList
            },
            onConfirm: async () => {
            },
          })
        },
      })
    } catch (err: any) {
      console.error(err)
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err))
      }
    }
    setIsDepositing(false)
  }

  async function unstakeAndRemoveLiquidity (amounts: any) {
    try {
      if (!accountAddress) {
        return
      }
      const networkId = Number(selectedNetwork?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected || !selectedNetwork) {
        throw new Error('wrong network connected')
      }

      if (!(canonicalToken && hopToken)) {
        return
      }

      const signer = provider?.getSigner()
      if (!signer) {
        return
      }

      setIsWithdrawing(true)
      setError('')
      const bridge = sdk.bridge(tokenSymbol)
      const amm = bridge.getAmm(selectedNetwork.slug)
      const lpTokenDecimals = 18

      const lpToken = bridge.getSaddleLpToken(selectedNetwork.slug)
      const { proportional, tokenIndex, amountPercent, amount, priceImpactFormatted, proportionalAmount0, proportionalAmount1 } = amounts
      const saddleSwap = await amm.getSaddleSwap()

      const txList :any = []

      let token0Amount = ''
      let token1Amount = ''
      if (proportional) {
        token0Amount = Number(proportionalAmount0 || 0).toString()
        token1Amount = Number(proportionalAmount1 || 0).toString()
      } else {
        token0Amount = tokenIndex === 0 ? formatUnits(amount, canonicalToken.decimals) : ''
        token1Amount = tokenIndex === 1 ? formatUnits(amount, hopToken.decimals) : ''
      }

      const withdrawAmountTotal = (Number(token0Amount || 0) + Number(token1Amount || 0))
      const withdrawAmountTotalUsd = (tokenUsdPrice && withdrawAmountTotal) ? withdrawAmountTotal * tokenUsdPrice : 0
      const withdrawAmountTotalDisplayFormatted = withdrawAmountTotalUsd ? `$${commafy(withdrawAmountTotalUsd, 2)}` : `${commafy(withdrawAmountTotal, 2)}`

      await txConfirm?.show({
        kind: 'unstakeAndRemoveLiquidity',
        inputProps: {
          token0: {
            amount: commafy(token0Amount || '0', 4),
            amountUsd: tokenUsdPrice ? `$${commafy(Number(token0Amount || 0) * tokenUsdPrice)}` : '',
            token: canonicalToken,
          },
          token1: {
            amount: commafy(token1Amount || '0', 4),
            amountUsd: tokenUsdPrice ? `$${commafy(Number(token1Amount || 0) * tokenUsdPrice)}` : '',
            token: hopToken,
          },
          priceImpact: priceImpactFormatted || '-',
          total: withdrawAmountTotalDisplayFormatted,
          showUnstakeOption: false // !!hopStakingContract
        },
        onConfirm: async (opts: any) => {
          const { unstake } = opts

          if (hopStakingContract) {
            const lpBalanceStaked = await hopStakingContract.balanceOf(accountAddress)
            if (unstake) {
              if (lpBalanceStaked.gt(0)) {
                txList.push({
                  label: `Unstake ${lpTokenSymbol}`,
                  fn: async () => {
                    const isNetworkConnected = await checkConnectedNetworkId(networkId)
                    if (!isNetworkConnected) {
                      throw new Error('wrong network connected')
                    }

                    return hopStakingContract.connect(signer).withdraw(lpBalanceStaked)
                  }
                })
              }
            }
          }

          txList.push({
            label: `Approve ${lpTokenSymbol}`,
            fn: async () => {
              const balance = await lpToken.balanceOf()
              const allowance = await lpToken.allowance(saddleSwap.address)
              if (allowance.lt(balance)) {
                return lpToken.approve(saddleSwap.address, constants.MaxUint256)
              }
            }
          })

          if (proportional) {
            txList.push({
              label: `Withdraw ${lpTokenSymbol}`,
              fn: async () => {
                const isNetworkConnected = await checkConnectedNetworkId(networkId)
                if (!isNetworkConnected) {
                  throw new Error('wrong network connected')
                }

                const balance = await lpToken.balanceOf()
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
              }
            })
          } else {
            txList.push({
              label: `Withdraw ${lpTokenSymbol}`,
              fn: async () => {
                const isNetworkConnected = await checkConnectedNetworkId(networkId)
                if (!isNetworkConnected) {
                  throw new Error('wrong network connected')
                }

                const balance = await lpToken.balanceOf()
                const amount18d = shiftBNDecimals(amount, lpTokenDecimals - tokenDecimals)
                let tokenAmount = await amm.calculateRemoveLiquidityOneToken(amount18d, tokenIndex)
                tokenAmount = shiftBNDecimals(tokenAmount, lpTokenDecimals - tokenDecimals)
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
            })
          }

          const _txList = txList.filter((x: any) => x)
          await txConfirm?.show({
            kind: 'txList',
            inputProps: {
              title: 'Remove Liquidity',
              txList: _txList
            },
            onConfirm: async () => {
            },
          })
        }
      })

    } catch (err: any) {
      console.error(err)
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err))
      }
    }
    setIsWithdrawing(false)
  }

  const calculateRemoveLiquidityPriceImpactFn = (balance: BigNumber) => {
    if (!(canonicalToken && selectedNetwork)) {
      return async () => { }
    }
    const bridge = sdk.bridge(canonicalToken.symbol)
    const amm = bridge.getAmm(selectedNetwork.slug)
    return (amounts: any) => {
      if (!balance) {
        return 0
      }
      return calculateRemoveLiquidityPriceImpact(amounts, balance, amm)
    }
  }

  const calculateRemoveLiquidityPriceImpact = async (amounts: any, balance: BigNumber, amm: any) => {
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

  const { data: hasStaked } = useQuery(
    [
      `usePool:hasStaked:${accountAddress}:${chainSlug}:${tokenSymbol}`,
      accountAddress,
      chainSlug,
      tokenSymbol
    ],
    async () => {
      if (!(accountAddress && chainSlug && tokenSymbol)) {
        return false
      }

      {
        const address = hopStakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]
        if (address) {
          const _provider = sdk.getChainProvider(chainSlug)
          const contract = StakingRewards__factory.connect(address, _provider)
          const stakedBalance = await contract?.balanceOf(accountAddress)
          if (stakedBalance.gt(0)) {
            return true
          }
        }
      }

      {
        const address = stakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]
        if (address) {
          const _provider = sdk.getChainProvider(chainSlug)
          const contract = StakingRewards__factory.connect(address, _provider)
          const stakedBalance = await contract?.balanceOf(accountAddress)
          if (stakedBalance.gt(0)) {
            return true
          }
        }
      }

      return false
    },
    {
      enabled: !!chainSlug,
      refetchInterval: 60 * 1000
    }
  )

  const token0Balance =
    canonicalToken && canonicalBalance
      ? Number(formatUnits(canonicalBalance, tokenDecimals))
      : 0
  const token1Balance =
    hopToken && hopBalance ? Number(formatUnits(hopBalance, tokenDecimals)) : 0

  const enoughBalance =
    (Number(token0Amount) ? token0Balance >= Number(token0Amount) : true) &&
    (Number(token1Amount) ? token1Balance >= Number(token1Amount) : true)
  const validFormFields = !!((token0Amount || token1Amount) && enoughBalance)
  let sendButtonText = 'Add Liquidity'
  if (!enoughBalance) {
    sendButtonText = 'Insufficient funds'
  }

  const _poolStats = getPoolStats(chainSlug, tokenSymbol)
  const tvlFormatted = _poolStats ? _poolStats?.tvlUsdFormatted ?? '' : '-'
  const totalUserBalance = BigNumber.from(userPoolBalance || 0).add(stakedBalance || 0)
  const hasBalance = totalUserBalance.gt(0)
  const canonicalTokenSymbol = canonicalToken?.symbol || ''
  const hopTokenSymbol = hopToken?.symbol || ''
  const reserve0 = toTokenDisplay(poolReserves?.[0], canonicalToken?.decimals)
  const reserve1 = toTokenDisplay(poolReserves?.[1], canonicalToken?.decimals)
  const reserve0Formatted = `${commafy(reserve0, 0) || '-'} ${canonicalTokenSymbol}`
  const reserve1Formatted = `${commafy(reserve1, 0) || '-'} ${hopTokenSymbol}`
  const feeFormatted = `${fee ? Number((fee * 100).toFixed(2)) : '-'}%`
  const apr = _poolStats?.apr ?? 0
  const aprFormatted = toPercentDisplay(apr)
  const totalApr = _poolStats?.totalApr ?? 0
  const totalAprFormatted = _poolStats ? toPercentDisplay(_poolStats?.totalApr) : '-'
  const priceImpactLabel = Number(priceImpact) > 0 ? 'Bonus' : 'Price Impact'
  const priceImpactFormatted = priceImpact ? `${commafy((priceImpact * 100), 2)}%` : '-'
  const poolSharePercentageFormatted = poolSharePercentage ? `${commafy(poolSharePercentage)}%` : ''
  const virtualPriceFormatted = virtualPrice ? `${Number(virtualPrice.toFixed(4))}` : '-'
  const reserveTotalsUsdFormatted = `$${reserveTotalsUsd ? commafy(reserveTotalsUsd, 2) : '-'}`
  const poolName = `${tokenSymbol} ${selectedNetwork?.name} Pool`
  const tokenImageUrl = tokenSymbol ? getTokenImage(tokenSymbol) : ''
  const chainImageUrl = selectedNetwork?.imageUrl ?? ''
  const chainName = selectedNetwork?.name ?? ''
  const userPoolTokenPercentageFormatted = userPoolTokenPercentage ? `${commafy(userPoolTokenPercentage)}%` : ''
  const token0DepositedFormatted = token0Deposited
    ? commafy(Number(formatUnits(token0Deposited, canonicalToken?.decimals)), 5)
    : ''
  const token1DepositedFormatted = token1Deposited
    ? commafy(Number(formatUnits(token1Deposited, tokenDecimals)), 5)
    : ''
  const tokenSumDepositedFormatted = tokenSumDeposited
    ? commafy(Number(formatUnits(tokenSumDeposited, tokenDecimals)), 5)
    : ''
  const userPoolBalanceSum = (hasBalance && userPoolBalance && tokenUsdPrice) ? (Number(formatUnits(token0Deposited || 0, tokenDecimals)) + Number(formatUnits(token1Deposited || 0, tokenDecimals))) : 0
  const userPoolBalanceUsd = tokenUsdPrice ? userPoolBalanceSum * tokenUsdPrice : 0
  const userPoolBalanceUsdFormatted = userPoolBalanceUsd ? `$${commafy(userPoolBalanceUsd, 2)}` : commafy(userPoolBalanceSum, 4)
  const token0BalanceFormatted = commafy(token0Balance, 4)
  const token1BalanceFormatted = commafy(token1Balance, 4)
  const depositAmountTotal = (Number(token0Amount || 0) + Number(token1Amount || 0))
  const depositAmountTotalUsd = (tokenUsdPrice && depositAmountTotal) ? depositAmountTotal * tokenUsdPrice : 0
  const depositAmountTotalDisplayFormatted = depositAmountTotalUsd ? `$${commafy(depositAmountTotalUsd, 2)}` : (depositAmountTotal ? `${commafy(depositAmountTotal, 2)}` : '-')
  const volume = _poolStats?.dailyVolume ?? 0
  const volumeUsd = tokenUsdPrice ? volume * tokenUsdPrice : 0
  const volumeUsdFormatted = volumeUsd ? `$${commafy(volumeUsd, 2)}` : '-'

  let userPoolBalanceFormatted = ''
  if (userPoolBalance) {
    let formattedBalance = formatUnits(userPoolBalance.toString(), lpDecimals)
    formattedBalance = Number(formattedBalance).toFixed(5)
    if (Number(formattedBalance) === 0 && userPoolBalance.gt(0)) {
      formattedBalance = '<0.00001'
    }
    userPoolBalanceFormatted = `${commafy(formattedBalance, 5)}`
  }

  const overallUserLpBalance = (userPoolBalance && stakedBalance) ? userPoolBalance.add(stakedBalance) : BigNumber.from(0)
  let overallUserPoolBalanceFormatted = userPoolBalanceFormatted
  if (userPoolBalance && stakedBalance) {
    let formattedBalance = formatUnits(overallUserLpBalance.toString(), lpDecimals)
    formattedBalance = Number(formattedBalance).toFixed(5)
    if (Number(formattedBalance) === 0 && overallUserLpBalance.gt(0)) {
      formattedBalance = '<0.00001'
    }
    overallUserPoolBalanceFormatted = `${commafy(formattedBalance, 5)}`
  }

  const oneToken = parseUnits('1', lpDecimals)
  const overallPoolPercentage = totalSupplyBn.gt(0) ? overallUserLpBalance.mul(oneToken).div(totalSupplyBn).mul(100) : BigNumber.from(0)
  const formattedOverallPoolPercentage = Number(formatUnits(overallPoolPercentage, lpDecimals)).toFixed(2)
  const overallUserPoolTokenPercentage = formattedOverallPoolPercentage === '0.00' ? '<0.01' : formattedOverallPoolPercentage
  const overallUserPoolTokenPercentageFormatted = overallUserPoolTokenPercentage ? `${commafy(overallUserPoolTokenPercentage)}%` : ''
  const overallToken1DepositedFormatted = overallToken1Deposited
    ? commafy(Number(formatUnits(overallToken1Deposited, tokenDecimals)), 5)
    : ''
  const overallToken0DepositedFormatted = overallToken0Deposited
    ? commafy(Number(formatUnits(overallToken0Deposited, tokenDecimals)), 5)
    : ''
  const overallUserPoolBalanceSum = (hasBalance && overallUserLpBalance && tokenUsdPrice) ? (Number(formatUnits(overallToken0Deposited || 0, tokenDecimals)) + Number(formatUnits(overallToken1Deposited || 0, tokenDecimals))) : 0
  const overallUserPoolBalanceUsd = tokenUsdPrice ? overallUserPoolBalanceSum * tokenUsdPrice : 0
  const overallUserPoolBalanceUsdFormatted = overallUserPoolBalanceUsd ? `$${commafy(overallUserPoolBalanceUsd, 4)}` : commafy(overallUserPoolBalanceSum, 4)
  const hasStakeContract = !!(stakingContract || hopStakingContract)

  const token0BalanceBn = canonicalBalance ?? BigNumber.from(0)
  const token1BalanceBn = hopBalance ?? BigNumber.from(0)

  return (
    <PoolsContext.Provider
      value={{
        addLiquidityAndStake,
        address,
        apr,
        aprFormatted,
        assetWithoutAmm,
        calculateRemoveLiquidityPriceImpactFn,
        canonicalBalance,
        canonicalToken,
        canonicalTokenSymbol,
        chainImageUrl,
        chainName,
        chainSlug,
        depositAmountTotalDisplayFormatted,
        enoughBalance,
        error,
        fee,
        feeFormatted,
        hasBalance,
        hasStakeContract,
        hasStaked: !!hasStaked,
        hopBalance,
        hopToken,
        hopTokenSymbol,
        isDepositing,
        isNativeToken,
        isWithdrawing,
        loading,
        loadingCanonicalBalance,
        loadingHopBalance,
        lpTokenTotalSupply,
        lpTokenTotalSupplyFormatted,
        networks: l2Networks,
        overallToken0DepositedFormatted,
        overallToken1DepositedFormatted,
        overallUserPoolBalanceFormatted,
        overallUserPoolBalanceUsdFormatted,
        overallUserPoolTokenPercentageFormatted,
        poolName,
        poolReserves,
        poolSharePercentage,
        poolSharePercentageFormatted,
        priceImpact,
        priceImpactFormatted,
        priceImpactLabel,
        reserve0,
        reserve0Formatted,
        reserve1,
        reserve1Formatted,
        reserveTotalsUsd,
        reserveTotalsUsdFormatted,
        selectBothNetworks,
        selectedNetwork,
        sendButtonText,
        setError,
        setToken0Amount,
        setToken1Amount,
        setWarning,
        token0Amount,
        token0Balance,
        token0BalanceBn,
        token0BalanceFormatted,
        token0Deposited,
        token0DepositedFormatted,
        token0Price,
        token1Amount,
        token1Balance,
        token1BalanceBn,
        token1BalanceFormatted,
        token1Deposited,
        token1DepositedFormatted,
        token1Price,
        token1Rate,
        tokenDecimals,
        tokenImageUrl,
        tokenSumDeposited,
        tokenSumDepositedFormatted,
        tokenSymbol,
        totalApr,
        totalAprFormatted,
        totalSupply,
        tvlFormatted,
        unstakeAndRemoveLiquidity,
        unsupportedAsset,
        userPoolBalance,
        userPoolBalanceFormatted,
        userPoolBalanceUsd,
        userPoolBalanceUsdFormatted,
        userPoolTokenPercentage,
        userPoolTokenPercentageFormatted,
        validFormFields,
        virtualPrice,
        virtualPriceFormatted,
        volumeUsdFormatted,
        walletConnected,
        warning,
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}

export function usePool() {
  const ctx = useContext(PoolsContext)
  if (ctx === undefined) {
    throw new Error('usePool must be used within PoolsProvider')
  }
  return ctx
}

export default PoolsProvider
