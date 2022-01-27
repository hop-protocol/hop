import { Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { toTokenDisplay } from 'src/utils'

export function useSufficientBalance(
  token?: Token,
  amount?: BigNumber,
  estimatedGasCost?: BigNumber,
  tokenBalance: BigNumber = BigNumber.from(0)
) {
  const [sufficientBalance, setSufficientBalance] = useState(false)
  const [warning, setWarning] = useState('')

  useEffect(() => {
    async function checkEnoughBalance() {
      if (!(token && estimatedGasCost && amount)) {
        setWarning('')
        return setSufficientBalance(false)
      }

      let totalCost: BigNumber
      let enoughFeeBalance: boolean
      let enoughTokenBalance: boolean
      let message: string = ''

      const ntb = await token.getNativeTokenBalance()

      if (token.isNativeToken) {
        totalCost = estimatedGasCost.add(amount)
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = enoughFeeBalance
      } else {
        totalCost = estimatedGasCost
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = tokenBalance.gte(amount)
      }

      if (enoughFeeBalance && enoughTokenBalance) {
        setWarning('')
        return setSufficientBalance(true)
      }

      if (!enoughFeeBalance) {
        const diff = totalCost.sub(ntb)
        message = `Insufficient balance to cover the cost of tx. Please add ${
          token.symbol
        } to pay for tx fees or reduce the amount by approximately ${toTokenDisplay(diff)} ${
          token.symbol
        }`
      } else if (!enoughTokenBalance) {
        message = `Insufficient ${token.symbol} balance.`
      }

      setWarning(message)
      setSufficientBalance(false)
    }

    checkEnoughBalance()
  }, [token, amount?.toString(), estimatedGasCost?.toString(), tokenBalance.toString()])

  return {
    sufficientBalance,
    warning,
  }
}
