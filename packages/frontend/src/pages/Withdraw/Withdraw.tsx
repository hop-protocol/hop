import React, { FC, ChangeEvent, useEffect, useState } from 'react'
import { WithdrawalProof } from './WithdrawalProof'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  proof: {
    maxHeight: '500px',
    overflow: 'auto',
    background: '#fff',
    border: '5px solid #fff',
    color: '#000',
    borderRadius: '6px'
  },
}))

export const Withdraw: FC = () => {
  const styles = useStyles()
  const [transferId, setTransferId] = useState<string>(() => {
    return localStorage.getItem('withdrawTransferId') || ''
  })
  const [proof, setProof] = useState<any>()
  const [instance, setInstance] = useState<any>()

  useEffect(() => {
      localStorage.setItem('withdrawTransferId', transferId)
  }, [transferId])

  async function handleSubmit(event: any) {
    event.preventDefault()
    try {
      setInstance(null)
      setProof('')
      const _instance = new WithdrawalProof(transferId)
      await _instance.generateProof()
      const _proof = _instance.getProofPayload()
      setInstance(_instance)
      setProof(JSON.stringify(_proof, null, 2))
    } catch (err) {
      console.error(err)
    }
  }

  function handleChange(event: any) {
    setTransferId(event.target.value)
  }

  function handleClick(event: any) {
    event.preventDefault()
    try {
      if (!instance.rootSet) {
        throw new Error('root not set yet')
      }
      const {
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        deadline,
        transferRootHash,
        rootTotalAmount,
        transferIdTreeIndex,
        siblings,
        totalLeaves,
      } = instance.getTxPayload()
      console.log(
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        deadline,
        transferRootHash,
        rootTotalAmount,
        transferIdTreeIndex,
        siblings,
        totalLeaves,
      )
    } catch (err) {
    }
  }

  const activeButton = !!proof

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" value={transferId} onChange={handleChange} />
        </div>
        <div>
          <button>Generate Proof</button>
        </div>
      </form>
      <div>
        <pre className={styles.proof}>
          {proof}
        </pre>
      </div>
      {activeButton &&
      <div>
        <button onClick={handleClick}>Withdraw Transfer</button>
      </div>
      }
    </div>
  )
}
