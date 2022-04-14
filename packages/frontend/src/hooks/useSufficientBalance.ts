import { Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { useQuery } from 'react-query'
import logger from 'src/logger'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { formatError, toTokenDisplay } from 'src/utils'

export function useSufficientBalance(
  token?: Token,
  amount?: BigNumber,
  estimatedGasCost?: BigNumber,
  tokenBalance?: BigNumber,
  isSmartContractWallet?: boolean,
  usingNativeBridge?: boolean,
  needsNativeBridgeApproval?: boolean,
  l1CanonicalBridge?: CanonicalBridge
) {
  const [warning, setWarning] = useState('')

  const { data: sufficientBalance } = useQuery(
    [
      `sufficientBalance:${
        token?.symbol
      }:${amount?.toString()}:${estimatedGasCost?.toString()}:${tokenBalance?.toString()}`,
      token?.symbol,
      estimatedGasCost?.toString(),
      amount?.toString(),
      tokenBalance?.toString(),
      usingNativeBridge,
    ],
    async () => {
      if (!(token && amount && estimatedGasCost?.toString() && tokenBalance?.gt(0))) {
        setWarning('')
        return false
      }

      let totalCost: BigNumber
      let enoughFeeBalance: boolean
      let enoughTokenBalance: boolean
      let message: string = ''

      const ntb = await token.getNativeTokenBalance()

      let estGasCost = estimatedGasCost

      if (!estGasCost) {
        const gasPrice = await token.signer.getGasPrice()
        estGasCost = BigNumber.from(200e3).mul(gasPrice || 1e9)
      }

      if (usingNativeBridge && ntb?.lt(estGasCost.add(amount))) {
        message = `Insufficient balance to cover the cost of tx. Please add ${token.nativeTokenSymbol} to pay for tx fees.`
        setWarning(message)
        return false
      }

      if (usingNativeBridge) {
        try {
          let totalEst = BigNumber.from(0)
          if (needsNativeBridgeApproval) {
            const estApproval = await l1CanonicalBridge?.estimateApproveTx(amount)
            if (estApproval) {
              totalEst = totalEst.add(estApproval)
            }
          } else {
            const estDeposit = await l1CanonicalBridge?.estimateDepositTx(amount)
            if (estDeposit) {
              totalEst = totalEst.add(estDeposit)
            }
          }
          estGasCost = estGasCost.add(totalEst)
        } catch (error) {
          logger.error(formatError(error))
          return false
        }
      }

      if (token.isNativeToken) {
        totalCost = estGasCost.add(amount)
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = enoughFeeBalance
      } else {
        totalCost = estGasCost
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = tokenBalance.gte(amount)
      }

      if (isSmartContractWallet || (usingNativeBridge && tokenBalance.gte(totalCost))) {
        return true
      }

      if (enoughFeeBalance && enoughTokenBalance) {
        setWarning('')
        return true
      }

      if (!enoughFeeBalance) {
        const diff = totalCost.sub(ntb)
        message = `Insufficient balance to cover the cost of tx. Please add ${
          token.symbol
        } to pay for tx fees or reduce the amount by approximately ${toTokenDisplay(diff)} ${
          token.symbol
        }`

        if (!token.isNativeToken) {
          message = `Insufficient balance to cover the cost of tx. Please add ${token.nativeTokenSymbol} to pay for tx fees.`
        }
      } else if (!enoughTokenBalance) {
        message = `Insufficient ${token.symbol} balance.`
      }

      setWarning(message)
      return false
    },
    {
      enabled:
        !!token?.symbol &&
        !!amount?.toString() &&
        !!estimatedGasCost?.toString() &&
        !!tokenBalance?.toString(),
      refetchInterval: 2e3,
    }
  )

  return {
    sufficientBalance,
    warning,
  }
}
