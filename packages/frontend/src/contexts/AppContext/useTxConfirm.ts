import { useState } from 'react'
import logger from 'src/logger'

export type TxConfirmParams = {
  kind: string
  inputProps: any
  onConfirm: (params?: any) => void
}

export interface TxConfirm {
  txConfirmParams: TxConfirmParams
  show: (params: TxConfirmParams) => void
}

export const useTxConfirm = (): TxConfirm => {
  //logger.debug('useTxConfirm debug')
  const [txConfirmParams, setTxConfirm] = useState<any>(null)

  const show = (params: TxConfirmParams) => {
    const { kind, inputProps, onConfirm } = params
    return new Promise((resolve, reject) => {
      setTxConfirm({
        kind,
        inputProps,
        onConfirm: async (confirmed: true, params?: any) => {
          try {
            if (!confirmed) {
              throw new Error('Cancelled')
            }

            const res = await onConfirm(params)
            resolve(res)
          } catch (err) {
            // MetaMask cancel error
            if (/denied transaction/gi.test(err.message)) {
              reject(new Error('Cancelled'))
            } else {
              reject(err)
            }
          }
          setTxConfirm(null)
        }
      })
    })
  }

  return {
    txConfirmParams,
    show
  }
}

export default useTxConfirm
