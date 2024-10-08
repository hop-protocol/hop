import { useEffect, useState, useMemo } from 'react'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { useApp } from '#contexts/AppContext/index.js'
import { BigNumber, providers, utils, Contract, constants } from 'ethers'
import { useV2 } from './useV2.js'
import { Hop } from '@hop-protocol/v2-sdk'
import { formatError } from '#utils/format.js'
import {
  useBalance,
  useFeeConversions,
} from '#hooks/index.js'

const { formatUnits, parseUnits } = utils

type V2SendHook = {
  v2Sdk: Hop
  accountAddress: string | null
  amountIn: string | null
  approveReady: boolean
  approveTokens: () => Promise<void>
  bonderFee: BigNumber
  bonderFeeDisplay: string
  bonderFeeUsdDisplay: string
  chains: any[]
  error: string
  estimatedReceivedDisplay: string
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
  setTx: (tx: providers.TransactionResponse | null) => void
  setWarning: (warning: string) => void
  toChain: any
  toChainId: string
  toToken: Token | null
  toTokenAmount: string
  toTokenBalance: BigNumber | null
  tokenList: string[]
  tokenSymbol: string | null
  totalFeeDisplay: string
  totalFeeUsdDisplay: string
  tx: providers.TransactionResponse | null
  warning: string
  initialTokenSymbol: string
  initialFromChainId: string
  initialToChainId: string
  routeChainIds: string[]
  fetchingGetSendData: boolean
  fromTokenBalanceFormatted: string
  toTokenBalanceFormatted: string
  fromTokenBalanceDisplay: string
  toTokenBalanceDisplay: string
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
    return this.contract.balanceOf(address)
  }
}

