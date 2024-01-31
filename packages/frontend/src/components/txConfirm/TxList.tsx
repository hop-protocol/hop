import Box from '@mui/material/Box'
import Check from '@mui/icons-material/Check'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'
import CropSquare from '@mui/icons-material/CropSquare'
import React, { useEffect, useState } from 'react'
import Step from '@mui/material/Step';
import StepIcon from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography'
import { Alert } from 'src/components/Alert'
import { Button } from 'src/components/Button'
import { formatError } from 'src/utils'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  root: {
  },
  stepper: {
    '& .MuiStepConnector-root': {
      marginLeft: '7px'
    }
  }
}))

interface Props {
  title: string
  txList: any[]
  onConfirm: (confirmed: boolean) => void
}

export function TxList (props: Props) {
  const { onConfirm, txList: _txList, title } = props
  const styles = useStyles()
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [txList, setTxList] = useState([..._txList])
  const [statusText, setStatusText] = useState('')

  async function runTxList() {
    setRunning(true)
    setError('')
    for (const item of txList) {
      try {
        if (item.status === 'success') {
          continue
        }
        item.status = 'pending'
        setTxList([...txList])
        setStatusText('Confirm the transaction in your wallet to continue')
        const tx = await item.fn()
        if (tx?.wait) {
          setStatusText('Waiting for transaction confirmation')
        }
        await tx?.wait()
        item.status = 'success'
        setTxList([...txList])
      } catch (err) {
        item.status = 'error'
        setTxList([...txList])
        setError(formatError(err))
        break
      }
    }
  }

  useEffect(() => {
    if (running) {
      return
    }
    runTxList().catch(console.error)
  }, [])

  const complete = txList.every((item) => item.status === 'success')
  const showRetry = txList.some((item) => item.status === 'error')

  function handleClose() {
    if (onConfirm) {
      onConfirm(true)
    }
  }

  function handleRetry() {
    runTxList().catch(console.error)
  }

  const activeStep = txList.findIndex((item) => item.status !== 'success')

  let finalIcon = <CropSquare fontSize="inherit" style={{ color: '#D9D9D9' }} />
  if (complete) {
    finalIcon = <Check fontSize="inherit" style={{ color: '#04BB00' }} />
  }

  return (
    <Box className={styles.root}>
      <Box mb={4} display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h4" color="textPrimary">
          {title}
        </Typography>
      </Box>
      <Box margin={'0 auto'} maxWidth="350px">
        <Stepper orientation="vertical" activeStep={activeStep} className={styles.stepper}>
          {txList.map((tx, index) => {
            const active = index <= activeStep
            let icon = <CropSquare fontSize="inherit" style={{ color: '#D9D9D9' }}/>
            if (tx.status === 'pending') {
              icon = <CircularProgress size={26} />
            } else if (tx.status === 'success') {
              icon = <Check fontSize="inherit" style={{ color: '#04BB00' }} />
            } else if (tx.status === 'error') {
              icon = <CloseIcon fontSize="inherit" style={{ color: '#cd5151' }} />
            }
            return (
              <Step key={tx.label}>
                <StepLabel icon={
                  <StepIcon icon="" active={active} />
                  }>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Typography variant="h6">
                        {tx.label}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ fontSize: '3rem' }}>
                      {icon}
                    </Box>
                  </Box>
                </StepLabel>
              </Step>
            )
          })}
          <Step>
            <StepLabel icon={
              <StepIcon icon="" active={complete} />
              }>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography variant="h6">
                    Complete ✨
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" style={{ fontSize: '3rem' }}>
                  {finalIcon}
                </Box>
              </Box>
            </StepLabel>
          </Step>
        </Stepper>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="subtitle1" color="secondary">
          {complete ? 'All transactions are completed' : statusText}
        </Typography>
      </Box>
      <Box mt={2}>
        <Alert severity="error" onClose={() => setError('')} text={error} />
      </Box>
      {complete && (
        <Box mt={2}>
          <Button
            onClick={handleClose}
            large
            highlighted
          >
            Done
          </Button>
        </Box>
      )}
      {showRetry && (
        <Box mt={2}>
          <Button
            onClick={handleRetry}
            large
            highlighted
          >
            Retry
          </Button>
        </Box>
      )}
    </Box>
  )
}
