import { useState } from 'react'

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

export const useTxConfirm = (): TxConfirm => {
  // logger.debug('useTxConfirm debug')
  const [txConfirmParams, setTxConfirm] = useState<ConfirmParams>(null)

  const show = (params: TxConfirmParams) => {
    const { kind, inputProps, onConfirm } = params
    return new Promise((resolve, reject) => {
      setTxConfirm({
        kind,
        inputProps,
        onConfirm: async (confirmed: true, params?: ConfirmParams) => {
          try {
            if (!confirmed) {
              throw new Error('Cancelled')
            }

            if (onConfirm) {
              const res = await onConfirm(params)
              resolve(res)
            } else {
              resolve(null)
            }
          } catch (err: any) {
            // MetaMask cancel error
            if (/denied transaction/gi.test(err.message)) {
              reject(new Error('Cancelled'))
            } else {
              reject(err)
            }
          }
          setTxConfirm(null)
        },
      })
    })
  }

  return {
    txConfirmParams,
    show,
  }
}

export default useTxConfirm
