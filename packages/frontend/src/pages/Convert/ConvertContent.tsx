import React, { FC, useEffect } from 'react'
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import MuiButton from '@material-ui/core/Button'
import SendButton from 'src/pages/Convert/SendButton'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import Alert from 'src/components/alert/Alert'
import TxStatusModal from 'src/components/txStatus/TxStatusModal'
import DetailRow from 'src/components/DetailRow'
import { useConvert } from 'src/pages/Convert/ConvertContext'
import { commafy, normalizeNumberInput } from 'src/utils'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem'
  },
  switchDirectionButton: {
    padding: 0,
    minWidth: 0,
    margin: '1.0rem'
  },
  downArrow: {
    margin: '0.8rem',
    height: '2.4rem',
    width: '2.4rem'
  },
  lastSelector: {
    marginBottom: '5.4rem'
  },
  details: {
    marginBottom: theme.padding.thick,
    width: '46.0rem',
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    }
  },
}))

const Convert: FC = () => {
  const styles = useStyles()
  const {
    sourceNetwork,
    destNetwork,
    sourceToken,
    destToken,
    sourceTokenAmount,
    setSourceTokenAmount,
    destTokenAmount,
    setDestTokenAmount,
    sourceBalance,
    loadingSourceBalance,
    destBalance,
    loadingDestBalance,
    switchDirection,
    details,
    warning,
    error,
    setError,
    tx,
    setTx
  } = useConvert()
  const { path } = useRouteMatch()

  useEffect(() => {
    setSourceTokenAmount('')
    setDestTokenAmount('')
  }, [setSourceTokenAmount, setDestTokenAmount])

  const handleSourceTokenAmountChange = async (amount: string) => {
    try {
      const normalizedAmount = normalizeNumberInput(amount)
      setSourceTokenAmount(normalizedAmount)
    } catch (err) {}
  }

  const handleTxStatusClose = () => {
    setTx(undefined)
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <AmountSelectorCard
        value={sourceTokenAmount as string}
        token={sourceToken}
        label={'From'}
        onChange={handleSourceTokenAmountChange}
        title={sourceNetwork?.name}
        titleIconUrl={sourceNetwork?.imageUrl}
        balance={sourceBalance}
        loadingBalance={loadingSourceBalance}
      />
      <MuiButton
        className={styles.switchDirectionButton}
        onClick={switchDirection}
      >
        <ArrowDownIcon color="primary" className={styles.downArrow} />
      </MuiButton>
      <AmountSelectorCard
        className={styles.lastSelector}
        value={destTokenAmount as string}
        token={destToken}
        label={'To'}
        title={destNetwork?.name}
        titleIconUrl={destNetwork?.imageUrl}
        balance={destBalance}
        loadingBalance={loadingDestBalance}
        disableInput
      />
      <div className={styles.details}>
        {details}
      </div>
      <Alert severity="warning">
        {warning}
      </Alert>
      <Alert severity="error" onClose={() => setError(undefined)} text={error} />
      <TxStatusModal
        onClose={handleTxStatusClose}
        tx={tx} />
      <SendButton />
    </Box>
  )
}

export default Convert
