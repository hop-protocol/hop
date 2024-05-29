import React, { useEffect, useState, useMemo } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { reactAppNetwork } from '../config/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { BigNumber, providers, utils } from 'ethers'
import { useV2 } from './useV2.js'
import { formatError } from '#utils/format.js'
import {
  GnosisSafeWarning,
  useApprove,
  useAssets,
  useAsyncMemo,
  useBalance,
  useDisableTxs,
  useEstimateTxCost,
  useFeeConversions,
  useGnosisSafeTransaction,
  useNeedsTokenForFee,
  useQueryParams,
  useSufficientBalance,
  useTxResult
} from '#hooks/index.js'

const { parseUnits } = utils

type V2SendHook = {
  accountAddress: string | null
  tx: providers.TransactionRequest | null
  setTx: (tx: providers.TransactionRequest | null) => void
  sendTokens: () => Promise<void>
  sendReady: boolean
  needsApproval: boolean
  approveTokens: () => Promise<void>
  tokenList: string[]
  fromChainId: string
  setFromChainId: (chainId: string) => void
  toChainId: string
  setToChainId: (chainId: string) => void
  tokenSymbol: string | null
  setTokenSymbol: (symbol: string) => void
  amountIn: string | null
  setAmountIn: (amount: string) => void
  recipient: string | null
  setRecipient: (recipient: string) => void
  error: string
  setError: (error: string) => void
  info: string
  setInfo: (info: string) => void
  warning: string
  setWarning: (warning: string) => void
  isApproving: boolean
  isSending: boolean
  fromTokenBalance: BigNumber | null
  toTokenBalance: BigNumber | null
  isLoadingFromTokenBalance: boolean
  isLoadingToTokenBalance: boolean
}

export function useV2Send(): V2SendHook {
  const { v2Sdk, getNeedsApprovalForSendTokens: v2GetNeedsApprovalForSendTokens, sendTokens: v2SendTokens, approveTokens: v2ApproveTokens, getTokenList, getTokenAddress } = useV2()
  const { address, provider } = useWeb3Context()
  const [tx, setTx] = useState<providers.TransactionResponse | null>(null)
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null)
  const [tokenList, setTokenList] = useState<string[]>([])
  const [fromTokenAddress, setFromTokenAddress] = useState<string | null>(null)
  const [toTokenAddress, setToTokenAddress] = useState<string | null>(null)
  const [fromChainId, setFromChainId] = useState<string | null>(null)
  const [toChainId, setToChainId] = useState<string | null>(null)
  const [amountIn, setAmountIn] = useState<string | null>(null)
  const [parsedAmountIn, setParsedAmountIn] = useState<string>('0')
  const [parsedMinAmountOut, setParsedMinAmountOut] = useState<string>('0')
  const [recipient, setRecipient] = useState<string | null>(null)
  const [needsApproval, setNeedsApproval] = useState<boolean>(false)
  const [sendReady, setSendReady] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [warning, setWarning] = useState<string>('')
  const [info, setInfo] = useState<string>('')
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)

  useEffect(() => {
    const list = getTokenList()
    setTokenList(list)
  }, [])

  useEffect(() => {
    if (amountIn) {
      const tokenDecimals = 18 // TODO
      setParsedAmountIn(parseUnits(amountIn, tokenDecimals).toString())
    } else {
      setParsedAmountIn('0')
    }
  }, [amountIn])

  useEffect(() => {
    if (tokenSymbol && fromChainId) {
      setFromTokenAddress(getTokenAddress(fromChainId, tokenSymbol))
    } else {
      setFromTokenAddress(null)
    }
  }, [tokenSymbol, fromChainId])

  useEffect(() => {
    if (tokenSymbol && toChainId) {
      setToTokenAddress(getTokenAddress(toChainId, tokenSymbol))
    } else {
      setToTokenAddress(null)
    }
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
      setTx(null)
      setError('')
      setIsApproving(true)

      const tx = await v2ApproveTokens({
        fromChainId,
        toChainId,
        fromToken: fromTokenAddress,
        toToken: toTokenAddress,
        amount: parsedAmountIn
      })

      setTx(tx)
    } catch (err) {
      console.error('useV2Send approveTokens', err)
      setError(formatError(err.message))
    }
    setIsApproving(false)
  }

  async function sendTokens () {
    try {
      setTx(null)
      setError('')
      setIsSending(true)

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
    } catch (err) {
      console.error('useV2Send sendTokens', err)
      setError(formatError(err.message))
    }
    setIsSending(false)
  }

  useEffect(() => {
    setSendReady(!needsApproval && fromChainId && toChainId && tokenSymbol && parsedAmountIn != '0')
  }, [needsApproval, fromChainId, toChainId, tokenSymbol, parsedAmountIn])

  const accountAddress = address?.toString() ?? null

  const fromToken = useMemo(() => {
    if (!(fromChainId && fromTokenAddress)) {
      return null
    }
    console.log('here00', fromChainId, fromTokenAddress)
    return v2Sdk?.railsGateway.getTokenContract({ chainId: fromChainId, address: fromTokenAddress })
  }, [fromChainId, fromTokenAddress])

  const toToken = useMemo(() => {
    if (!(toChainId && toTokenAddress)) {
      return null
    }
    return v2Sdk?.railsGateway.getTokenContract({ chainId: toChainId, address: toTokenAddress })
  }, [toChainId, toTokenAddress])

  // Get token balances for both networks
  const { balance: fromTokenBalance, loading: isLoadingFromTokenBalance } = useBalance(fromToken, accountAddress, fromChainId)
  const { balance: toTokenBalance, loading: isLoadingToTokenBalance } = useBalance(toToken, accountAddress, toChainId)

  return {
    accountAddress,
    tx,
    setTx,
    sendTokens,
    sendReady,
    needsApproval,
    approveTokens,
    fromChainId,
    setFromChainId,
    toChainId,
    setToChainId,
    tokenList,
    tokenSymbol,
    setTokenSymbol,
    amountIn,
    setAmountIn,
    recipient,
    setRecipient,
    error,
    setError,
    warning,
    setWarning,
    info,
    setInfo,
    isApproving,
    isSending,
    fromTokenBalance,
    toTokenBalance,
    isLoadingFromTokenBalance,
    isLoadingToTokenBalance
  }
}
