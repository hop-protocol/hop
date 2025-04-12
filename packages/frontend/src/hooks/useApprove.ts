import Transaction from '#models/Transaction.js'
import { BigNumber, constants } from 'ethers'
import { ChainSlug, NetworkSlug, Token, getChain } from '@hop-protocol/sdk'
import { toTokenDisplay } from '#utils/index.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useTransactionReplacement } from '#hooks/useTransactionReplacement.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { reactAppNetwork } from '#config/index.js'
import { useQuery } from 'react-query'
import { useMemo, useCallback } from 'react'

// Constants
const REFETCH_INTERVAL = 15 * 1000 // 15 seconds
const STALE_TIME = 5 * 1000 // 5 seconds
const CACHE_TIME = 30 * 1000 // 30 seconds
const MAX_RETRIES = 2
const DEFAULT_GAS_LIMIT = BigNumber.from(200e3)
const DEFAULT_GAS_PRICE = BigNumber.from(1e9)

interface ApprovalResult {
  needsApproval: boolean
  currentAllowance: BigNumber
}

const useApprove = (token: Token) => {
  const { provider } = useWeb3Context()
  const { txConfirm } = useApp()
  const { waitForTransaction, addTransaction } = useTransactionReplacement()

  const signer = provider?.getSigner()

  // Memoize the check approval function
  const checkApproval = useCallback(async (amount: BigNumber, token: Token, spender: string): Promise<boolean> => {
    try {
      if (!spender) {
        return false
      }

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
      console.error('checkApproval error:', err)
      return false
    }
  }, [signer])

  // Memoize the approve function
  const approve = useCallback(async (amount: BigNumber, token: Token, spender: string) => {
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

    if (!token?.symbol) {
      return
    }

    const formattedAmount = toTokenDisplay(amount, token.decimals)
    const chain = getChain(reactAppNetwork as NetworkSlug, token.chain.slug as ChainSlug)
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
      const transaction = new Transaction({
        hash: tx?.hash,
        networkName: token.chain.slug,
        token,
      })

      addTransaction(transaction)

      const res = await waitForTransaction(tx, {
        networkName: token.chain.slug,
        token
      })

      if (res && 'replacementTx' in res) {
        return res.replacementTx
      }
    }

    return tx
  }, [signer, txConfirm, waitForTransaction, addTransaction])

  return { approve, checkApproval }
}

export default useApprove
