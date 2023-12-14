import { useState, useCallback } from 'react'
import { BigNumber, constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { Hop, Token, ChainSlug } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import { getDefaultSendGasLimit } from 'src/utils/getDefaultSendGasLimit'

export enum MethodNames {
  convertTokens = 'convertTokens',
  wrapToken = 'wrapToken',
}

async function getEstimateGasPrice(network: Network, sdk: Hop): Promise<BigNumber> {
  let gasPrice = BigNumber.from(0)
  try {
    // Get current gas price
    const provider = await sdk.getSignerOrProvider(network.slug)
    try {
      const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData()
      if (maxFeePerGas && maxPriorityFeePerGas) {
        gasPrice = (maxFeePerGas.sub(maxPriorityFeePerGas)).div(2)
      } else {
        gasPrice = await provider.getGasPrice()
      }
    } catch (err) {
      gasPrice = await provider.getGasPrice()
    }

    return gasPrice
  } catch (err) {
    logger.error('getEstimateGasPrice error:', err)
  }

  return gasPrice
}

async function estimateGasCost(network: Network, estimatedGasLimit: BigNumber, sdk: Hop): Promise<BigNumber | undefined> {
  try {
    let gasPrice = await getEstimateGasPrice(network, sdk)

    try {
      const txOverrides = await sdk.txOverrides(network.slug)
      if (txOverrides?.gasPrice?.gt(gasPrice)) {
        gasPrice = txOverrides.gasPrice
      }

      if (txOverrides?.gasLimit?.gt(estimatedGasLimit)) {
        estimatedGasLimit = txOverrides.gasLimit
      }
    } catch (err: any) {
      console.error('getEstimateGasPrice sdk.txOverrides error:', err)
    }

    // Add some wiggle room
    const bufferGas = BigNumber.from(70_000)
    const gasCost = (estimatedGasLimit.add(bufferGas)).mul(gasPrice)
    console.log('gasCost estimate:', formatUnits(gasCost.toString(), 18), formatUnits(gasPrice.toString(), 9))
    return gasCost
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
        let gasCost = await estimateGasCost(network, estimatedGasLimit, sdk)
        if (gasCost && (network.slug === ChainSlug.Optimism || network.slug === ChainSlug.Base)) {
          const tokenAmount = BigNumber.from(1)
          const { data, to } = await bridge.populateSendHTokensTx(
            tokenAmount,
            network.slug,
            destNetwork.slug
          )
          const l1FeeInWei = await bridge.estimateOptimismL1FeeFromData(estimatedGasLimit, data, to, network.slug)
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
        let amount = (bonderFee ?? BigNumber.from('100')).mul(2)
        if (amount.eq(0)) {
          amount = BigNumber.from('100') // should never be 0 amount for estimation
        }

        // RelayerFee amount does not matter for estimation
        let relayerFee : BigNumber | undefined
        if (fromNetwork.slug === ChainSlug.Ethereum) {
          relayerFee = BigNumber.from('0')
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
          const defaultGasLimit = getDefaultSendGasLimit(fromNetwork.slug, token.symbol)
          logger.debug('using default gasLimit:', defaultGasLimit)
          estimatedGasLimit = BigNumber.from(defaultGasLimit)
        }

        if (estimatedGasLimit) {
          let gasCost = await estimateGasCost(fromNetwork, estimatedGasLimit, sdk)
          if (gasCost && (fromNetwork.slug === ChainSlug.Optimism || fromNetwork.slug === ChainSlug.Base)) {
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
          let gasCost = await estimateGasCost(network, estimatedGasLimit, sdk)
          if (gasCost && (network.slug === ChainSlug.Optimism || network.slug === ChainSlug.Base)) {
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
