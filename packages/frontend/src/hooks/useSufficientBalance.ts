import { Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { useQuery } from 'react-query'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { toTokenDisplay } from 'src/utils'

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
      }:${amount?.toString()}:${estimatedGasCost?.toString()}:${tokenBalance?.toString()}:${needsNativeBridgeApproval}`,
      token,
      estimatedGasCost,
      amount,
      needsNativeBridgeApproval,
    ],
    async () => {
      if (!(token && amount && tokenBalance?.gt(0))) {
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

      if (usingNativeBridge && tokenBalance?.lt(estGasCost.add(amount))) {
        return false
      }

      try {
        let totalEst = BigNumber.from(0)
        if (needsNativeBridgeApproval) {
          const estApproval = await l1CanonicalBridge?.estimateApproveTx(amount)
          console.log(`estApproval:`, estApproval?.toString())
          if (estApproval) {
            totalEst = totalEst.add(estApproval)
          }
          return totalEst
        } else {
          const estDeposit = await l1CanonicalBridge?.estimateDepositTx(amount)
          console.log(`estDeposit:`, estDeposit?.toString())
          if (estDeposit) {
            totalEst = totalEst.add(estDeposit)
          }
        }
      } catch (error) {
        console.log(`error:`, error)
        return false
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
      refetchInterval: 10e3,
    }
  )

  return {
    sufficientBalance,
    warning,
  }
}
