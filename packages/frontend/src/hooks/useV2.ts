import { useMemo } from 'react'
import { Hop, Token } from '@hop-protocol/v2-sdk'
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
  getTokenList: (fromChainId?: string) => string[]
  getTokenDecimals: (chainId: string, tokenSymbol: string) => Promise<number>
  getTokenName: (chainId: string, tokenSymbol: string) => Promise<string>
  getTokenInfoByTokenSymbol: (chainId: string, tokenSymbol: string) => Promise<Token>
  getTokenInfoByTokenAddress: (chainId: string, address: string) => Promise<Token>
  sendTokens: (input: SendTokensInput) => Promise<providers.TransactionResponse>
  getWillSendTokensFail: (input: GetWillSendTokensFailInput) => Promise<boolean>
  getEstimatedReceived: (input: SendTokensInput) => Promise<any>
  getSendData: (input: GetSendDataInput) => Promise<any>
  v2Sdk: Hop | null
}

export function useV2(): V2Hook {
  const { address, provider } = useWeb3Context()

  const v2Sdk = useMemo(() => {
    const hop = new Hop({
      chainProviders: Hop.getDefaultChainRpcProviders(reactAppNetwork),
      signer: provider?.getSigner(),
    })
    return hop
  }, [address, provider])

  function getTokenList (fromChainId?: string) {
    if (fromChainId) {
      return v2Sdk.getSupportedTokenSymbolsByChainId(fromChainId)
    } else {
      return v2Sdk.getSupportedTokenSymbols()
    }
  }

  function getTokenAddress (chainId: string, tokenSymbol: string): string {
    const address = v2Sdk.getTokenAddressByTokenSymbol(chainId, tokenSymbol)
    return address
  }

  async function getTokenInfoByTokenAddress (chainId: string, address: string): Promise<Token> {
    const tokenInfo = await v2Sdk.railsGateway.getTokenInfo({ chainId, address })
    return tokenInfo
  }

  async function getTokenInfoByTokenSymbol (chainId: string, tokenSymbol: string): Promise<Token> {
    const address = getTokenAddress(chainId, tokenSymbol)
    const tokenInfo = await v2Sdk.railsGateway.getTokenInfo({ chainId, address })
    return tokenInfo
  }

  async function getTokenDecimals (chainId: string, tokenSymbol: string): Promise<number> {
    const tokenInfo = await getTokenInfoByTokenSymbol(chainId, tokenSymbol)
    return tokenInfo.decimals
  }

  async function getTokenName (chainId: string, tokenSymbol: string): Promise<string> {
    const tokenInfo = await getTokenInfoByTokenSymbol(chainId, tokenSymbol)
    return tokenInfo.name
  }

  function getChainsSupportedByToken (tokenSymbol: string): string[] {
    return v2Sdk.getChainIdsSupportedByTokenSymbol(tokenSymbol)
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
    getTokenInfoByTokenSymbol,
    getTokenInfoByTokenAddress,
    getWillSendTokensFail,
    getEstimatedReceived,
    getSendData,
    v2Sdk,
  }
}
