import { useState } from 'react'

const useTxConfirm = () => {
  const [txConfirm, setTxConfirm] = useState<any>(null)

  const showTxConfirm = (params: any) => {
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
    txConfirm,
    showTxConfirm
  }
}

export default useTxConfirm
