import { useCallback, useState } from 'react'
import logger from 'src/logger'
import { formatError } from 'src/utils'

type InputProps = any
type ConfirmParams = any
export type TxConfirmParams = {
  kind: string
  inputProps: InputProps
  onConfirm?: (params?: ConfirmParams) => void
}

export interface TxConfirm {
  txConfirmParams: TxConfirmParams
  show: (params: TxConfirmParams) => Promise<any>
}

export const useTxConfirm = (options?: any): TxConfirm => {
  // logger.debug('useTxConfirm debug')
  const [txConfirmParams, setTxConfirm] = useState<ConfirmParams>(null)

  const show = useCallback(
    (params: TxConfirmParams) => {
      const { kind, inputProps, onConfirm } = params
      return new Promise((resolve, reject) => {
        setTxConfirm({
          kind,
          inputProps,
          onConfirm: async (confirmed: boolean = true, params?: ConfirmParams) => {
            try {
              if (!confirmed) {
                reject(new Error('Cancelled'))
              }

              if (onConfirm) {
                const res = await onConfirm(params)
                resolve(res)
              } else {
                resolve(null)
              }
            } catch (err: any) {
              // MetaMask cancel error
              if (options?.setError) {
                options.setError(formatError(err))
              } else {
                logger.error(formatError(err))
                reject(err)
              }
            }
            setTxConfirm(null)
          },
        })
      })
    },
    [options]
  )

  return {
    txConfirmParams,
    show,
  }
}

export default useTxConfirm
