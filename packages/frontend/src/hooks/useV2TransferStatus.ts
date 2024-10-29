import { useEffect, useState, useMemo } from 'react'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { useApp } from '#contexts/AppContext/index.js'
import { BigNumber, providers, utils, Contract, constants } from 'ethers'
import { useQuery } from 'react-query'
import { useV2 } from './useV2.js'
import { Hop, utils as v2Utils  } from '@hop-protocol/v2-sdk'
import { formatError } from '#utils/format.js'
import { commafy } from '#utils/commafy.js'
import { useTokenPrice } from '#hooks/useTokenPrice.js'
import {
  useBalance,
  useFeeConversions,
} from '#hooks/index.js'

const { formatUnits, parseUnits } = utils
const { formatUSD } = v2Utils

type V2SendHook = {
  v2Sdk: Hop
  transferStatus: any
}

type Props = {
  transactionHash: string
  fromChainId: string
  toChainId: string
}

export function useV2TransferStatus(props: any): V2SendHook {
  const { transactionHash, fromChainId, toChainId } = props
  const { v2Sdk } = useV2()
  const {
    networks,
    txConfirm
  } = useApp()
  const { address, provider } = useWeb3Context()
  const [transferStatus, setTransferStatus] = useState<any>(null)

  const { isLoading, data, error } = useQuery(
    [`transferStatus:${transactionHash}`, fromChainId, toChainId, transactionHash],
    async () => {
      if (v2Sdk && fromChainId && toChainId && transactionHash) {
          const event = await v2Sdk.getRailsGateway(fromChainId).getTransferSentEventFromTransactionHash({
            transactionHash
          })
          if (!event) {
            return
          }
          const transferId = event.decoded.transferId
          const status = await v2Sdk.getTransferStatus({
            fromChainId,
            toChainId,
            transferId
          })

          console.log(status)
          setTransferStatus(status)
      } else {
        setTransferStatus(null)
      }
      return
    },
    {
      enabled: !!(fromChainId && toChainId && transactionHash),
      refetchInterval: 5 * 1000,
    }
  )

  return {
    v2Sdk,
    transferStatus
  }
}
