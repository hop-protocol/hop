import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import { Button } from 'src/components/Button'
import { ExternalLink } from 'src/components/Link'
import { NetworkTokenEntity } from 'src/utils'
import { getExplorerTxUrl } from 'src/utils/getExplorerUrl'
import { makeStyles } from '@mui/styles'
import { useSendingTransaction } from 'src/components/txConfirm/useSendingTransaction'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    marginBottom: '2rem',
  },
  action: {},
  doneButton: {},
}))

interface Props {
  getProof: any
  getInfo: any
  sendTx: any
  onError: any
  onConfirm: (confirmed: boolean) => void
  source: NetworkTokenEntity
}

const WithdrawReview = (props: Props) => {
  const [proofLoaded, setProofLoaded] = useState<boolean>(false)
  const [info, setInfo] = useState<any>()
  const [waitingConfirmation, setWaitingConfirmation] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const { getProof, getInfo, sendTx, onConfirm, onError, source } = props
  const { handleSubmit: closeModal } = useSendingTransaction({ onConfirm, source })
  const styles = useStyles()

  useEffect(() => {
    const update = async () => {
      try {
        if (getProof && !proofLoaded) {
          const wp = await getProof()
          setProofLoaded(true)
          setInfo(await getInfo(wp))
          setWaitingConfirmation(true)
          const tx = await sendTx()
          setWaitingConfirmation(false)
          setSending(true)
          setTxHash(tx.hash)
          await tx.wait()
        }
      } catch (err) {
        onError(err)
        closeModal()
      }
    }
    update()
  }, [getProof])

  function handleClose() {
    closeModal()
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <div
          style={{
            marginBottom: '1rem',
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Withdraw Transfer
          </Typography>
        </div>
        <div>
          {!proofLoaded && (
            <Typography variant="subtitle2" color="textSecondary">
              Checking transfer data...
            </Typography>
          )}
          {info && (
            <Typography variant="h6" color="textSecondary">
              <strong>
                {info.amount} {info.token}
              </strong>{' '}
              on {info.destination?.name}
            </Typography>
          )}
          {waitingConfirmation && (
            <Typography variant="subtitle2" color="textSecondary">
              Waiting for transaction confirmation...
            </Typography>
          )}
          {txHash && (
            <Typography variant="subtitle2" color="textSecondary">
              <ExternalLink
                href={getExplorerTxUrl(info?.destination?.slug, txHash)}
                linkText={'View transaction ↗'}
              />
            </Typography>
          )}
        </div>
      </div>
      <div className={styles.action}>
        <Button className={styles.doneButton} onClick={handleClose} disabled={!txHash} large>
          Done
        </Button>
      </div>
    </div>
  )
}

export default WithdrawReview
