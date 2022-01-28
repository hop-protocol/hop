import { useState, useCallback } from 'react'
import { BigNumber, constants, providers } from 'ethers'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { Token, ChainSlug } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'

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
  network?: Network
  fromNetwork?: Network
  toNetwork?: Network
  deadline?: () => number
}

export function useEstimateTxCost() {
  const { sdk } = useApp()
  const [tx, setTx] = useState<Transaction | null>(null)

  const estimateConvertTokens = useCallback(
    async (options: { token: Token; network: Network; destNetwork: Network }) => {
      const { token, network, destNetwork } = options

      if (!(sdk && network && destNetwork?.slug)) {
        return
      }

      const bridge = sdk.bridge(token.symbol)

      const estimatedGasLimit = await bridge.estimateSendHTokensGasLimit(
        '420',
        network.slug,
        destNetwork.slug,
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
            destNetwork.slug
          )
          const l1FeeInWei = await bridge.estimateOptimismL1FeeFromData(estimatedGasLimit, data, to)
          gasCost = gasCost.add(l1FeeInWei)
        }
        return gasCost
      }
    },
    [sdk]
  )

  // TODO: rename fromNetwork -> sourceNetwork
  // toNetwork -> destNetwork
  const estimateSend = useCallback(
    async (options: EstimateTxOptions) => {
      const { fromNetwork, toNetwork, token, deadline } = options
      if (!(sdk && fromNetwork && toNetwork && deadline)) {
        return
      }

      try {
        const bridge = sdk.bridge(token.symbol)

        const destinationAmountOutMin = 0
        let destinationDeadline = deadline()
        if (toNetwork.slug === ChainSlug.Ethereum) {
          destinationDeadline = 0
        }

        const needsAppoval = await token.needsApproval(
          bridge.getSendApprovalAddress(fromNetwork.slug),
          '10'
        )

        let estimatedGasLimit = BigNumber.from(200e3)
        // Get estimated gas limit
        if (!needsAppoval) {
          estimatedGasLimit = await bridge.estimateSendGasLimit(
            '10',
            fromNetwork.slug as string,
            toNetwork.slug as string,
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
          let gasCost = await getGasCostByGasLimit(fromNetwork.provider, estimatedGasLimit)
          if (gasCost && fromNetwork.slug === ChainSlug.Optimism) {
            const l1FeeInWei = await bridge.getOptimismL1Fee(fromNetwork.slug, toNetwork.slug)
            gasCost = gasCost.add(l1FeeInWei)
          }
          return gasCost
        }
      } catch (error: any) {
        const message = error.message
        if (message?.includes('revert')) {
          return
        }
        logger.error(error)
      }
    },
    [sdk]
  )

  const estimateWrap = useCallback(async (options: EstimateTxOptions) => {
    const { token, network } = options
    if (!network) {
      return
    }

    try {
      // Get estimated gas cost
      const estimatedGasLimit = await token.wrapToken(BigNumber.from(10), true)

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
      logger.error(error)
    }
  }, [])

  // Master send method
  const estimateMaxValue = useCallback(
    async (methodName: string, options?: any) => {
      console.log(`estimateMaxValue options:`, options)
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
        logger.error(error)
      }
    },
    [sdk]
  )

  return {
    estimateMaxValue,
    estimateSend,
    tx,
    setTx,
  }
}
