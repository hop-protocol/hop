import { useState, useCallback } from 'react'
import { BigNumber, constants, providers } from 'ethers'
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

export async function getGasCostByGasLimit(
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
  token: Token
  network?: Chain
  sourceChain?: Chain
  destinationChain?: Chain
  deadline?: () => number
  checkAllowance?: boolean
}

interface EstimateTxProps {
  sourceChain?: Chain
  sourceToken?: Token
  sourceTokenAmount?: BigNumber
  destinationChain?: Chain
  usingNativeBridge?: boolean
  needsNativeBridgeApproval?: boolean
  l1CanonicalBridge?: CanonicalBridge
}

async function estimateApproveNativeBridge(l1CanonicalBridge, sourceTokenAmount) {
  if (!l1CanonicalBridge || !sourceTokenAmount) {
    return
  }

  const spender = l1CanonicalBridge.getDepositApprovalAddress()
  if (!spender) {
    throw new Error(
      `token "${l1CanonicalBridge.tokenSymbol}" on chain "${l1CanonicalBridge.chain.slug}" is unsupported`
    )
  }
  return l1CanonicalBridge.estimateApproveTx(sourceTokenAmount)
}

export function useEstimateTxCost(props?: EstimateTxProps) {
  const {
    sourceChain,
    sourceToken,
    sourceTokenAmount,
    destinationChain,
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
        let gasCost = await getGasCostByGasLimit(network.provider, estimatedGasLimit)
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
    const { token, network } = options
    if (!(network && token)) {
      return
    }

    try {
      // Get estimated gas cost
      const estimatedGasLimit = await token.getWrapTokenEstimatedGas(network.slug)

      if (BigNumber.isBigNumber(estimatedGasLimit)) {
        let gasCost = await getGasCostByGasLimit(network.provider, estimatedGasLimit)
        if (gasCost && network?.slug === ChainSlug.Optimism) {
          const { gasLimit, data, to } = await token.getWrapTokenEstimatedGas(network.slug)
          const l1FeeInWei = await token.estimateOptimismL1FeeFromData(gasLimit, data, to)
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

  const estimateHandleApprove = useCallback(async () => {
    try {
      if (l1CanonicalBridge && usingNativeBridge && needsNativeBridgeApproval) {
        return await estimateApproveNativeBridge(l1CanonicalBridge, sourceTokenAmount)
      } else {
        if (sourceTokenAmount && sourceToken && sourceChain) {
          // return await checkApproval(sourceTokenAmount, sourceToken, sourceChain.slug)
        }
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, sourceChain))
      }
      logger.error(err)
    }
  }, [
    l1CanonicalBridge,
    usingNativeBridge,
    needsNativeBridgeApproval,
    sourceToken,
    sourceChain,
    sourceTokenAmount,
  ])

  const estimateSend = useCallback(
    async (options: EstimateTxOptions) => {
      const { sourceChain, destinationChain, token, deadline } = options
      if (!(sdk && sourceChain && destinationChain && deadline && token)) {
        return
      }

      try {
        const bridge = sdk.bridge(token.symbol)
        console.log(`bridge:`, bridge)

        const destinationAmountOutMin = 0
        let destinationDeadline = deadline()
        if (destinationChain.slug === ChainSlug.Ethereum) {
          destinationDeadline = 0
        }

        const needsAppoval = await token.needsApproval(
          bridge.getSendApprovalAddress(sourceChain.slug),
          '10'
        )

        console.log(`needsApproval:`, needsAppoval)

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
          let gasCost = await getGasCostByGasLimit(sourceChain.provider, estimatedGasLimit)
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
        setError(formatError(error, sourceChain))
      }
    },
    [sdk]
  )


  return {
    estimateMaxValue,
    estimateSend,
    estimateHandleApprove,
    tx,
    setTx,
    estimateTxError: error,
  }
}
