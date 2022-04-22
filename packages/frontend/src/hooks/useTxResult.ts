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

  const queryKey = `estimatedGasLimit:${sourceToken?.symbol}:${sourceChain?.slug}:${destinationChain?.slug}`

  const {
    isLoading,
    isError,
    data: estimatedGasLimit,
    error,
  } = useQuery(
    [
      queryKey,
      destinationChain?.chainId,
      sourceChain?.chainId,
      sourceToken?.chain.chainId,
      sourceTokenAmount?.toString(),
      estimateFns,
      estimateSend,
      estimateApprove,
      estimateApproveNativeBridge,
      needsNativeBridgeApproval,
      needsApproval,
      usingNativeBridge,
    ],
    async () => {
      if (!(sourceToken && sourceChain && destinationChain)) {
        return
      }

      try {
        const options = { sourceToken, sourceChain, destinationChain, deadline, ...rest }
        let egl = BigNumber.from(0)
        if (usingNativeBridge && needsNativeBridgeApproval) {
          egl = await estimateApproveNativeBridge()
        } else if (usingNativeBridge) {
          egl = await estimateSendNativeBridge(options)
        } else if (needsApproval) {
          egl = await estimateApprove()
        } else {
          egl = await estimateSend(options)
        }
        return egl
      } catch (error) {
        logger.error(formatError(error))
      }
    },
    {
      enabled:
        !!props.sourceToken?.symbol &&
        !!props.sourceChain?.slug &&
        !!props.destinationChain?.slug &&
        !!props.estimateFns,
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
