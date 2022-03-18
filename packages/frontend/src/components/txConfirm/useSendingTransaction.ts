import { useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import { NetworkTokenEntity } from 'src/utils'

interface BaseSendingTransaction {
  onConfirm: (confirmed: boolean, params?: any) => void
}

type SendingTransactionWithSource = BaseSendingTransaction & {
  source: Partial<NetworkTokenEntity>
}

type SendingTransactionWithToken = BaseSendingTransaction & {
  token: Partial<NetworkTokenEntity>
}

type SendingTransactionWithToken0 = BaseSendingTransaction & {
  token0: Partial<NetworkTokenEntity>
}

type SendingTransaction =
  | SendingTransactionWithSource
  | SendingTransactionWithToken
  | SendingTransactionWithToken0

export function useSendingTransaction(props: SendingTransaction) {
  const { onConfirm } = props
  const { checkConnectedNetworkId, connectedNetworkId } = useWeb3Context()

  const [sending, setSending] = useState<boolean>(false)

  async function handleSubmit(opts?: any) {
    try {
      let src: Partial<NetworkTokenEntity> | undefined
      if ('source' in props) {
        src = props.source
      } else if ('token' in props) {
        src = props.token
      } else if ('token0' in props) {
        src = props.token0
      } else {
        throw new Error(
          `NetworkTokenEntity (source, token, token0) required. props: ${JSON.stringify(props)}`
        )
      }
      const txChainId = Number(src?.network?.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(txChainId)
      if (!isNetworkConnected) return

      setSending(true)
      onConfirm(true, opts)
    } catch (err) {
      logger.error(err)
      setSending(false)
    }
  }

  return {
    sending,
    setSending,
    handleSubmit,
  }
}
