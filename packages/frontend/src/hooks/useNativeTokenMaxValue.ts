import { useState, useEffect, useMemo, useCallback } from 'react'
import { BigNumber, constants, Signer, BigNumberish, utils } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { getBonderFeeWithId } from 'src/utils'
import { createTransaction } from 'src/utils/createTransaction'
import { amountToBN, fixedDecimals, formatError } from 'src/utils/format'
import { HopBridge, Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import useBalance from './useBalance'
import Network from 'src/models/Network'
import { ZERO_ADDRESS } from 'src/constants'

export function useNativeTokenMaxValue(token?: Token, secondaryToken?: Token) {
  const { sdk } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()
  const [tx, setTx] = useState<Transaction | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  async function estimateConvertTokens() {
    return BigNumber.from(420)
  }

  const estimateSend = useCallback(
    async (options: any) => {
      const { fromNetwork, toNetwork, deadline } = options
      console.log(`options:`, options)

      if (!(sdk && token)) {
        return
      }

      const bridge = sdk.bridge(token.symbol)

      let nativeTokenMaxGasCost = BigNumber.from(0)
      try {
        // Switch networks
        const isNetworkConnected = await checkConnectedNetworkId(Number(fromNetwork.networkId))
        if (!isNetworkConnected) return

        // Get estimated gas cost
        const estimatedGasLimit = await bridge.send(
          '10',
          fromNetwork.slug as string,
          toNetwork.slug as string,
          {
            recipient: ZERO_ADDRESS,
            bonderFee: '1',
            amountOutMin: '0',
            deadline: deadline(),
            destinationAmountOutMin: '0',
            destinationDeadline: deadline(),
            estimateGasOnly: true,
          }
        )

        // Get current gas price
        const gasPrice = await bridge.signer.getGasPrice()

        if (estimatedGasLimit && gasPrice) {
          // Add some wiggle room
          const bufferGas = BigNumber.from(2000)
          nativeTokenMaxGasCost = estimatedGasLimit.add(bufferGas).mul(gasPrice)
        }
      } catch (error) {
        logger.error(error)
      }

      return nativeTokenMaxGasCost
    },
    [sdk, token]
  )

  // sendL1ToL2: 273_869
  // wrapToken: 27_941

  const estimateWrap = useCallback(
    async (options: { methodName: 'wrapToken' | 'unwrapToken'; token: Token }) => {
      const { token, methodName } = options
      console.log(`options:`, options)

      if (!(sdk && token && token.isNativeToken)) {
        return
      }

      const bridge = sdk.bridge(token.symbol)

      let nativeTokenMaxGasCost = BigNumber.from(0)
      try {
        // Get estimated gas cost
        const estimatedGasLimit = await token[methodName](BigNumber.from(1000), true)

        // Get current gas price
        const gasPrice = await bridge.signer.getGasPrice()

        if (estimatedGasLimit && gasPrice) {
          // Add some wiggle room
          const bufferGas = BigNumber.from(2000)
          nativeTokenMaxGasCost = estimatedGasLimit.add(bufferGas).mul(gasPrice)
        }
      } catch (error) {
        logger.error(error)
      }

      return nativeTokenMaxGasCost
    },
    [sdk, token, secondaryToken]
  )

  // Master send method
  const estimateMaxValue = useCallback(
    async (methodName, options?: any) => {
      console.log(`options:`, options)
      if (!(sdk && methodName)) {
        return
      }
      let nativeTokenMaxGasCost = BigNumber.from(0)

      try {
        switch (methodName) {
          case 'convertTokens':
            nativeTokenMaxGasCost = (await estimateConvertTokens())!
            break

          case 'wrapToken':
          case 'unwrapToken':
            nativeTokenMaxGasCost = (await estimateWrap(options))!
            break

          default:
            break
        }
      } catch (error) {
        logger.error(error)
      }

      return nativeTokenMaxGasCost
    },
    [sdk, token]
  )

  return {
    estimateMaxValue,
    estimateSend,
    sending,
    tx,
    setTx,
  }
}
