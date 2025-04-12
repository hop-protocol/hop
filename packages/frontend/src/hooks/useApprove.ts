import Transaction from '#models/Transaction.js'
import { BigNumber, constants } from 'ethers'
import { ChainSlug, NetworkSlug, Token, getChain } from '@hop-protocol/sdk'
import { toTokenDisplay } from '#utils/index.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useTransactionReplacement } from '#hooks/useTransactionReplacement.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { reactAppNetwork } from '#config/index.js'
import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from 'react-query'

// Constants
const REFETCH_INTERVAL = 15 * 1000 // 15 seconds
const STALE_TIME = 5 * 1000 // 5 seconds
const CACHE_TIME = 30 * 1000 // 30 seconds
const MAX_RETRIES = 2

interface AllowanceResult {
  approved: BigNumber
  needsApproval: boolean
}

const useApprove = (token: Token) => {
  const { provider } = useWeb3Context()
  const { txConfirm } = useApp()
  const { waitForTransaction, addTransaction } = useTransactionReplacement()
  const queryClient = useQueryClient()

  const signer = provider?.getSigner()

  // Memoize the check approval function to maintain same signature
  const checkApproval = useCallback(async (amount: BigNumber, token: Token, spender: string): Promise<boolean> => {
    try {
      if (!spender) {
        return false
      }

      // Use cached data if available
      const queryKey = ['allowance', token.address, spender, token.chain?.chainId]
      const cachedData = queryClient.getQueryData<AllowanceResult>(queryKey)
      
      if (cachedData) {
        return cachedData.needsApproval
      }

      // Fallback to direct check if no cache
      const approved = await token.allowance(spender)
      return approved.lt(amount)
    } catch (err: any) {
      console.error('checkApproval error:', err)
      return false
    }
  }, [signer, queryClient])

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
        const tx = await token.approve(spender, approveAmount)

        // Invalidate allowance cache after approval
        const queryKey = ['allowance', token.address, spender, token.chain?.chainId]
        queryClient.invalidateQueries(queryKey)

        return tx
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
  }, [signer, txConfirm, waitForTransaction, addTransaction, queryClient])

  return { approve, checkApproval }
}

export default useApprove
