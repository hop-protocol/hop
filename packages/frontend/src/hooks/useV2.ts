import React, { useEffect, useState, useMemo } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { reactAppNetwork } from '../config/index.js'
import { useWeb3Context } from '#contexts/Web3Context'
import { providers } from 'ethers'

type SendTokensInput = {
  fromChainId: string
  toChainId: string
  fromToken: string
  toToken: string
  to: string
  amount: string
  minAmountOut: string
}

type ApproveTokensInput = {
  fromChainId: string
  toChainId: string
  fromToken: string
  toToken: string
  amount: string
}

type V2Hook = {
  v2Sdk: Hop | null
  tx: providers.TransactionRequest | null
  sendTokens: (input: SendTokensInput) => Promise<void>
  approveTokens: (input: ApproveTokensInput) => Promise<void>
  tokenList: string[]
  getTokenAddress: (chainId: string, tokenSymbol: string) => string
  fromChainId: string
  setFromChainId: (chainId: string) => void
  toChainId: string
  setToChainId: (chainId: string) => void
}

// TODO: pull from a token list
const tokenListByChain = {
  sepolia: {
    '11155111': {
      MOCK: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
      USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    },
    '11155420': {
      MOCK: '0xaCa72C8D5360dC237001cD963566F411732980B0',
      USDC: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7'
    }
  }
}

export function useV2(): V2Hook {
  const { account, provider } = useWeb3Context()
  const [v2Sdk, setV2Sdk] = useState<Hop | undefined>()
  const [tx, setTx] = useState<providers.TransactionRequest | null>(null)
  const [fromChainId, setFromChainId] = useState<string>(Object.keys(tokenListByChain[reactAppNetwork])[0])
  const [toChainId, setToChainId] = useState<string>(Object.keys(tokenListByChain[reactAppNetwork])[1])
  const tokenList = useMemo(() => {
    return Object.keys(tokenListByChain[reactAppNetwork][fromChainId]).sort()
  }, [fromChainId])

  function getTokenAddress (chainId: string, tokenSymbol: string) {
    return tokenListByChain[reactAppNetwork][chainId][tokenSymbol]
  }

  async function approveTokens (input: ApproveTokensInput) {
    if (!v2Sdk) {
      throw new Error('Hop SDK not initialized')
    }

    setTx(null)

    const {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount
    } = input

    const tx = await v2Sdk.approveSendTokens({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount
    })

    setTx(tx)
  }

  async function sendTokens (input: SendTokensInput) {
    if (!v2Sdk) {
      throw new Error('Hop SDK not initialized')
    }

    setTx(null)

    const {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      to,
      amount,
      minAmountOut
    } = input

    const needsApproval = await v2Sdk.getNeedsApprovalForSendTokens({
      fromChainId,
      fromToken,
      toChainId,
      toToken,
      amount
    })

    if (needsApproval) {
      throw new Error('Needs token approval')
    }

    const tx = await v2Sdk.sendTokens({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      to,
      amount,
      minAmountOut
    })

    setTx(tx)
  }

  useEffect(() => {
    const hop = new Hop({
      network: reactAppNetwork,
      signer: provider?.getSigner(),
    })
    setV2Sdk(hop)
  }, [account, provider])

  return {
    v2Sdk,
    tx,
    sendTokens,
    approveTokens,
    tokenList,
    getTokenAddress,
    fromChainId,
    setFromChainId,
    toChainId,
    setToChainId
  }
}
