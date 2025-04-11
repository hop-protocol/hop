import useIsSmartContractWallet from '#hooks/useIsSmartContractWallet.js'
import { BigNumber } from 'ethers'
import { Token } from '@hop-protocol/sdk'
import { toTokenDisplay } from '#utils/index.js'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

// Constants
const DEFAULT_GAS_LIMIT = BigNumber.from(200e3)
const DEFAULT_GAS_PRICE = BigNumber.from(1e9)
const ZERO = BigNumber.from(0)
const REFETCH_INTERVAL = 15 * 1000 // 15 seconds
const STALE_TIME = 5 * 1000 // 5 seconds
const CACHE_TIME = 30 * 1000 // 30 seconds
const MAX_RETRIES = 2

// Helper functions
const formatInsufficientFeeMessage = (token: Token, diff?: BigNumber) => {
  if (!token.isNativeToken) {
    return `Insufficient balance to cover the cost of tx. Please add ${token.nativeTokenSymbol} to pay for tx fees.`
  }
  return `Insufficient balance to cover the cost of tx. Please add ${token.symbol} to pay for tx fees or reduce the amount by approximately ${toTokenDisplay(diff || ZERO)} ${token.symbol}`
}

const formatInsufficientTokenMessage = (tokenSymbol: string) => {
  return `Insufficient ${tokenSymbol} balance.`
}

type BalanceCheckResult = {
  sufficientBalance: boolean
  warning: string
}

export function useSufficientBalance(
  token?: Token,
  amount?: BigNumber, // input amount
  estimatedGasCost?: BigNumber,
  tokenBalance: BigNumber = ZERO
) {
  const { isSmartContractWallet } = useIsSmartContractWallet()

  // Memoize query key to prevent unnecessary refetches
  const queryKey = useMemo(() => [
    'sufficientBalance',
    token?.address,
    token?.symbol,
    amount?.toString(),
    estimatedGasCost?.toString(),
    tokenBalance.toString()
  ], [token?.address, token?.symbol, amount, estimatedGasCost, tokenBalance])

  // Memoize the enabled condition
  const isQueryEnabled = useMemo(() => (
    !isSmartContractWallet && // Don't run for smart contract wallets
    !!token?.signer &&
    !!amount
  ), [isSmartContractWallet, token?.signer, amount])

  const { data: balanceCheck, isLoading } = useQuery<BalanceCheckResult>(
    queryKey,
    async (): Promise<BalanceCheckResult> => {
      if (!(amount && token && token.signer)) {
        return {
          sufficientBalance: false,
          warning: ''
        }
      }

      try {
        const nativeTokenBalance = await token.getNativeTokenBalance()
        const finalEstimatedGasCost = estimatedGasCost || (
          await token.signer.getGasPrice()
            .then(gasPrice => DEFAULT_GAS_LIMIT.mul(gasPrice || DEFAULT_GAS_PRICE))
            .catch(() => DEFAULT_GAS_LIMIT.mul(DEFAULT_GAS_PRICE))
        )

        let enoughFeeBalance: boolean
        let enoughTokenBalance: boolean

        if (token.isNativeToken) {
          const totalCost = finalEstimatedGasCost.add(amount)
          enoughFeeBalance = nativeTokenBalance.gte(totalCost)
          enoughTokenBalance = enoughFeeBalance

          if (!enoughFeeBalance) {
            const diff = totalCost.sub(nativeTokenBalance)
            return {
              sufficientBalance: false,
              warning: formatInsufficientFeeMessage(token, diff)
            }
          }
        } else {
          enoughFeeBalance = nativeTokenBalance.gte(finalEstimatedGasCost)
          enoughTokenBalance = tokenBalance.gte(amount)

          if (!enoughFeeBalance) {
            return {
              sufficientBalance: false,
              warning: formatInsufficientFeeMessage(token)
            }
          }

          if (!enoughTokenBalance) {
            return {
              sufficientBalance: false,
              warning: formatInsufficientTokenMessage(token.symbol)
            }
          }
        }

        if (enoughFeeBalance && enoughTokenBalance) {
          return {
            sufficientBalance: true,
            warning: ''
          }
        }

        return {
          sufficientBalance: false,
          warning: ''
        }
      } catch (error) {
        console.error('Error checking balance:', error)
        return {
          sufficientBalance: false,
          warning: 'Error checking balance'
        }
      }
    },
    {
      enabled: isQueryEnabled,
      refetchInterval: REFETCH_INTERVAL,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: MAX_RETRIES,
      refetchOnWindowFocus: true,
      onError: (error) => {
        console.error('Balance check query error:', error)
      }
    }
  )

  // NOTE: For now, no accommodations are made for the tx sender
  // if they do not have enough funds to pay for the relay tx.
  // It's kind of complicated to handle, because for the case when the SC wallet has more than owner
  // is not possible to know who of them will be the one who executes the TX.
  // We will trust on the wallet UI to handle this issue for now.
  if (isSmartContractWallet) {
    return {
      sufficientBalance: true,
      warning: ''
    }
  }

  // Return memoized result
  return useMemo(() => ({
    sufficientBalance: balanceCheck?.sufficientBalance ?? false,
    warning: balanceCheck?.warning ?? '',
    isLoading
  }), [balanceCheck?.sufficientBalance, balanceCheck?.warning, isLoading])
}
