import React, { useEffect, useState, useMemo } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { reactAppNetwork } from '../config/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { providers, utils } from 'ethers'
import { useV2 } from './useV2.js'
import { formatError } from '#utils/format.js'

const { parseUnits } = utils

type V2SendHook = {
  tx: providers.TransactionRequest | null
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
}

export function useV2Send(): V2SendHook {
  const { v2Sdk, getNeedsApprovalForSendTokens: v2GetNeedsApprovalForSendTokens, sendTokens: v2SendTokens, approveTokens: v2ApproveTokens, getTokenList, getTokenAddress } = useV2()
  const { provider } = useWeb3Context()
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
  }

  async function sendTokens () {
    try {
      setTx(null)

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
  }

  useEffect(() => {
    setSendReady(!needsApproval && fromChainId && toChainId && tokenSymbol && parsedAmountIn != '0')
  }, [needsApproval, fromChainId, toChainId, tokenSymbol, parsedAmountIn])

  return {
    tx,
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
  }
}
