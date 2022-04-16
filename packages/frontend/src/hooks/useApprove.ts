import { BigNumber, BigNumberish, constants } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { Token, Chain, HopBridge } from '@hop-protocol/sdk'
import Transaction from 'src/models/Transaction'
import { amountToBN, toTokenDisplay } from 'src/utils'
import { useTransactionReplacement } from './useTransactionReplacement'
import { useQuery } from 'react-query'
import Network from 'src/models/Network'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { useState } from 'react'
import logger from 'src/logger'

async function getSpender(network: Network, bridge: HopBridge) {
  if (network.isLayer1) {
    const l1Bridge = await bridge.getL1Bridge()
    return l1Bridge.address
  }

  const ammWrapper = await bridge.getAmmWrapper(network.slug)
  return ammWrapper.address
}

async function getTokenAllowance(token: Token, spender: string, address?: string) {
  const allowed = await token.allowance(spender, address)
  return allowed
}

const useApprove = (token?: Token, sourceNetwork?: Network, amountOut?: BigNumber) => {
  const { provider, address } = useWeb3Context()
  const { txConfirm, sdk } = useApp()
  const { waitForTransaction, addTransaction } = useTransactionReplacement()
  const [tokenAllowance, setTokenAllowance] = useState<BigNumber>()

  const { data: needsApproval } = useQuery(
    [
      `needsApproval:${token?.symbol}:${sourceNetwork?.slug}:${amountOut?.toString()}`,
      token?.symbol,
      sourceNetwork?.slug,
      amountOut?.toString(),
    ],
    async () => {
      if (!(token && sdk && sourceNetwork && amountOut)) {
        return false
      }

      try {
        const bridge = sdk.bridge(token.symbol)

        const parsedAmount = amountToBN(amountOut.toString(), token.decimals)
        if (token.isNativeToken) {
          return false
        }

        const spender = await getSpender(sourceNetwork, bridge)
        return checkApproval(parsedAmount, token, spender)

        // const spender = bridge.getSendApprovalAddress(sourceNetwork.slug, false)

        // const ta = await getTokenAllowance(token, spender, address?.address)
        // setTokenAllowance(ta)
        // return ta.lte(parsedAmount)
      } catch (error) {
        logger.error(error)
        return false
      }
    },
    {
      enabled: !!token?.symbol && !!sourceNetwork?.slug && !!amountOut?.toString(),
      refetchInterval: 10e3,
    }
  )

  const checkApproval = async (amount: BigNumber, token: Token, spender: string) => {
    try {
      const signer = provider?.getSigner()
      if (!signer) {
        throw new Error('Wallet not connected')
      }

      if (token.isNativeToken) {
        return false
      }

      const approved = await token.allowance(spender)
      if (approved.gte(amount)) {
        return false
      }

      return true
    } catch (err: any) {
      return false
    }
  }

  const approve = async (amount: BigNumber, token: Token, spender: string) => {
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Wallet not connected')
    }

    if (token.isNativeToken) {
      return
    }

    const approved = await token.allowance(spender)
    if (approved.gte(amount)) {
      return
    }

    const formattedAmount = toTokenDisplay(amount, token.decimals)
    const chain = Chain.fromSlug(token.chain.slug)
    const tx = await txConfirm?.show({
      kind: 'approval',
      inputProps: {
        tagline: `Allow Hop to spend your ${token.symbol} on ${chain.name}`,
        amount: token.symbol === 'USDT' ? undefined : formattedAmount,
        token,
        tokenSymbol: token.symbol,
        source: {
          network: {
            slug: token.chain?.slug,
            networkId: token.chain?.chainId,
          },
        },
      },
      onConfirm: async (approveAll: boolean) => {
        const approveAmount = approveAll ? constants.MaxUint256 : amount
        return token.approve(spender, approveAmount)
      },
    })

    if (tx?.hash) {
      addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: token.chain.slug,
          token,
        })
      )

      const res = await waitForTransaction(tx, { networkName: token.chain.slug, token })
      if (res && 'replacementTx' in res) {
        return res.replacementTx
      }
    }

    return tx
  }

  return { approve, checkApproval, needsApproval, tokenAllowance }
}

export default useApprove
