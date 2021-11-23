import { useState, useCallback } from 'react'
import { BigNumber, constants } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { Token, TProvider } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'

export enum MethodNames {
  convertTokens = 'convertTokens',
  wrapToken = 'wrapToken',
}

async function estimateGasCost(signer: TProvider, estimatedGasLimit: BigNumber) {
  try {
    // Get current gas price
    const gasPrice = await signer.getGasPrice()
    // Add some wiggle room
    const bufferGas = BigNumber.from(70_000)
    return estimatedGasLimit.add(bufferGas).mul(gasPrice)
  } catch (error) {
    logger.error(error)
  }
}

export function useNativeTokenMaxValue(selectedNetwork?: Network) {
  const { checkConnectedNetworkId } = useWeb3Context()
  const { sdk } = useApp()
  const [tx, setTx] = useState<Transaction | null>(null)

  // { destNetwork: Network; network: Network }
  const estimateConvertTokens = useCallback(
    async (options: any) => {
      const { token, network, destNetwork } = options

      if (!(sdk && token?.isNativeToken && network && destNetwork?.slug)) {
        return
      }

      const isNetworkConnected = await checkConnectedNetworkId(Number(network.networkId))
      if (!isNetworkConnected) return

      const bridge = sdk.bridge(token.symbol)

      const estimatedGasLimit = await bridge.sendHToken('420', network.slug, destNetwork.slug, {
        bonderFee: '0',
        estimateGasOnly: true,
      })

      if (estimatedGasLimit) {
        return estimateGasCost(token.signer, estimatedGasLimit)
      }
    },
    [sdk, selectedNetwork]
  )

  const estimateSend = useCallback(
    async options => {
      const { fromNetwork, toNetwork, token, deadline } = options
      if (!(sdk && token?.isNativeToken && fromNetwork && toNetwork && deadline)) {
        return
      }

      try {
        // Switch networks
        const isNetworkConnected = await checkConnectedNetworkId(Number(fromNetwork.networkId))
        if (!isNetworkConnected) return

        const bridge = sdk.bridge(token.symbol)
        // Get estimated gas limit
        const estimatedGasLimit = await bridge.send(
          '10',
          fromNetwork.slug as string,
          toNetwork.slug as string,
          {
            recipient: constants.AddressZero,
            bonderFee: '1',
            amountOutMin: '0',
            deadline: deadline(),
            destinationAmountOutMin: '0',
            destinationDeadline: deadline(),
            estimateGasOnly: true,
          }
        )

        if (estimatedGasLimit) {
          return estimateGasCost(token.signer, estimatedGasLimit)
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
      if (!(token?.isNativeToken && network)) {
        return
      }

      try {
        // Switch networks
        const isNetworkConnected = await checkConnectedNetworkId(Number(network.networkId))
        if (!isNetworkConnected) return

        // Get estimated gas cost
        const estimatedGasLimit = await token.wrapToken(BigNumber.from(10), true)

        if (estimatedGasLimit) {
          return estimateGasCost(token.signer, estimatedGasLimit)
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
