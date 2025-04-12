import { useEffect, useState, useMemo, useRef } from 'react'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { useApp } from '#contexts/AppContext/index.js'
import { BigNumber, providers, utils, Contract, constants } from 'ethers'
import { useV2 } from './useV2.js'
import { Hop, utils as v2Utils  } from '@hop-protocol/v2-sdk'
import { formatError } from '#utils/format.js'
import { commafy } from '#utils/commafy.js'
import { useTokenPrice } from '#hooks/useTokenPrice.js'
import { useV2TransferStatus } from '#hooks/useV2TransferStatus.js'
import { getNetworks } from '#config/networks.js'
import { isMainnet, showRewards } from '#config/index.js'
import {
  useBalance,
  useFeeConversionsV2,
  useEstimateTxCost,
  useTxResult
} from '#hooks/index.js'
import { ChainSlug } from '@hop-protocol/sdk'
import { useFeeRefund } from './useFeeRefund.js'

const { formatUnits, parseUnits } = utils
const { formatUSD } = v2Utils

type V2SendHook = {
  v2Sdk: Hop
  accountAddress: string | null
  amountIn: string | null
  approveReady: boolean
  approveTokens: () => Promise<void>
  sendFee: BigNumber
  sendFeeDisplay: string
  sendFeeUsdDisplay: string
  maxBonderFee: BigNumber
  maxBonderFeeDisplay: string
  maxBonderFeeUsdDisplay: string
  chains: any[]
  error: string
  estimatedReceived: BigNumber
  estimatedReceivedDisplay: string
  estimatedReceivedUsd: number
  estimatedReceivedUsdDisplay: string
  fromChain: any
  fromChainId: string
  fromToken: Token | null
  fromTokenBalance: BigNumber | null
  handleApprove: () => void
  handleFromChainChange: (network: any) => void
  handleRecipientInput: (event: any) => void
  handleSwitchDirection: () => void
  handleToChainChange: (network: any) => void
  handleTokenChange: (event: any) => void
  info: string
  isApproving: boolean
  isLoadingFromTokenBalance: boolean
  isLoadingToTokenBalance: boolean
  isSending: boolean
  needsApproval: boolean
  recipient: string | null
  sendReady: boolean
  sendTokens: () => Promise<void>
  setAmountIn: (amount: string) => void
  setError: (error: string) => void
  setFromChainId: (chainId: string) => void
  setInfo: (info: string) => void
  setRecipient: (recipient: string) => void
  setToChainId: (chainId: string) => void
  setTokenSymbol: (symbol: string) => void
  setSendTx: (tx: providers.TransactionResponse | null) => void
  setWarning: (warning: string) => void
  toChain: any
  toChainId: string
  toToken: Token | null
  toTokenAmount: string
  toTokenBalance: BigNumber | null
  tokenList: string[]
  tokenSymbol: string | null
  totalFeeDisplay: string
  totalFeeUsd: number
  totalFeeUsdDisplay: string
  sendTx: providers.TransactionResponse | null
  warning: string
  initialTokenSymbol: string
  initialFromChainId: string
  initialToChainId: string
  routeChainIds: string[]
  isFetchingGetSendData: boolean
  fromTokenBalanceFormatted: string
  toTokenBalanceFormatted: string
  fromTokenBalanceDisplay: string
  toTokenBalanceDisplay: string
  handleMaxClick: () => void
  fromBalanceUsdDisplay: string
  toBalanceUsdDisplay: string
  isLoadingNeedsApproval: boolean
  hasEnoughBalance: boolean
  parsedAmountIn: string
  transferStatus: any,
  fromTokenDecimals: number,
  setFromTokenDecimals: (decimals: number) => void
  showFeeRefund: boolean
  feeRefundTokenSymbol: string
  feeRefundDisplay: string
}

class Token {
  address: string
  decimals: number
  symbol: string
  contract: Contract

  constructor (contract: Contract) {
    this.contract = contract
    this.address = contract.address
    this.init().catch(console.error)
  }

  async init() {
    this.decimals = await this.contract.decimals()
    this.symbol = await this.contract.symbol()
  }

  async balanceOf (address: string) {
    if (!address) {
      throw new Error('address is required')
    }
    return this.contract.balanceOf(address)
  }
}

