import { useState, useCallback } from 'react'
import { BigNumber, constants } from 'ethers'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { Token, ChainSlug } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'

export enum MethodNames {
  convertTokens = 'convertTokens',
  wrapToken = 'wrapToken',
}

async function estimateGasCost(network: Network, estimatedGasLimit: BigNumber) {
  try {
    // Get current gas price
    const gasPrice = await network.provider.getGasPrice()
    // Add some wiggle room
    const bufferGas = BigNumber.from(70_000)
    return estimatedGasLimit.add(bufferGas).mul(gasPrice)
  } catch (error) {
    logger.error(error)
  }
}

export function useEstimateTxCost(selectedNetwork?: Network) {
  const { sdk } = useApp()
  const [tx, setTx] = useState<Transaction | null>(null)

  // { destNetwork: Network; network: Network }
  const estimateConvertTokens = useCallback(
    async (options: any) => {
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
        let gasCost = await estimateGasCost(network, estimatedGasLimit)
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
    [sdk, selectedNetwork]
  )

  const estimateSend = useCallback(
    async options => {
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

        // Get estimated gas limit
        const estimatedGasLimit = await bridge.estimateSendGasLimit(
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

        if (estimatedGasLimit) {
          let gasCost = await estimateGasCost(fromNetwork, estimatedGasLimit)
          if (gasCost && fromNetwork.slug === ChainSlug.Optimism) {
            const l1FeeInWei = await bridge.getOptimismL1Fee(fromNetwork.slug, toNetwork.slug)
            gasCost = gasCost.add(l1FeeInWei)
          }
          return gasCost
        }
      } catch (error) {
        logger.error(error)
      }
    },
    [sdk, selectedNetwork]
  )

  const estimateWrap = useCallback(
    async (options: { token: Token; network: Network }) => {
      const { token, network } = options
      if (!network) {
        return
      }

      try {
        // Get estimated gas cost
        const estimatedGasLimit = await token.wrapToken(BigNumber.from(10), true)

        if (BigNumber.isBigNumber(estimatedGasLimit)) {
          let gasCost = await estimateGasCost(network, estimatedGasLimit)
          if (gasCost && network.slug === ChainSlug.Optimism) {
            const { gasLimit, data, to } = await token.getWrapTokenEstimatedGas(network.slug)
            const l1FeeInWei = await token.estimateOptimismL1FeeFromData(gasLimit, data, to)
            gasCost = gasCost.add(l1FeeInWei)
          }
          return gasCost
        }
      } catch (error) {
        logger.error(error)
      }
    },
    [selectedNetwork]
  )

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
    [sdk, selectedNetwork]
  )

  return {
    estimateMaxValue,
    estimateSend,
    tx,
    setTx,
  }
}
