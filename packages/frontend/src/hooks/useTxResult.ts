import { useQuery } from 'react-query'
import { Token } from '@hop-protocol/sdk'
import Chain from 'src/models/Chain'
import { BigNumber } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import { defaultRefetchInterval, formatError } from 'src/utils'
import logger from 'src/logger'

interface EstimateFns {
  usingNativeBridge: boolean
  needsNativeBridgeApproval?: boolean
  needsApproval?: boolean
  estimateApproveNativeBridge?: any
  estimateSendNativeBridge?: any
  estimateApprove?: any
  estimateSend?: any
}

interface Props {
  sourceToken?: Token
  sourceChain?: Chain
  destinationChain?: Chain
  sourceTokenAmount?: BigNumber
  estimateFns?: EstimateFns
}

export function useTxResult(props: Props) {
  const { sourceToken, sourceChain, destinationChain, sourceTokenAmount, estimateFns } = props
  const {
    usingNativeBridge,
    needsNativeBridgeApproval,
    needsApproval,
    estimateApprove,
    estimateApproveNativeBridge,
    estimateSend,
    estimateSendNativeBridge,
  } = estimateFns as EstimateFns
  const { settings } = useApp()
  const { deadline, ...rest } = settings

  const queryKey = `estimatedGasLimit:${sourceToken?.address}:${
    sourceChain?.slug
  }:${sourceTokenAmount?.toString()}:${
    destinationChain?.slug
  }:${needsApproval}:${usingNativeBridge}:${needsNativeBridgeApproval}`

  const {
    isLoading,
    isError,
    data: estimatedGasLimit,
    error,
  } = useQuery(
    [
      queryKey,
      destinationChain?.slug,
      sourceChain?.slug,
      sourceToken?.symbol,
      sourceTokenAmount?.toString(),
      estimateFns,
      needsApproval,
      usingNativeBridge,
      needsNativeBridgeApproval,
    ],
    async () => {
      if (!(sourceToken && sourceChain && destinationChain)) {
        return
      }

      try {
        const options = {
          sourceToken,
          sourceChain,
          destinationChain,
          deadline,
        }
        let egl = BigNumber.from(0)
        if (usingNativeBridge === true && needsNativeBridgeApproval === true) {
          egl = await estimateApproveNativeBridge()
        } else if (usingNativeBridge === true && !needsNativeBridgeApproval) {
          console.log(`options:`, options)
          egl = await estimateSendNativeBridge(options)
        } else if (!usingNativeBridge && needsApproval === true) {
          egl = await estimateApprove()
        } else {
          egl = await estimateSend(options)
        }
        console.log(`estimated gas limit, options:`, egl, options)
        return egl
      } catch (error) {
        logger.error(formatError(error))
      }
    },
    {
      enabled:
        !!sourceToken &&
        !!sourceTokenAmount &&
        !!sourceChain &&
        !!destinationChain &&
        !!estimateFns,
      refetchInterval: defaultRefetchInterval,
    }
  )

  return {
    estimatedGasLimit,
    isLoading,
    isError,
    error,
  }
}