export function useV2Send(): V2SendHook {
  const { v2Sdk, getNeedsApprovalForSendTokens: v2GetNeedsApprovalForSendTokens, sendTokens: v2SendTokens, estimateGasCostForSend, approveTokens: v2ApproveTokens, getEstimatedReceived, getSendData, getWillSendTokensFail, getFee, getTokenList, getTokenAddress, getTokenName, getTokenDecimals, getChainsSupportedByToken, networkSlug } = useV2()
  const {
    txConfirm
  } = useApp()
  const networks = useMemo(() => {
    return getNetworks(networkSlug)
  }, [networkSlug])
  const { address, provider } = useWeb3Context()
  const [sendTx, setSendTx] = useState<providers.TransactionResponse | null>(null)
  const [approvalTx, setApprovalTx] = useState<providers.TransactionResponse | null>(null)
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null)
  const [tokenList, setTokenList] = useState<string[]>([])
  const [fromTokenAddress, setFromTokenAddress] = useState<string | null>(null)
  const [fromTokenName, setFromTokenName] = useState<string | null>(null)
  const [fromTokenDecimals, setFromTokenDecimals] = useState<number | null>(null)
  const [toTokenAddress, setToTokenAddress] = useState<string | null>(null)
  const [toTokenName, setToTokenName] = useState<string | null>(null)
  const [toTokenDecimals, setToTokenDecimals] = useState<number | null>(null)
  const [fromChainId, setFromChainId] = useState<string | null>(null)
  const [toChainId, setToChainId] = useState<string | null>(null)
  const [amountIn, setAmountIn] = useState<string | null>(null)
  const [parsedAmountIn, setParsedAmountIn] = useState<string>('0')
  const [parsedMinAmountOut, setParsedMinAmountOut] = useState<string>('0')
  const [recipient, setRecipient] = useState<string | null>(null)
  const [needsApproval, setNeedsApproval] = useState<boolean>(false)
  const [sendReady, setSendReady] = useState<boolean>(false)
  const [approveReady, setApproveReady] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [warning, setWarning] = useState<string>('')
  const [info, setInfo] = useState<string>('')
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [sendFee, setSendFee] = useState<BigNumber | null>(null)
  const [maxBonderFee, setMaxBonderFee] = useState<BigNumber | null>(null)
  const [hasEnoughBalance, setHasEnoughBalance] = useState<boolean>(false)
  const [estimatedReceived, setEstimatedReceived] = useState<BigNumber>(BigNumber.from(0))
  const [routeChainIds, setRouteChainIds] = useState<string[]>([])
  const [isFetchingGetSendData, setIsFetchingGetSendData] = useState<boolean>(false)
  const [isLoadingNeedsApproval, setIsLoadingNeedsApproval] = useState<boolean>(false)
  const accountAddress = address?.toString() ?? null
  const { transferStatus } = useV2TransferStatus({
    // transactionHash: '0xe34021ab6829980086a80b55e771ce0441b67c5c8b48992d06820c535b3222d8',
    transactionHash: '0x0eae01af6c043416ddb96c824bd14258ba9c8fcf28d2e2da42b85703ff9f6c46',
    // transactionHash: sendTx?.hash,
    fromChainId,
    toChainId
  })

  useEffect(() => {
    const list = getTokenList()
    setTokenList(list)
  }, [])

  useEffect(() => {
    try {
      if (amountIn && fromTokenDecimals) {
        setParsedAmountIn(parseUnits(amountIn, fromTokenDecimals).toString())
      } else {
        setParsedAmountIn('0')
      }
    } catch (err) {
      console.error('v2 setParsedAmountIn error', err)
    }
  }, [amountIn, fromTokenDecimals])

  useEffect(() => {
    async function update() {
      if (tokenSymbol && fromChainId) {
        setFromTokenAddress(getTokenAddress(fromChainId, tokenSymbol))
        setFromTokenDecimals(await getTokenDecimals(fromChainId, tokenSymbol))
        setFromTokenName(await getTokenName(fromChainId, tokenSymbol))
      } else {
        setFromTokenAddress(null)
        setFromTokenName(null)
        setFromTokenDecimals(null)
      }
    }

    update().catch(console.error)
  }, [tokenSymbol, fromChainId])

  useEffect(() => {
    async function update() {
      if (tokenSymbol && toChainId) {
        setToTokenAddress(getTokenAddress(toChainId, tokenSymbol))
        setToTokenName(await getTokenName(toChainId, tokenSymbol))
        setToTokenDecimals(await getTokenDecimals(toChainId, tokenSymbol))
      } else {
        setToTokenAddress(null)
        setToTokenName(null)
        setToTokenDecimals(null)
      }
    }

    update().catch(console.error)
  }, [tokenSymbol, toChainId])

  useEffect(() => {
    async function update () {
      if (tokenSymbol && fromChainId && toChainId && parsedAmountIn != '0' && fromTokenAddress && toTokenAddress && accountAddress) {
        try {
          setIsLoadingNeedsApproval(true)
          const needs = await v2GetNeedsApprovalForSendTokens({
            fromChainId,
            fromToken: fromTokenAddress,
            toChainId,
            toToken: toTokenAddress,
            amount: parsedAmountIn
          })
          setNeedsApproval(needs)
        } catch (err) {
          console.error('useV2Send getNeedsApprovalForSendTokens', err)
          // setError(formatError(err.message))
        }
        setIsLoadingNeedsApproval(false)
      } else {
        setNeedsApproval(false)
      }
    }

    update().catch(console.error)
  }, [tokenSymbol, fromChainId, toChainId, parsedAmountIn, isApproving, accountAddress, fromTokenAddress, toTokenAddress])

  async function approveTokens () {
    try {
      if (!fromToken?.symbol) {
        return
      }
      setApprovalTx(null)
      setError('')
      setIsApproving(true)
      const fromChain = networks.find(network => network.networkId?.toString() === fromChainId)

      const tx: any = await txConfirm?.show({
        kind: 'approval',
        inputProps: {
          tagline: `Allow Hop to spend your ${fromToken.symbol} on ${fromChain.name}`,
          amount: fromToken.symbol === 'USDT' ? undefined : amountIn,
          token: fromToken,
          tokenSymbol: fromToken.symbol,
          source: {
            network: {
              slug: fromChain.slug,
              networkId: fromChain.chainId,
            },
          },
        },
        onConfirm: async (approveAll: boolean) => {
          const tx = await v2ApproveTokens({
            fromChainId,
            toChainId,
            fromToken: fromTokenAddress,
            toToken: toTokenAddress,
            amount: approveAll ? constants.MaxUint256.toString() : parsedAmountIn
          })

          setApprovalTx(tx)
          tx.wait()
          .then(() => {
            setIsApproving(false)
          })
          return tx
        },
      })
    } catch (err){
      console.error('useV2Send approveTokens', err)
      const errorMessage = formatError(err.message)
      if (!/cancelled/gi.test(errorMessage)) {
        setError(errorMessage)
      }
      setIsApproving(false)
    }
  }

  async function sendTokens () {
    try {
      setSendTx(null)
      setError('')
      setIsSending(true)

      const fromChain = networks.find(network => network.networkId?.toString() === fromChainId)
      const toChain = networks.find(network => network.networkId?.toString() === toChainId)

      const tx: any = await txConfirm?.show({
        kind: 'send',
        inputProps: {
          isV2: true,
          customRecipient: undefined,
          isGnosisSafeWallet: false,
          source: {
            amount: amountIn,
            token: fromToken,
            network: fromChain,
          },
          dest: {
            network: toChain
          },
          estimatedReceived: formatUnits(estimatedReceived, fromToken.decimals)
        },
        onConfirm: async () => {
          const willFail = await getWillSendTokensFail({
            fromChainId,
            toChainId,
            fromToken: fromTokenAddress,
            toToken: toTokenAddress,
            to: recipient,
            amount: parsedAmountIn,
            minAmountOut: parsedMinAmountOut,
            from: accountAddress
          })

          if (willFail) {
            throw new Error('Transaction will fail. Please the parameters are valid and try again.')
          }

          const tx = await v2SendTokens({
            fromChainId,
            toChainId,
            fromToken: fromTokenAddress,
            toToken: toTokenAddress,
            to: recipient,
            amount: parsedAmountIn,
            minAmountOut: parsedMinAmountOut
          })

          setAmountIn('')

          setSendTx(tx)
        },
      })
    } catch (err) {
      console.error('useV2Send sendTokens', err)
      const errorMessage = formatError(err.message)
      if (!/cancelled/gi.test(errorMessage)) {
        setError(formatError(errorMessage))
      }
    }
    setIsSending(false)
  }

  useEffect(() => {
    setSendReady(!needsApproval && fromChainId && toChainId && tokenSymbol && parsedAmountIn != '0' && hasEnoughBalance && !isFetchingGetSendData && estimatedReceived.gt(0))
  }, [needsApproval, fromChainId, toChainId, tokenSymbol, parsedAmountIn, hasEnoughBalance, isFetchingGetSendData, estimatedReceived])

  useEffect(() => {
    setApproveReady(needsApproval && fromChainId && toChainId && tokenSymbol && parsedAmountIn != '0' && hasEnoughBalance && !isFetchingGetSendData)
  }, [needsApproval, fromChainId, toChainId, tokenSymbol, parsedAmountIn, hasEnoughBalance, isFetchingGetSendData])

  const fromToken = useMemo(() => {
    if (!(fromChainId && fromTokenAddress)) {
      return null
    }
    const contract = v2Sdk?.getTokenContract({ chainId: fromChainId, address: fromTokenAddress })
    return new Token(contract)
  }, [fromChainId, fromTokenAddress, v2Sdk])

  const toToken = useMemo(() => {
    if (!(toChainId && toTokenAddress)) {
      return null
    }
    const contract = v2Sdk?.getTokenContract({ chainId: toChainId, address: toTokenAddress })
    return new Token(contract)
  }, [toChainId, toTokenAddress, v2Sdk])

  const feeToken = useMemo(() => {
    return {
      symbol: 'ETH',
      decimals: 18
    }
  }, [])

  const { balance: fromTokenBalance, loading: isLoadingFromTokenBalance } = useBalance(fromToken as any, accountAddress, fromChainId)
  const { balance: toTokenBalance, loading: isLoadingToTokenBalance } = useBalance(toToken as any, accountAddress, toChainId)

  useEffect(() => {
    async function update() {
      if (fromChainId && toChainId && fromTokenAddress && toTokenAddress) {
        const fee = await getFee({
          fromChainId,
          toChainId,
          fromToken: fromTokenAddress,
          toToken: toTokenAddress
        })
        setSendFee(fee)
      } else {
        setSendFee(null)
      }
    }

    update().catch(console.error)
  }, [fromChainId, toChainId, fromTokenAddress, toTokenAddress])

  const latestRequestId = useRef<number>(0)

  useEffect(() => {
    async function update() {
      try {
        setError('')
        console.log('v2 getSendData', fromChainId, toChainId, fromTokenAddress, toTokenAddress, parsedAmountIn != '0')
        if (fromChainId && toChainId && fromTokenAddress && toTokenAddress && parsedAmountIn != '0') {
          const requestId = ++latestRequestId.current

          console.log('v2 getSendData', {
            fromChainId,
            fromTokenAddress,
            toChainId,
            toTokenAddress,
            amount: parsedAmountIn,
            minAmountOut: parsedMinAmountOut,
            to: recipient
          })

          const data = await getSendData({
            fromChainId,
            fromToken: fromTokenAddress,
            toChainId,
            toToken: toTokenAddress,
            amount: parsedAmountIn,
            minAmountOut: parsedMinAmountOut,
            to: recipient
          })

          // Check if this is still the latest request
          if (requestId !== latestRequestId.current) {
            return
          }

          const sendFee = data.sendFee
          const maxBonderFee = data.maxBonderFee
          const estimated = data.estimatedReceived
          const routeChainIds = data.routeChainIds

          setEstimatedReceived(estimated)
          setRouteChainIds(routeChainIds)
          setSendFee(sendFee)
          setMaxBonderFee(maxBonderFee)
          setIsFetchingGetSendData(false)
        } else {
          setEstimatedReceived(BigNumber.from(0))
          setRouteChainIds([])
          setSendFee(BigNumber.from(0))
          setMaxBonderFee(BigNumber.from(0))
        }
      } catch (err) {
        console.error('v2 getSendData error:', err)
        setIsFetchingGetSendData(false)
        // setError(formatError(err.message))
      }
    }

    update().catch(console.error)
  }, [fromChainId, toChainId, fromTokenAddress, toTokenAddress, parsedAmountIn, parsedMinAmountOut, recipient])

  useEffect(() => {
    async function update() {
      if (isLoadingFromTokenBalance || parsedAmountIn == null || parsedAmountIn === '0') {
        setHasEnoughBalance(false)
        return
      }

      setHasEnoughBalance(fromTokenBalance?.gte(parsedAmountIn))
    }

    update().catch(console.error)
  }, [fromTokenBalance, isLoadingFromTokenBalance, parsedAmountIn])

  const fromChain = networks.find(network => network.networkId?.toString() === fromChainId)
  const toChain = networks.find(network => network.networkId?.toString() === toChainId)
  const chains = getChainsSupportedByToken(tokenSymbol).map(chainId => networks.find(network => network.networkId?.toString() === chainId)).filter(Boolean)

  const initialTokenSymbol = tokenList?.[0]
  const initialFromChainId = networks?.[0].networkId?.toString()
  const initialToChainId = networks?.[1].networkId?.toString()

  const {
    totalBonderFeeDisplay: maxBonderFeeDisplay,
    totalBonderFeeUsdDisplay: maxBonderFeeUsdDisplay,
    totalFeeDisplay,
    totalFeeUsd,
    totalFeeUsdDisplay,
    estimatedReceivedUsd,
    estimatedReceivedUsdDisplay,
    estimatedReceivedDisplay,
    relayFeeEthDisplay: sendFeeDisplay,
    relayFeeUsdDisplay: sendFeeUsdDisplay
  } = useFeeConversionsV2({
    bonderFee: maxBonderFee,
    feeToken,
    destToken: toToken,
    estimatedReceived,
    relayFee: sendFee,
  })

  const toTokenAmount = formatUnits(estimatedReceived, toTokenDecimals)

  function handleTokenChange(event: any) {
    setTokenSymbol(event.target.value)
  }
  function handleFromChainChange(network: any) {
    if (network.networkId?.toString() === toChainId) {
      handleSwitchDirection()
    } else {
      setFromChainId(network.networkId.toString())
    }
  }
  function handleToChainChange(network: any) {
    if (network.networkId?.toString() === fromChainId) {
      handleSwitchDirection()
    } else {
      setToChainId(network.networkId.toString())
    }
  }
  function handleSwitchDirection() {
    setFromChainId(toChainId)
    setToChainId(fromChainId)
  }
  function handleRecipientInput(event: any) {
    setRecipient(event.target.value)
  }
  function handleApprove() {
    approveTokens()
  }
  function handleMaxClick() {
    setAmountIn(formatUnits(fromTokenBalance, fromTokenDecimals))
  }

  const fromTokenBalanceFormatted = fromTokenBalance != null ? formatUnits(fromTokenBalance, fromToken.decimals) : ''
  const toTokenBalanceFormatted = toTokenBalance != null ? formatUnits(toTokenBalance, toToken.decimals) : ''
  const fromTokenBalanceDisplay = fromTokenBalance && tokenSymbol ? `${commafy(fromTokenBalanceFormatted, 5)}` : ''
  const toTokenBalanceDisplay = toTokenBalance && tokenSymbol ? `${commafy(toTokenBalanceFormatted, 5)}` : ''

  const { priceUsd: tokenPriceUsd } = useTokenPrice(tokenSymbol)
  const fromBalanceUsdDisplay = useMemo(() => {
    if ((amountIn !== '' && amountIn != null) && tokenPriceUsd) {
      const value = Number(amountIn) * Number(tokenPriceUsd?.toString())
      return formatUSD(value)
    }
    return ''
  }, [amountIn, tokenPriceUsd])

  const toBalanceUsdDisplay = useMemo(() => {
    if (isFetchingGetSendData) {
      return ''
    }
    if (estimatedReceived?.gt(0)) {
      return estimatedReceivedUsdDisplay
    }

    return ''
  }, [estimatedReceived, estimatedReceivedUsdDisplay, isFetchingGetSendData])

  const fromNetwork = {
    chainId: Number(fromChainId),
    slug: fromChain?.slug
  } as any

  const toNetwork = {
    chainId: Number(toChainId),
    slug: toChain?.slug
  } as any

  const fromTokenAmountBN = BigNumber.from(parsedAmountIn)
  
  async function estimateSend() {
    try {
      const estimatedGasCost = await estimateGasCostForSend({
        fromChainId,
        toChainId,
        fromToken: fromTokenAddress,
        toToken: toTokenAddress,
        to: '0x' + '1'.repeat(40),
        amount: '1',
        minAmountOut: '0'
      })

      console.log('v2 estimatedGasCost', estimatedGasCost)
      return estimatedGasCost
    } catch (err: any) {
      console.warn('v2 estimatedGasCost error:', err)
      return BigNumber.from(0)
    }
  }

  const { data: estimatedGasCost, error: estimatedGasCostError } = useTxResult(
    fromToken as any,
    fromNetwork,
    toNetwork,
    fromTokenAmountBN,
    estimateSend,
    { }
  )

  const { priceUsd: ethPriceUsd } = useTokenPrice('ETH')

  const totalBonderFee = useMemo(() => {
    if (!maxBonderFee || !sendFee || !tokenPriceUsd || !fromTokenDecimals || !ethPriceUsd) {
      return maxBonderFee || BigNumber.from(0)
    }

    try {
      // Convert ETH fee to USD
      const sendFeeUsd = Number(formatUnits(sendFee, 18)) * Number(ethPriceUsd)

      // Convert USD amount to token amount
      const sendFeeInToken = parseUnits(
        (sendFeeUsd / Number(tokenPriceUsd)).toFixed(fromTokenDecimals),
        fromTokenDecimals
      )

      console.log('v2 estimate fees', maxBonderFee.toString(), sendFeeInToken.toString())

      // Add converted fee to bonder fee
      return maxBonderFee.add(sendFeeInToken)
    } catch (err) {
      console.error('Error calculating total bonder fee:', err)
      return maxBonderFee
    }
  }, [maxBonderFee, sendFee, tokenPriceUsd, fromTokenDecimals, ethPriceUsd])
    
  const {
    showFeeRefund,
    feeRefundTokenSymbol,
    feeRefundDisplay,
    feeRefund,
    feeRefundUsd
  } = useFeeRefund({
    fromNetwork,
    toNetwork,
    fromToken,
    fromTokenAmountBN,
    totalBonderFee,
    estimatedGasCost,
    version: 'v2'
  })

  return {
    parsedAmountIn,
    accountAddress,
    amountIn,
    approveReady,
    approveTokens,
    sendFee,
    sendFeeDisplay,
    sendFeeUsdDisplay,
    maxBonderFee,
    maxBonderFeeDisplay,
    maxBonderFeeUsdDisplay,
    chains,
    error,
    estimatedReceived,
    estimatedReceivedDisplay: isFetchingGetSendData ? '' : estimatedReceivedDisplay,
    estimatedReceivedUsd,
    estimatedReceivedUsdDisplay,
    fromChain,
    fromChainId,
    fromToken,
    fromTokenBalance,
    handleApprove,
    handleFromChainChange,
    handleRecipientInput,
    handleSwitchDirection,
    handleToChainChange,
    handleTokenChange,
    info,
    isApproving,
    isLoadingFromTokenBalance,
    isLoadingToTokenBalance,
    isSending,
    needsApproval,
    recipient,
    sendReady,
    sendTokens,
    setAmountIn,
    setError,
    setFromChainId,
    setInfo,
    setRecipient,
    setToChainId,
    setTokenSymbol,
    setSendTx,
    setWarning,
    toChain,
    toChainId,
    toToken,
    toTokenAmount,
    toTokenBalance,
    tokenList,
    tokenSymbol,
    totalFeeUsd,
    totalFeeDisplay,
    totalFeeUsdDisplay,
    sendTx,
    warning,
    v2Sdk,
    initialTokenSymbol,
    initialFromChainId,
    initialToChainId,
    routeChainIds,
    isFetchingGetSendData,
    fromTokenBalanceFormatted,
    toTokenBalanceFormatted,
    fromTokenBalanceDisplay,
    toTokenBalanceDisplay,
    handleMaxClick,
    fromBalanceUsdDisplay,
    toBalanceUsdDisplay,
    isLoadingNeedsApproval,
    hasEnoughBalance,
    transferStatus,
    fromTokenDecimals,
    setFromTokenDecimals,
    showFeeRefund,
    feeRefundTokenSymbol,
    feeRefundDisplay
  }
}
