import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import logger from 'src/logger'
import { BigNumber, constants } from 'ethers'
import { ChainSlug, Hop, Token } from '@hop-protocol/sdk'
import { formatUnits } from 'ethers/lib/utils'
import { getDefaultSendGasLimit } from 'src/utils/getDefaultSendGasLimit'
import { useApp } from 'src/contexts/AppContext'
import { useCallback, useState } from 'react'

export enum MethodNames {
  convertTokens = 'convertTokens',
  wrapToken = 'wrapToken',
}

async function getEstimateGasPrice(network: Network, sdk: Hop): Promise<BigNumber> {
  let gasPrice = BigNumber.from(0)
  try {
    const provider = await sdk.getSignerOrProvider(network.slug)

    // uses highest gas price from provider
    gasPrice = await provider.getGasPrice()
    try {
      const feeData = await provider.getFeeData()
      if (feeData.gasPrice?.gt(gasPrice)) {
        gasPrice = feeData.gasPrice
      }
      const maxFeePerGas = feeData?.maxFeePerGas?.sub(feeData?.maxPriorityFeePerGas ?? 0)
      if (maxFeePerGas?.gt(gasPrice)) {
        gasPrice = maxFeePerGas
      }
    } catch (err) {
      console.error('getEstimateGasPrice getFeeData error:', err)
    }

    return gasPrice
  } catch (err) {
    logger.error('getEstimateGasPrice error:', err)
  }

  return gasPrice
}

async function estimateGasCost(fromNetwork: Network, toNetwork: Network | null, estimatedGasLimit: BigNumber, sdk: Hop): Promise<BigNumber | undefined> {
  try {
    let gasPrice = await getEstimateGasPrice(fromNetwork, sdk)

    try {
      // use any txoverrides values if they are higher
      const txOverrides = await sdk.txOverrides(fromNetwork.slug, toNetwork?.slug)
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
    console.log('gasCost estimate:', formatUnits(gasCost.toString(), 18), 'gasPrice', formatUnits(gasPrice.toString(), 9), 'gasLimit:', estimatedGasLimit.toString())
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
        let gasCost = await estimateGasCost(network, null, estimatedGasLimit, sdk)
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
    async (options: any) => {
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
          let gasCost = await estimateGasCost(fromNetwork, toNetwork, estimatedGasLimit, sdk)
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
          let gasCost = await estimateGasCost(network, null, estimatedGasLimit, sdk)
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
            return await estimateConvertTokens(options)
          }

          case MethodNames.wrapToken: {
            return await estimateWrap(options)
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
