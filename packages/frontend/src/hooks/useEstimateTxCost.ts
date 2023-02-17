import { useState, useCallback } from 'react'
import { BigNumber, constants } from 'ethers'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { Token, ChainSlug } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import { formatUnits } from 'ethers/lib/utils'

export enum MethodNames {
  convertTokens = 'convertTokens',
  wrapToken = 'wrapToken',
}

async function estimateGasCost(network: Network, estimatedGasLimit: BigNumber) {
  let gasPrice = BigNumber.from(0)
  try {
    // Get current gas price
    try {
      const { maxFeePerGas, maxPriorityFeePerGas } = await network.provider.getFeeData()
      if (maxFeePerGas && maxPriorityFeePerGas) {
        gasPrice = (maxFeePerGas.sub(maxPriorityFeePerGas)).div(2)
      } else {
        gasPrice = await network.provider.getGasPrice()
      }
    } catch (err) {
      gasPrice = await network.provider.getGasPrice()
    }
    // console.log('gasPrice estimate:', gasPrice.toString(), formatUnits(gasPrice.toString(), 9))
    // Add some wiggle room
    const bufferGas = BigNumber.from(70_000)
    return (estimatedGasLimit.add(bufferGas)).mul(gasPrice)
  } catch (err) {
    logger.error('estimateGasCost error:', err)
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
      const bonderFee = await bridge.getBonderFeeAbsolute(network.slug)
      const amount = (bonderFee ?? BigNumber.from('100')).mul(2)
      const estimatedGasLimit = await bridge.estimateSendHTokensGasLimit(
        amount,
        network.slug,
        destNetwork.slug,
        {
          bonderFee
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
        const bonderFee = await bridge.getBonderFeeAbsolute(fromNetwork.slug)
        const amount = (bonderFee ?? BigNumber.from('100')).mul(2)

        // RelayerFee amount does not matter for estimation
        let relayerFee : BigNumber | undefined
        if (fromNetwork.slug === ChainSlug.Ethereum) {
          relayerFee = BigNumber.from('1')
        }

        let estimatedGasLimit : BigNumber
        try {
          estimatedGasLimit = await bridge.estimateSendGasLimit(
            amount,
            fromNetwork.slug as string,
            toNetwork.slug as string,
            {
              recipient: constants.AddressZero,
              bonderFee,
              amountOutMin: '0',
              deadline: deadline(),
              destinationAmountOutMin,
              destinationDeadline,
              relayerFee
            }
          )
        } catch (err) {
          logger.error('estimateSendGasLimit error:', err)
          const defaultSendGasLimits = {
            ethereum: token.symbol === 'ETH' ? 130000 : 180000,
            arbitrum: token.symbol === 'ETH' ? 500000 : 700000,
            optimism: token.symbol === 'ETH' ? 225000 : 240000,
            gnosis: token.symbol === 'ETH' ? 260000 : 390000,
            polygon: token.symbol === 'ETH' ? 260000 : 260000,
            nova: token.symbol === 'ETH' ? 500000 : 700000,
          }
          const defaultGasLimit = defaultSendGasLimits[fromNetwork.slug]
          logger.debug('using default gasLimit:', defaultGasLimit)
          estimatedGasLimit = BigNumber.from(defaultGasLimit)
        }

        if (estimatedGasLimit) {
          let gasCost = await estimateGasCost(fromNetwork, estimatedGasLimit)
          if (gasCost && fromNetwork.slug === ChainSlug.Optimism) {
            const l1FeeInWei = await bridge.getOptimismL1Fee(fromNetwork.slug, toNetwork.slug)
            gasCost = gasCost.add(l1FeeInWei)
          }
          return gasCost
        }
      } catch (err) {
        logger.error('estimateSend error:', err)
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
      } catch (err) {
        logger.error('estimateWrap error:', err)
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
      } catch (err) {
        logger.error('estimateMaxValue error:', err)
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
