import { useState } from 'react'

export type TxConfirmParams = {
  kind: string
  inputProps: any
  onConfirm: () => void
}

export interface TxConfirm {
  txConfirmParams: TxConfirmParams
  show: (params: TxConfirmParams) => void
}

export const useTxConfirm = (): TxConfirm => {
  const [txConfirmParams, setTxConfirm] = useState<any>(null)

  const show = (params: TxConfirmParams) => {
    const { kind, inputProps, onConfirm } = params
    return new Promise((resolve, reject) => {
      setTxConfirm({
        kind,
        inputProps,
        onConfirm: async (confirmed: true) => {
          try {
            if (!confirmed) {
              throw new Error('Cancelled')
            }

            const result = await onConfirm()
            resolve(result)
          } catch (err) {
            reject(err)
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
