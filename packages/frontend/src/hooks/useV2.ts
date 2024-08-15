import { useEffect, useState } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { reactAppNetwork } from '../config/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { BigNumber, providers } from 'ethers'

type ApproveTokensInput = {
  amount: string
  fromChainId: string
  fromToken: string
  toChainId: string
  toToken: string
}

type SendTokensInput = {
  amount: string
  fromChainId: string
  fromToken: string
  minAmountOut: string
  to: string
  toChainId: string
  toToken: string
}

type GetSendDataInput = {
  amount: string
  fromChainId: string
  fromToken: string
  minAmountOut: string
  to: string
  toChainId: string
  toToken: string
}

type GetWillSendTokensFailInput = {
  amount: string
  fromChainId: string
  fromToken: string
  minAmountOut: string
  to: string
  toChainId: string
  toToken: string
  from: string
}

type GetFeeInput = {
  fromChainId: string
  fromToken: string
  toChainId: string
  toToken: string
}

type V2Hook = {
  approveTokens: (input: ApproveTokensInput) => Promise<providers.TransactionResponse>
  getChainsSupportedByToken: (tokenSymbol: string) => string[]
  getFee: (input: GetFeeInput) => Promise<BigNumber>
  getNeedsApprovalForSendTokens: (input: ApproveTokensInput) => Promise<boolean>
  getTokenAddress: (chainId: string, tokenSymbol: string) => string
  getTokenDecimals: (chainId: string, tokenSymbol: string) => number
  getTokenList: (fromChainId?: string) => string[]
  getTokenName: (chainId: string, tokenSymbol: string) => string
  sendTokens: (input: SendTokensInput) => Promise<providers.TransactionResponse>
  getWillSendTokensFail: (input: GetWillSendTokensFailInput) => Promise<boolean>
  getEstimatedReceived: (input: SendTokensInput) => Promise<any>
  getSendData: (input: GetSendDataInput) => Promise<any>
  v2Sdk: Hop | null
}

// TODO: pull from a token list
const tokenListByChain = {
  sepolia: {
    '11155111': {
      MOCK: {
        address: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
        name: 'Mock Token',
        decimals: 18
      },
      USDC: {
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        name: 'USD Coin',
        decimals: 6
      }
    },
    '11155420': {
      MOCK: {
        address: '0xaCa72C8D5360dC237001cD963566F411732980B0',
        name: 'Mock Token',
        decimals: 18
      },
      USDC: {
        address: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
        name: 'USD Coin',
        decimals: 6
      }
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
    const list : Set<string> = new Set<string>([])

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
    return tokenListByChain[reactAppNetwork][chainId][tokenSymbol].address
  }

  function getTokenDecimals (chainId: string, tokenSymbol: string): number {
    return tokenListByChain[reactAppNetwork][chainId][tokenSymbol].decimals
  }

  function getTokenName (chainId: string, tokenSymbol: string): string {
    return tokenListByChain[reactAppNetwork][chainId][tokenSymbol].name
  }

  function getChainsSupportedByToken (tokenSymbol: string): string[] {
    const chains = Object.keys(tokenListByChain[reactAppNetwork] ?? {})
    const supportedChains = chains.filter(chainId => {
      return tokenListByChain[reactAppNetwork][chainId][tokenSymbol]
    })

    return supportedChains
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

  async function getWillSendTokensFail (input: GetWillSendTokensFailInput): Promise<boolean> {
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
      minAmountOut,
      from
    } = input

    const willFail = await v2Sdk.getWillSendTokensFail({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      to,
      amount,
      minAmountOut,
      from
    })

    return willFail
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

  async function getEstimatedReceived (input: SendTokensInput): Promise<any> {
    const {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      minAmountOut
    } = input

    const estimated = await v2Sdk.getEstimatedReceived({
      fromChainId,
      fromToken,
      toChainId,
      toToken,
      amount,
      minAmountOut
    })

    return estimated
  }

  async function getSendData (input: GetSendDataInput): Promise<any> {
    const {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      minAmountOut
    } = input

    const data = await v2Sdk.getSendData({
      fromChainId,
      fromToken,
      toChainId,
      toToken,
      amount,
      minAmountOut
    })

    return data
  }

  async function getFee (input: GetFeeInput): Promise<BigNumber> {
    if (!v2Sdk) {
      throw new Error('Hop SDK not initialized')
    }

    const {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
    } = input

    const fee = await v2Sdk.getSendFee({
      fromChainId,
      fromToken,
      toChainId,
      toToken
    })

    return fee
  }

  return {
    approveTokens,
    getChainsSupportedByToken,
    getFee,
    getNeedsApprovalForSendTokens,
    getTokenAddress,
    getTokenDecimals,
    getTokenList,
    getTokenName,
    sendTokens,
    getWillSendTokensFail,
    getEstimatedReceived,
    getSendData,
    v2Sdk,
  }
}
