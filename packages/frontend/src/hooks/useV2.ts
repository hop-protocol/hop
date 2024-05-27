import React, { useEffect, useState } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { reactAppNetwork } from '../config/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { providers } from 'ethers'

type ApproveTokensInput = {
  fromChainId: string
  toChainId: string
  fromToken: string
  toToken: string
  amount: string
}

type SendTokensInput = {
  fromChainId: string
  toChainId: string
  fromToken: string
  toToken: string
  to: string
  amount: string
  minAmountOut: string
}

type V2Hook = {
  v2Sdk: Hop | null
  sendTokens: (input: SendTokensInput) => Promise<providers.TransactionResponse>
  getNeedsApprovalForSendTokens: (input: ApproveTokensInput) => Promise<boolean>
  approveTokens: (input: ApproveTokensInput) => Promise<providers.TransactionResponse>
  getTokenAddress: (chainId: string, tokenSymbol: string) => string
  getTokenList: (fromChainId: string) => string[]
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
  const { address, provider } = useWeb3Context()
  const [v2Sdk, setV2Sdk] = useState<Hop | undefined>()

  useEffect(() => {
    const hop = new Hop({
      network: reactAppNetwork,
      signer: provider?.getSigner(),
    })
    setV2Sdk(hop)
  }, [address, provider])

  function getTokenList (fromChainId?: string) {
    let list : Set<string> = new Set<string>([])

    if (!fromChainId) {
      for (const chainId in tokenListByChain[reactAppNetwork]) {
        for (const token in tokenListByChain[reactAppNetwork][chainId]) {
          list.add(token)
        }
      }
    } else {
      for (const token in tokenListByChain[reactAppNetwork][fromChainId]) {
        list.add(token)
      }
    }

    return Array.from(list)
  }

  function getTokenAddress (chainId: string, tokenSymbol: string): string {
    return tokenListByChain[reactAppNetwork][chainId][tokenSymbol]
  }

  async function getNeedsApprovalForSendTokens (input: ApproveTokensInput): Promise<boolean> {
    if (!v2Sdk) {
      throw new Error('Hop SDK not initialized')
    }

    if (!address) {
      throw new Error('Account is not connected')
    }

    const {
      fromChainId,
      fromToken,
      toChainId,
      toToken,
      amount
    } = input

    const needs = await v2Sdk.getNeedsApprovalForSendTokens({
      fromChainId,
      fromToken,
      toChainId,
      toToken,
      amount
    })

    return needs
  }

  async function approveTokens (input: ApproveTokensInput): Promise<providers.TransactionResponse> {
    if (!v2Sdk) {
      throw new Error('Hop SDK not initialized')
    }

    if (!address) {
      throw new Error('Account is not connected')
    }

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

    return tx
  }

  async function sendTokens (input: SendTokensInput): Promise<providers.TransactionResponse> {
    if (!v2Sdk) {
      throw new Error('Hop SDK not initialized')
    }

    if (!address) {
      throw new Error('Account is not connected')
    }

    const {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      to,
      amount,
      minAmountOut
    } = input

    const needsApproval = await getNeedsApprovalForSendTokens({
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

    return tx
  }

  return {
    v2Sdk,
    sendTokens,
    approveTokens,
    getNeedsApprovalForSendTokens,
    getTokenAddress,
    getTokenList
  }
}
