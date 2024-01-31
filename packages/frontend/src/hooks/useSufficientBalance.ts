import useIsSmartContractWallet from 'src/hooks/useIsSmartContractWallet'
import { BigNumber } from 'ethers'
import { Token } from '@hop-protocol/sdk'
import { toTokenDisplay } from 'src/utils'
import { useEffect, useState } from 'react'

export function useSufficientBalance(
  token?: Token,
  amount?: BigNumber, // input amount
  estimatedGasCost?: BigNumber,
  tokenBalance: BigNumber = BigNumber.from(0)
) {
  const [sufficientBalance, setSufficientBalance] = useState(false)
  const [warning, setWarning] = useState('')
  const { isSmartContractWallet } = useIsSmartContractWallet()

  useEffect(() => {
    async function checkEnoughBalance() {
      if (!(amount && token && token.signer)) {
        setWarning('')
        return setSufficientBalance(false)
      }

      let totalCost: BigNumber
      let enoughFeeBalance: boolean
      let enoughTokenBalance: boolean
      let message: string = ''

      const nativeTokenBalance = await token.getNativeTokenBalance()

      if (!estimatedGasCost) {
        const gasPrice = await token.signer.getGasPrice()
        estimatedGasCost = BigNumber.from(200e3).mul(gasPrice || 1e9)
      }

      if (token.isNativeToken) {
        totalCost = estimatedGasCost.add(amount)
        enoughFeeBalance = nativeTokenBalance.gte(totalCost)
        enoughTokenBalance = enoughFeeBalance
      } else {
        totalCost = estimatedGasCost
        enoughFeeBalance = nativeTokenBalance.gte(totalCost)
        enoughTokenBalance = tokenBalance.gte(amount)
      }

      if (enoughFeeBalance && enoughTokenBalance) {
        setWarning('')
        return setSufficientBalance(true)
      }

      if (!enoughFeeBalance) {
        const diff = totalCost.sub(nativeTokenBalance)
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
      setSufficientBalance(false)
    }

    // NOTE: For now, no accommodations are made for the tx sender
    // if they do not have enough funds to pay for the relay tx.
    // It's kind of complicated to handle, because for the case when the SC wallet has more than owner
    // is not possible to know who of them will be the one who executes the TX.
    // We will trust on the wallet UI to handle this issue for now.
    if (isSmartContractWallet) {
      setWarning('')
      setSufficientBalance(true)
    } else {
      checkEnoughBalance()
    }
  }, [
    isSmartContractWallet,
    token,
    amount?.toString(),
    estimatedGasCost?.toString(),
    tokenBalance.toString(),
  ])

  return {
    sufficientBalance,
    warning,
  }
}
