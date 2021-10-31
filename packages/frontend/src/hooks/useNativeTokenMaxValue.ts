import { useState, useCallback } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { Token, TProvider } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import { ZERO_ADDRESS } from 'src/constants'

export const METHOD_NAMES = {
  convertTokens: 'convertTokens',
  wrapToken: 'wrapToken',
}

const estimatedGasLimits = {
  convertTokens: {
    // destNetwork
    arbitrum: 124_069,
    optimism: 289_937,
    polygon: 72_039,
    xdai: 78_450,
  },
  wrapToken: {
    // destNetwork
    arbitrum: 964_242,
    optimism: 65_000_000,
    polygon: 27_941,
    xdai: 62_000_000,
  },
  sendL1ToL2: {
    // destNetwork
    arbitrum: 123_793,
    optimism: 289_661,
    polygon: 71_763,
    xdai: 78_174,
  },
  sendL2ToL1: {
    // sourceNetwork
    arbitrum: 1_818_394,
    optimism: 80_000_000,
    polygon: 273_869,
    xdai: 302_165,
  },
  sendL2ToL2: {
    // sourceNetwork
    arbitrum: {
      // destNetwork
      polygon: 1_818_387,
      optimism: 1_818_370,
      xdai: 1_818_414,
    },
    optimism: {
      polygon: 75_000_000,
      arbitrum: 75_000_000,
      xdai: 1_818_414,
    },
    polygon: {
      xdai: 273_869,
    },
    xdai: {
      arbitrum: 302_177,
      optimism: 302_165,
      polygon: 302_165,
    },
  },
}

function getSendHardcodedGasLimit(sourceNetwork, destNetwork) {
  const l1ToL2 = sourceNetwork.isLayer1 && !destNetwork.isLayer1
  const l2ToL1 = !sourceNetwork.isLayer1 && destNetwork.isLayer1
  const l2ToL2 = !sourceNetwork.isLayer1 && !destNetwork.isLayer1

  let estimatedGasLimit

  if (l1ToL2) {
    estimatedGasLimit = BigNumber.from(estimatedGasLimits.sendL1ToL2[destNetwork.slug] || '0')
  } else if (l2ToL1) {
    estimatedGasLimit = BigNumber.from(estimatedGasLimits.sendL2ToL1[sourceNetwork.slug] || '0')
  } else if (l2ToL2) {
    estimatedGasLimit = BigNumber.from(
      estimatedGasLimits.sendL2ToL2[sourceNetwork.slug][destNetwork.slug] || '0'
    )
  }

  return estimatedGasLimit
}

async function estimateGasCost(signer: TProvider, estimatedGasLimit: BigNumber) {
  try {
    // Get current gas price
    const gasPrice = await signer.getGasPrice()
    // Add some wiggle room
    const bufferGas = BigNumber.from(50_000)
    return estimatedGasLimit.add(bufferGas).mul(gasPrice)
  } catch (error) {
    logger.error(error)
  }
}

export function useNativeTokenMaxValue(token?: Token, secondaryToken?: Token) {
  const { checkConnectedNetworkId, provider } = useWeb3Context()
  const { sdk } = useApp()
  const [tx, setTx] = useState<Transaction | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  const estimateConvertTokens = useCallback(
    async (options: { destNetwork: Network }) => {
      const {
        destNetwork: { slug },
      } = options

      if (token && slug) {
        // ----------------------------------------------------------------------------------------
        // Hardcoded dictionary lookup approach
        // ----------------------------------------------------------------------------------------
        const estimatedGasLimit = BigNumber.from(estimatedGasLimits.convertTokens[slug] || '0')
        return estimateGasCost(token.signer, estimatedGasLimit)
      }
    },
    [token]
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
        if (!isNetworkConnected) {
          // --------------------------------------------------------------------------------------
          // Hardcoded dictionary lookup approach
          // --------------------------------------------------------------------------------------
          const estimatedGasLimit = getSendHardcodedGasLimit(fromNetwork, toNetwork)
          return estimateGasCost(token.signer, estimatedGasLimit)
        }

        // ----------------------------------------------------------------------------------------
        // contract.estimateGas.method() approach
        // ----------------------------------------------------------------------------------------
        const bridge = sdk.bridge(token.symbol)
        // Get estimated gas limit
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

        if (estimatedGasLimit) {
          return estimateGasCost(token.signer, estimatedGasLimit)
        }
      } catch (error) {
        logger.error(error)
      }
    },
    [sdk, token]
  )

  const estimateWrap = useCallback(
    async (options: { token: Token; network: Network }) => {
      const { token, network } = options
      if (!token?.isNativeToken) {
        return
      }

      try {
        // Switch networks
        const isNetworkConnected = await checkConnectedNetworkId(Number(network.networkId))
        if (!isNetworkConnected) {
          // --------------------------------------------------------------------------------------
          // Hardcoded dictionary lookup approach
          // --------------------------------------------------------------------------------------
          const estimatedGasLimit = BigNumber.from(
            estimatedGasLimits.wrapToken[network.slug] || '0'
          )
          return estimateGasCost(token.signer, estimatedGasLimit)
        }

        // ----------------------------------------------------------------------------------------
        // contract.estimateGas.method() approach
        // ----------------------------------------------------------------------------------------
        // Get estimated gas cost
        const estimatedGasLimit = await token.wrapToken(BigNumber.from(10), true)

        if (estimatedGasLimit) {
          return estimateGasCost(token.signer, estimatedGasLimit)
        }
      } catch (error) {
        logger.error(error)
      }
    },
    [token, secondaryToken]
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
          case METHOD_NAMES.convertTokens: {
            return estimateConvertTokens(options)
          }

          case METHOD_NAMES.wrapToken: {
            return estimateWrap(options)
          }

          default:
            break
        }
      } catch (error) {
        logger.error(error)
      }
    },
    [token, secondaryToken]
  )

  return {
    estimateMaxValue,
    estimateSend,
    sending,
    tx,
    setTx,
  }
}
