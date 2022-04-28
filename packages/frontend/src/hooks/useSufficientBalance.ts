import { Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import CanonicalBridge from 'src/models/CanonicalBridge'
import Chain from 'src/models/Chain'
import { defaultRefetchInterval, formatError, toTokenDisplay } from 'src/utils'
import { useWarningErrorInfo } from './useWarningErrorInfo'

interface Props {
  sourceToken?: Token
  sourceTokenAmount?: BigNumber
  estimatedGasLimit?: BigNumber
  tokenBalance?: BigNumber
  isSmartContractWallet?: boolean
  usingNativeBridge?: boolean
  needsNativeBridgeApproval?: boolean
  needsApproval?: boolean
  l1CanonicalBridge?: CanonicalBridge
  sourceChain?: Chain
  destinationChain?: Chain
}

export function useSufficientBalance(props: Props) {
  let {
    sourceChain,
    sourceToken,
    sourceTokenAmount,
    destinationChain,
    estimatedGasLimit,
    tokenBalance,
    isSmartContractWallet,
    usingNativeBridge,
    needsNativeBridgeApproval,
    needsApproval,
    l1CanonicalBridge,
  } = props
  const { address } = useWeb3Context()

  const { warning, setWarning, setError, error } = useWarningErrorInfo({
    sourceChain,
    destinationChain,
    sourceTokenAmount,
  })

  const {
    warning: nativeDepositWarning,
    setWarning: setNDWarning,
    setError: setNDError,
    error: nativeDepositError,
  } = useWarningErrorInfo({
    sourceChain,
    destinationChain,
    sourceTokenAmount,
  })

  useEffect(() => {
    if (sourceTokenAmount && tokenBalance) {
      if (tokenBalance?.lte(sourceTokenAmount)) {
        setError(`Insufficient ${sourceToken?.symbol} Balance`)
      }
    }
  }, [tokenBalance, sourceTokenAmount])

  const { data: sufficientBalance } = useQuery(
    [
      `sufficientBalance:${sourceToken?.symbol}:${sourceChain?.slug}:${
        destinationChain?.slug
      }:${sourceTokenAmount?.toString()}:${estimatedGasLimit?.toString()}:${tokenBalance?.toString()}`,
      isSmartContractWallet,
      sourceToken?.symbol,
      sourceTokenAmount?.toString(),
      sourceChain?.slug,
      destinationChain?.slug,
      estimatedGasLimit?.toString(),
      tokenBalance?.toString(),
      l1CanonicalBridge?.address,
      setWarning,
    ],
    async () => {
      // NOTE: For now, no accommodations are made for the tx sender
      // if they do not have enough funds to pay for the relay tx.
      // It's kind of complicated to handle, because for the case when the SC wallet has more than owner
      // is not possible to know who of them will be the one who executes the TX.
      // We will trust on the wallet UI to handle this issue for now.
      if (isSmartContractWallet) {
        return true
      }

      const inputs = {
        sourceToken,
        sourceTokenAmount,
        tokenBalance,
        usingNativeBridge,
        needsNativeBridgeApproval,
        needsApproval,
        address,
      }
      console.log(`inputs:`, inputs)

      if (!(sourceToken && sourceTokenAmount && tokenBalance?.gt(0))) {
        setWarning('')
        return false
      }

      let totalCost: BigNumber
      let enoughFeeBalance: boolean
      let enoughTokenBalance: boolean
      let message: string = ''

      const ntb = await sourceToken.getNativeTokenBalance()

      // using the signer of the source token to get the gas price if not provided
      if (!estimatedGasLimit) {
        const gasPrice = await sourceToken.signer.getGasPrice()
        estimatedGasLimit = BigNumber.from(200e3).mul(gasPrice || 1e9)
      }

      if (sourceToken.isNativeToken) {
        totalCost = estimatedGasLimit.add(sourceTokenAmount)
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = enoughFeeBalance
      } else {
        totalCost = estimatedGasLimit
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
        !error &&
        !!sourceToken &&
        !!sourceTokenAmount &&
        !!tokenBalance &&
        !!estimatedGasLimit &&
        !usingNativeBridge,
      refetchInterval: defaultRefetchInterval,
    }
  )

  const { data: sufficientBalanceForNativeDeposit } = useQuery(
    [
      `sufficientBalanceForNativeDeposit:${sourceToken?.symbol}:${sourceChain?.slug}:${
        destinationChain?.slug
      }:${sourceTokenAmount?.toString()}:${estimatedGasLimit?.toString()}:${tokenBalance?.toString()}:${usingNativeBridge}:${l1CanonicalBridge}}`,
      isSmartContractWallet,
      sourceToken?.symbol, // NOTE: this triggers a JSON circular error
      sourceTokenAmount?.toString(),
      sourceChain?.slug,
      destinationChain?.slug,
      estimatedGasLimit?.toString(),
      tokenBalance?.toString(),
      l1CanonicalBridge?.address,
      usingNativeBridge,
      needsApproval,
      needsNativeBridgeApproval,
    ],
    async () => {
      const inputs = {
        sourceToken,
        sourceTokenAmount,
        estimatedGasLimit,
        tokenBalance,
        usingNativeBridge,
        needsNativeBridgeApproval,
        needsApproval,
        address,
      }
      console.log(`native deposits inputs:`, inputs)

      if (!(sourceToken && sourceTokenAmount && tokenBalance?.gt(0))) {
        setNDWarning(null)
        return false
      }

      let totalCost: BigNumber
      let enoughFeeBalance: boolean
      let enoughTokenBalance: boolean
      let message: string = ''

      const ntb = await sourceToken.getNativeTokenBalance(address?.address)
      console.log(`ntb:`, ntb.toString())
      console.log(`tokenBalance.toString:`, tokenBalance.toString())

      if (!estimatedGasLimit) {
        const gasPrice = await sourceToken.signer.getGasPrice()
        estimatedGasLimit = BigNumber.from(300e3).mul(gasPrice || 1e9)

        if (ntb?.lt(estimatedGasLimit)) {
          message = `Insufficient balance to cover the cost of tx. Please add ${sourceToken.nativeTokenSymbol} to pay for tx fees.`
          setNDWarning(message)
          return false
        }
      }

      try {
        const totalEst = BigNumber.from(0)
        // if (needsNativeBridgeApproval) {
        //   const estApproval = await l1CanonicalBridge?.estimateApproveTx(sourceTokenAmount)
        //   if (estApproval) {
        //     totalEst = totalEst.add(estApproval)
        //   }
        // } else {
        const estDeposit = await l1CanonicalBridge?.estimateDepositTx(sourceTokenAmount)
        // if (estDeposit) {
        //   totalEst = totalEst.add(estDeposit)
        // }
        // }
        // estimatedGasLimit = totalEst.add(estimatedGasLimit || '0')
        if (estimatedGasLimit.lte(estDeposit!)) {
          console.log(`estimatedGasLimit.toString():`, estimatedGasLimit?.toString())
          console.log(`estDeposit.toString():`, estDeposit?.toString())
          setNDWarning(null)
          return true
        }
      } catch (error) {
        logger.error(formatError(error))
        // NOTE: This warning shouldn't be displayed if sending native bridge deposit (where needsApproval is undefined)
        // if (needsApproval === true || needsNativeBridgeApproval === true) {
        // }
        setNDWarning(formatError(error))
        return false
      }

      if (sourceToken.isNativeToken) {
        totalCost = estimatedGasLimit.add(sourceTokenAmount)
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = enoughFeeBalance
      } else {
        totalCost = estimatedGasLimit
        enoughFeeBalance = ntb.gte(totalCost)
        enoughTokenBalance = tokenBalance.gte(sourceTokenAmount)
      }

      logger.debug(
        'totalCost, enoughFeeBalance, enoughTokenBalance',
        totalCost.toString(),
        enoughFeeBalance,
        enoughTokenBalance
      )

      // NOTE: For now, no accommodations are made for the tx sender
      // if they do not have enough funds to pay for the relay tx.
      // It's kind of complicated to handle, because for the case when the SC wallet has more than owner
      // is not possible to know who of them will be the one who executes the TX.
      // We will trust on the wallet UI to handle this issue for now.
      if (isSmartContractWallet || (usingNativeBridge && tokenBalance.gte(totalCost))) {
        setNDWarning(null)
        return true
      }

      if (enoughFeeBalance && enoughTokenBalance) {
        setNDWarning(null)
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

      setNDError(message)
      return false
    },
    {
      enabled:
        !error && !!sourceToken && !!sourceTokenAmount && !!tokenBalance && !!l1CanonicalBridge,
      refetchInterval: defaultRefetchInterval,
    }
  )

  return {
    sufficientBalance,
    sufficientBalanceWarning: warning,
    sufficientBalanceForNativeDeposit,
    sufficientBalanceForNativeDepositWarning: nativeDepositWarning,
  }
}
