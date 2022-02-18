import React, { FC, ChangeEvent, useEffect, useState } from 'react'
import Card from '@material-ui/core/Card'
import { WithdrawalProof } from './WithdrawalProof'
import { makeStyles } from '@material-ui/core/styles'
import LargeTextField from 'src/components/LargeTextField'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from 'src/components/alert/Alert'
import { toTokenDisplay } from 'src/utils'
import { formatError } from 'src/utils/format'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Button from 'src/components/buttons/Button'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '4rem',
    textAlign: 'center'
  },
  form: {
    display: 'block',
    marginBottom: '4rem'
  },
  card: {
    marginBottom: '4rem'
  },
  loader: {
    marginTop: '2rem',
    textAlign: 'center'
  },
  info: {
    margin: '2rem 0 4rem 0',
    display: 'flex',
    flexDirection: 'column',
    '& div': {
      display: 'flex',
      alignContent: 'center',
      marginBottom: '0.5rem',
    },
    '& label': {
      whiteSpace: 'nowrap',
      marginRight: '0.5rem'
    },
    '& span': {
      lineHeight: 'normal',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'inline-block'
    }
  },
  proofAccordion: {
    marginBottom: '1rem'
  },
  proof: {
    maxHeight: '300px',
    overflow: 'auto',
    background: '#fff',
    border: '5px solid #fff',
    color: '#000',
    borderRadius: '6px',
    fontSize: '1.2rem',
  },
  notice: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
}))

export const Withdraw: FC = () => {
  const styles = useStyles()
  const { sdk, networks } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()
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
      setWarning('')
      setInfo(null)
      const _instance = new WithdrawalProof(transferId)
      await _instance.generateProof()
      const _proof = _instance.getProofPayload()
      setInstance(_instance)
      setProof(JSON.stringify(_proof, null, 2))

      const { sourceChain, destinationChain, token, tokenDecimals, amount } = _instance.transfer
      const formattedAmount = toTokenDisplay(amount, tokenDecimals)
      const source = networks.find(network => network.slug === sourceChain)
      const destination = networks.find(network => network.slug === destinationChain)

      setInfo([
        { k: 'Transfer ID', v: transferId },
        { k: 'Source', v: source?.name },
        { k: 'Destination', v: destination?.name },
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
      const networkId = Number(instance.transfer.destinationChainId)
      console.log(networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return
      setError('')
      setWarning('')
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
      await tx?.wait()
      console.log('tx:', tx)
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setSending(false)
  }

  const activeButton = !!proof && !warning

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Typography variant="h4">Withdraw</Typography>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
    <Card className={styles.card}>
        <Typography variant="h6">Transfer ID</Typography>
          <LargeTextField
            value={transferId}
            onChange={handleChange}
            placeholder="0x123"
            smallFontSize
            leftAlign
          />
        </Card>
        </div>
        <div>
          <Button
            onClick={handleSubmit}
            loading={loading}
            large
            highlighted
          >
            Generate Proof
          </Button>
        </div>
      </form>
      {proof &&
      <div className={styles.proofAccordion}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Show proof data</Typography>
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
        <div className={styles.loader}>
          <Typography variant="body1">
            Generating proof data...
          </Typography>
        </div>
      )}
      <div className={styles.info}>
        {info &&
          info.map(({ k, v }: any) => {
            return (
              <div key={k}>
                <label>
                  <Typography variant="body1"><strong>{k}:</strong></Typography>
                </label>
                <span>
                  <Typography variant="body1">{v}</Typography>
                </span>
              </div>
            )
          })
        }
      </div>
      {activeButton &&
        <div className={styles.form}>
          <Button
            onClick={handleClick}
            loading={sending}
            large
            highlighted
          >
            Withdraw Transfer
          </Button>
        </div>
      }
      <div className={styles.notice}>
        <Alert severity="error">{error}</Alert>
        <Alert severity="warning">{warning}</Alert>
      </div>
    </div>
  )
}