export function useV2Send(): V2SendHook {
  const { v2Sdk, getNeedsApprovalForSendTokens: v2GetNeedsApprovalForSendTokens, sendTokens: v2SendTokens, approveTokens: v2ApproveTokens, getEstimatedReceived, getSendData, getWillSendTokensFail, getFee, getTokenList, getTokenAddress, getTokenName, getTokenDecimals, getChainsSupportedByToken } = useV2()
  const {
    networks,
    txConfirm
  } = useApp()
  const { address, provider } = useWeb3Context()
  const [tx, setTx] = useState<providers.TransactionResponse | null>(null)
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
  const [bonderFee, setBonderFee] = useState<BigNumber | null>(null)
  const [hasEnoughBalance, setHasEnoughBalance] = useState<boolean>(false)
  const [estimatedReceived, setEstimatedReceived] = useState<BigNumber>(BigNumber.from(0))
  const [routeChainIds, setRouteChainIds] = useState<string[]>([])
  const [fetchingGetSendData, setFetchingGetSendData] = useState<boolean>(false)

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
      console.error('setParsedAmountIn error', err)
    }
  }, [amountIn, fromTokenDecimals])

  useEffect(() => {
    async function update() {
      if (tokenSymbol && fromChainId) {
        setFromTokenAddress(getTokenAddress(fromChainId, tokenSymbol))
        setFromTokenName(await getTokenName(fromChainId, tokenSymbol))
        setFromTokenDecimals(await getTokenDecimals(fromChainId, tokenSymbol))
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
      if (tokenSymbol && fromChainId && toChainId && parsedAmountIn != '0') {
        try {
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
          setError(formatError(err.message))
        }
      }
    }

    update().catch(console.error)
  }, [tokenSymbol, fromChainId, toChainId, parsedAmountIn])

  async function approveTokens () {
    try {
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
      setError(formatError(err.message))
      setIsApproving(false)
    }
  }

  async function sendTokens () {
    try {
      setTx(null)
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

          setTx(tx)
        },
      })
    } catch (err) {
      console.error('useV2Send sendTokens', err)
      setError(formatError(err.message))
    }
    setIsSending(false)
  }

  useEffect(() => {
    setSendReady(!needsApproval && fromChainId && toChainId && tokenSymbol && parsedAmountIn != '0' && hasEnoughBalance && !fetchingGetSendData)
  }, [needsApproval, fromChainId, toChainId, tokenSymbol, parsedAmountIn, hasEnoughBalance, fetchingGetSendData])

  useEffect(() => {
    setApproveReady(needsApproval && fromChainId && toChainId && tokenSymbol && parsedAmountIn != '0' && hasEnoughBalance && !fetchingGetSendData)
  }, [needsApproval, fromChainId, toChainId, tokenSymbol, parsedAmountIn, hasEnoughBalance, fetchingGetSendData])

  const accountAddress = address?.toString() ?? null

  const fromToken = useMemo(() => {
    if (!(fromChainId && fromTokenAddress)) {
      return null
    }
    const contract = v2Sdk?.getTokenContract({ chainId: fromChainId, address: fromTokenAddress })
    return new Token(contract)
  }, [fromChainId, fromTokenAddress])

  const toToken = useMemo(() => {
    if (!(toChainId && toTokenAddress)) {
      return null
    }
    const contract = v2Sdk?.getTokenContract({ chainId: toChainId, address: toTokenAddress })
    return new Token(contract)
  }, [toChainId, toTokenAddress])

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
        setBonderFee(fee)
      } else {
        setBonderFee(null)
      }
    }

    update().catch(console.error)
  }, [fromChainId, toChainId, fromTokenAddress, toTokenAddress])

  useEffect(() => {
    async function update() {
      try {
        if (fromChainId && toChainId && fromTokenAddress && toTokenAddress && parsedAmountIn != '0') {
          setFetchingGetSendData(true)
          const data = await getSendData({
            fromChainId,
            fromToken: fromTokenAddress,
            toChainId,
            toToken: toTokenAddress,
            amount: parsedAmountIn,
            minAmountOut: parsedMinAmountOut,
            to: recipient
          })

          const bonderFee = data.bonderFee
          const estimated = data.estimatedReceived
          const routeChainIds = data.routeChainIds

          setEstimatedReceived(estimated)
          setRouteChainIds(routeChainIds)
          setBonderFee(bonderFee)
          setFetchingGetSendData(false)
        } else {
          setEstimatedReceived(BigNumber.from(0))
          setRouteChainIds([])
          setBonderFee(BigNumber.from(0))
        }
      } catch (err) {
        setFetchingGetSendData(false)
      }
    }

    update().catch(console.error)
  }, [fromChainId, toChainId, fromTokenAddress, toTokenAddress, parsedAmountIn])

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
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    totalFeeDisplay,
    totalFeeUsdDisplay,
    estimatedReceivedUsdDisplay,
    estimatedReceivedDisplay
  } = useFeeConversions({
    bonderFee: bonderFee,
    feeToken,
    destToken: toToken,
    estimatedReceived,
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

  const fromTokenBalanceFormatted = fromTokenBalance ? formatUnits(fromTokenBalance, fromToken.decimals) : '-'
  const toTokenBalanceFormatted = toTokenBalance ? formatUnits(toTokenBalance, toToken.decimals) : '-'
  const fromTokenBalanceDisplay = fromTokenBalance && tokenSymbol ? `${fromTokenBalanceFormatted} ${tokenSymbol ?? ''}` : '-'
  const toTokenBalanceDisplay = toTokenBalance && tokenSymbol ? `${toTokenBalanceFormatted} ${tokenSymbol ?? ''}` : '-'

  return {
    accountAddress,
    amountIn,
    approveReady,
    approveTokens,
    bonderFee,
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    chains,
    error,
    estimatedReceivedDisplay,
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
    setTx,
    setWarning,
    toChain,
    toChainId,
    toToken,
    toTokenAmount,
    toTokenBalance,
    tokenList,
    tokenSymbol,
    totalFeeDisplay,
    totalFeeUsdDisplay,
    tx,
    warning,
    v2Sdk,
    initialTokenSymbol,
    initialFromChainId,
    initialToChainId,
    routeChainIds,
    fetchingGetSendData,
    fromTokenBalanceFormatted,
    toTokenBalanceFormatted,
    fromTokenBalanceDisplay,
    toTokenBalanceDisplay,
  }
}
