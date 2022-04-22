import { Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { defaultRefetchInterval, formatError, toTokenDisplay } from 'src/utils'

interface Props {
  sourceToken?: Token
  sourceTokenAmount?: BigNumber
  estimatedGasLimit?: BigNumber
  tokenBalance?: BigNumber
  isSmartContractWallet?: boolean
  usingNativeBridge?: boolean
  needsNativeBridgeApproval?: boolean
  l1CanonicalBridge?: CanonicalBridge
}

export function useSufficientBalance(props: Props) {
  const {
    sourceToken,
    sourceTokenAmount,
    estimatedGasLimit,
    tokenBalance,
    isSmartContractWallet,
    usingNativeBridge,
    needsNativeBridgeApproval,
    l1CanonicalBridge,
  } = props
  console.log(`sufficient balance props:`, props)
  const [warning, setWarning] = useState('')
  const { address } = useWeb3Context()

  const { data: sufficientBalance } = useQuery(
    [
      `sufficientBalance:${
        sourceToken?.symbol
      }:${sourceTokenAmount?.toString()}:${estimatedGasLimit?.toString()}:${tokenBalance?.toString()}:${usingNativeBridge}`,
      sourceToken?.symbol,
      estimatedGasLimit,
      sourceTokenAmount,
      tokenBalance,
      usingNativeBridge,
    ],
    async () => {
      console.log(`sourceToken, sourceTokenAmount, tokenBalance:`, sourceToken, sourceTokenAmount, tokenBalance)
      if (!(sourceToken && sourceTokenAmount && tokenBalance?.gt(0))) {
        setWarning('')
        return
      }

      let totalCost: BigNumber
      let enoughFeeBalance: boolean
      let enoughTokenBalance: boolean
      let message: string = ''

      const ntb = await sourceToken.getNativeTokenBalance(address?.address)

      let estGasCost = estimatedGasLimit

      if (!estGasCost) {
        const gasPrice = await sourceToken.signer.getGasPrice()
        estGasCost = BigNumber.from(200e3).mul(gasPrice || 1e9)
      }
      console.log(`estGasCost.toString():`, estGasCost.toString())

      if (usingNativeBridge && ntb?.lt(estGasCost)) {
        message = `Insufficient balance to cover the cost of tx. Please add ${sourceToken.nativeTokenSymbol} to pay for tx fees.`
        setWarning(message)
        return false
      }

      if (usingNativeBridge) {
        try {
          let totalEst = BigNumber.from(0)
          if (needsNativeBridgeApproval) {
            const estApproval = await l1CanonicalBridge?.estimateApproveTx(sourceTokenAmount)
            if (estApproval) {
              totalEst = totalEst.add(estApproval)
            }
          } else {
            const estDeposit = await l1CanonicalBridge?.estimateDepositTx(sourceTokenAmount)
            if (estDeposit) {
              totalEst = totalEst.add(estDeposit)
            }
          }
          estGasCost = estGasCost.add(totalEst)
        } catch (error) {
          logger.error(formatError(error))
          setWarning(formatError(error))
          return false
        }
      }

      if (sourceToken.isNativeToken) {
        totalCost = estGasCost.add(sourceTokenAmount)
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = enoughFeeBalance
      } else {
        totalCost = estGasCost
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = tokenBalance.gte(sourceTokenAmount)
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
          sourceToken.symbol
        } to pay for tx fees or reduce the sourceTokenAmount by approximately ${toTokenDisplay(
          diff
        )} ${sourceToken.symbol}`

        if (!sourceToken.isNativeToken) {
          message = `Insufficient balance to cover the cost of tx. Please add ${sourceToken.nativeTokenSymbol} to pay for tx fees.`
        }
      } else if (!enoughTokenBalance) {
        message = `Insufficient ${sourceToken.symbol} balance.`
      }

      setWarning(message)
      return false
    },
    {
      enabled:
        !!sourceToken?.symbol && !!sourceTokenAmount?.toString() && !!tokenBalance?.toString(),
      refetchInterval: defaultRefetchInterval,
    }
  )

  return {
    sufficientBalance,
    warning,
  }
}
