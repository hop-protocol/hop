import React, { FC, ChangeEvent, useEffect, useState } from 'react'
import { WithdrawalProof } from './WithdrawalProof'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from 'src/components/alert/Alert'
import { toTokenDisplay } from 'src/utils'
import { formatError } from 'src/utils/format'
import { useApp } from 'src/contexts/AppContext'

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
  const { sdk } = useApp()
  const [transferId, setTransferId] = useState<string>(() => {
    return localStorage.getItem('withdrawTransferId') || ''
  })
  const [proof, setProof] = useState<any>()
  const [info, setInfo] = useState<any>()
  const [instance, setInstance] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [warning, setWarning] = useState<string>('')

  useEffect(() => {
      localStorage.setItem('withdrawTransferId', transferId)
  }, [transferId])

  useEffect(() => {
    const update = async () => {
      try {
        setWarning('')
        if (instance && proof) {
          await instance.checkWithdrawable()
        }
      } catch (err: any) {
        setWarning(formatError(err))
      }
    }
    update()
  }, [instance, proof])

  async function handleSubmit(event: any) {
    event.preventDefault()
    try {
      setLoading(true)
      setInstance(null)
      setProof('')
      setError('')
      setInfo(null)
      const _instance = new WithdrawalProof(transferId)
      await _instance.generateProof()
      const _proof = _instance.getProofPayload()
      setInstance(_instance)
      setProof(JSON.stringify(_proof, null, 2))

      const { sourceChain, destinationChain, token, tokenDecimals, amount } = _instance.transfer
      const formattedAmount = toTokenDisplay(amount, tokenDecimals)

      setInfo([
        { k: 'Transfer ID', v: transferId },
        { k: 'Source', v: sourceChain },
        { k: 'Destination', v: destinationChain },
        { k: 'Token', v: token },
        { k: 'Amount', v: formattedAmount },
      ])
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setLoading(false)
  }

  function handleChange(event: any) {
    setTransferId(event.target.value)
  }

  async function handleClick(event: any) {
    event.preventDefault()
    try {
      setSending(true)
      await instance.checkWithdrawable()
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
      const bridge = sdk.bridge(instance.transfer.token)
      const tx = await bridge.withdraw(
        instance.transfer.destinationChain,
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
      console.log('tx:', tx)
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setSending(false)
  }

  const activeButton = !!proof && !warning

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
      {proof &&
      <div>
      <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Show withdrawal proof data</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre className={styles.proof}>
              {proof}
            </pre>
          </AccordionDetails>
        </Accordion>
      </div>
      }
      {loading && (
        <div>
          Generating proof data...
        </div>
      )}
      <div>
        {info &&
          info.map(({ k, v }: any) => {
            return (
              <div key={k}>
                <label>{k}:</label>
                    <span>{v}</span>
              </div>
            )
          })
        }
      </div>
      {activeButton &&
        <div>
          <button disabled={sending} onClick={handleClick}>Withdraw Transfer</button>
        </div>
      }
      <div>
        <Alert severity="error">{error}</Alert>
        <Alert severity="warning">{warning}</Alert>
      </div>
    </div>
  )
}
