import { useState } from 'react'
import logger from 'src/logger'

interface SendingTransaction {
  onConfirm: (confirmed: boolean, params?: any) => void
}

export function useSendingTransaction(props: SendingTransaction) {
  const { onConfirm } = props

  const [sending, setSending] = useState<boolean>(false)

  async function handleSubmit(opts?: any) {
    try {
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
