import { useState, useCallback } from 'react'
import { BigNumber, constants, providers, Signer } from 'ethers'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { Token, ChainSlug } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Chain from 'src/models/Chain'
import { formatError } from 'src/utils'
import CanonicalBridge from 'src/models/CanonicalBridge'

export enum MethodNames {
  convertTokens = 'convertTokens',
  wrapToken = 'wrapToken',
}

async function calculateTotalGasCostByGasLimit(
  provider: providers.Provider,
  estimatedGasLimit: BigNumber
) {
  try {
    // Get current gas price
    const gasPrice = await provider.getGasPrice()
    // Add some wiggle room
    const bufferGas = BigNumber.from(70_000)
    return estimatedGasLimit.add(bufferGas).mul(gasPrice)
  } catch (error) {
    logger.error(error)
  }
}

interface EstimateTxOptions {
  sourceToken: Token
  network?: Chain
  sourceChain?: Chain
  destinationChain?: Chain
  deadline?: () => number
  checkAllowance?: boolean
}

interface EstimateTxProps {
  sourceToken?: Token
  sourceTokenAmount?: BigNumber
  sourceChain?: Chain
  usingNativeBridge?: boolean
  needsNativeBridgeApproval?: boolean
  l1CanonicalBridge?: CanonicalBridge
}

export function useEstimateTxCost(props?: EstimateTxProps) {
  const {
    sourceToken,
    sourceTokenAmount,
    sourceChain,
    usingNativeBridge,
    needsNativeBridgeApproval,
    l1CanonicalBridge,
  } = props as EstimateTxProps

  const { sdk } = useApp()
  const [tx, setTx] = useState<Transaction | null>(null)
  const [error, setError] = useState()

  // TODO: convert all to react-query
  const estimateConvertTokens = useCallback(
    async (options: { token: Token; network: Chain; destinationChain: Chain }) => {
      const { token, network, destinationChain } = options

      if (!(sdk && network && destinationChain?.slug)) {
        return
      }

      const bridge = sdk.bridge(token.symbol)

      const estimatedGasLimit = await bridge.estimateSendHTokensGasLimit(
        '420',
        network.slug,
        destinationChain.slug,
        {
          bonderFee: '0',
        }
      )

      if (estimatedGasLimit) {
        let gasCost = await calculateTotalGasCostByGasLimit(network.provider, estimatedGasLimit)
        if (gasCost && network.slug === ChainSlug.Optimism) {
          const tokenAmount = BigNumber.from(1)
          const { data, to } = await bridge.populateSendHTokensTx(
            tokenAmount,
            network.slug,
            destinationChain.slug
          )
          const l1FeeInWei = await bridge.estimateOptimismL1FeeFromData(estimatedGasLimit, data, to)
          gasCost = gasCost.add(l1FeeInWei)
        }
        return gasCost
      }
    },
    [sdk]
  )

  const estimateWrap = useCallback(async (options: EstimateTxOptions) => {
    const { sourceToken, network } = options
    if (!(network && sourceToken)) {
      return
    }

    try {
      // Get estimated gas cost
      const estimatedGasLimit = await sourceToken.getWrapTokenEstimatedGas(network.slug)

      if (BigNumber.isBigNumber(estimatedGasLimit)) {
        let gasCost = await calculateTotalGasCostByGasLimit(network.provider, estimatedGasLimit)
        if (gasCost && network?.slug === ChainSlug.Optimism) {
          const { gasLimit, data, to } = await sourceToken.getWrapTokenEstimatedGas(network.slug)
          const l1FeeInWei = await sourceToken.estimateOptimismL1FeeFromData(gasLimit, data, to)
          gasCost = gasCost.add(l1FeeInWei)
        }
        return gasCost
      }
    } catch (error) {
      logger.error(formatError(error))
    }
  }, [])

  // Master send method
  const estimateMaxValue = useCallback(
    async (methodName: string, options?: any) => {
      if (!methodName) {
        return
      }

      try {
        switch (methodName) {
          case MethodNames.convertTokens: {
            return estimateConvertTokens(options)
          }

          case MethodNames.wrapToken: {
            return estimateWrap(options)
          }

          default:
            break
        }
      } catch (error) {
        logger.error(formatError(error))
      }
    },
    [sdk]
  )

  const estimateApprove = useCallback(async () => {
    if (!(sourceTokenAmount && sourceToken && sourceChain)) {
      return
    }
    try {
      const bridge = sdk.bridge(sourceToken.symbol)
      const spender = await bridge.getSendApprovalAddress(sourceChain.slug)

      const populatedTx = await sourceToken.populateApproveTx(spender, sourceTokenAmount)
      const provider = await bridge.getSignerOrProvider(sourceChain.slug)
      return await provider.estimateGas(populatedTx)
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, sourceChain))
      }
      logger.error(err)
    }
  }, [sourceToken, sourceTokenAmount, sourceChain])

  const estimateSend = useCallback(
    async (options: EstimateTxOptions) => {
      const { sourceChain, destinationChain, sourceToken, deadline } = options
      if (!(sdk && sourceChain && destinationChain && deadline && sourceToken)) {
        return
      }

      try {
        const bridge = sdk.bridge(sourceToken.symbol)
        const destinationAmountOutMin = 0
        let destinationDeadline = deadline()
        if (destinationChain.slug === ChainSlug.Ethereum) {
          destinationDeadline = 0
        }

        const needsAppoval = await sourceToken.needsApproval(
          bridge.getSendApprovalAddress(sourceChain.slug),
          '10'
        )

        let estimatedGasLimit = BigNumber.from(200e3)
        // Get estimated gas limit
        if (!needsAppoval) {
          estimatedGasLimit = await bridge.estimateSendGasLimit(
            '10',
            sourceChain.slug as string,
            destinationChain.slug as string,
            {
              recipient: constants.AddressZero,
              bonderFee: '1',
              amountOutMin: '0',
              deadline: deadline(),
              destinationAmountOutMin,
              destinationDeadline,
            }
          )
        }

        if (estimatedGasLimit) {
          let gasCost = await calculateTotalGasCostByGasLimit(
            sourceChain.provider,
            estimatedGasLimit
          )
          if (gasCost && sourceChain.slug === ChainSlug.Optimism) {
            const l1FeeInWei = await bridge.getOptimismL1Fee(
              sourceChain.slug,
              destinationChain.slug
            )
            gasCost = gasCost.add(l1FeeInWei)
          }
          return gasCost
        }
      } catch (error: any) {
        logger.error(formatError(error))
        if (error.message.includes('signer required')) {
          return
        }
        setError(formatError(error, sourceChain))
      }
    },
    [sdk]
  )

  return {
    estimateMaxValue,
    estimateApprove,
    estimateSend,
    tx,
    setTx,
    estimateTxError: error,
  }
}
