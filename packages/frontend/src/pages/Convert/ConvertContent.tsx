import React, { FC, useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import MuiButton from '@material-ui/core/Button'
import Button from 'src/components/buttons/Button'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import Alert from 'src/components/alert/Alert'
import TxStatusModal from 'src/components/txStatus/TxStatusModal'
import DetailRow from 'src/components/DetailRow'
import { useConvert } from 'src/pages/Convert/ConvertContext'
import { commafy, normalizeNumberInput } from 'src/utils'
import TokenWrapper from 'src/components/TokenWrapper'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem',
  },
  switchDirectionButton: {
    padding: 0,
    minWidth: 0,
    margin: '1.0rem',
  },
  downArrow: {
    margin: '0.8rem',
    height: '2.4rem',
    width: '2.4rem',
  },
  lastSelector: {
    marginBottom: '5.4rem',
  },
  details: {
    marginBottom: theme.padding.light,
    width: '46.0rem',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  buttons: {
    marginTop: theme.padding.default,
  },
  button: {
    margin: `0 ${theme.padding.light}`,
    width: '17.5rem',
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
    setTx,
    unsupportedAsset,
    validFormFields,
    approving,
    sending,
    needsApproval,
    convertTokens,
    approveTokens
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

  const handleSend = async () => {
    convertTokens()
  }

  const handleApprove = async () => {
    approveTokens()
  }

  const sendButtonActive = validFormFields && !unsupportedAsset && !needsApproval

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {unsupportedAsset ? (
        <>
          <Typography variant="subtitle1" color="textSecondary" component="div">
            {error}
          </Typography>
        </>
      ) : (
        <>
          <TokenWrapper network={sourceNetwork} />
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
          <MuiButton className={styles.switchDirectionButton} onClick={switchDirection}>
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
          <div className={styles.details}>{details}</div>
          <Alert severity="warning">{warning}</Alert>
          <Alert severity="error" onClose={() => setError(undefined)} text={error} />
          <TxStatusModal onClose={handleTxStatusClose} tx={tx} />
          <Box className={styles.buttons} display="flex" flexDirection="row" alignItems="center">
            <Button
              className={styles.button}
              large
              highlighted={!!needsApproval}
              disabled={!needsApproval}
              onClick={handleApprove}
              loading={approving}
            >
              Approve
            </Button>
            <Button
              className={styles.button}
              startIcon={sendButtonActive}
              onClick={handleSend}
              disabled={!sendButtonActive}
              loading={sending}
              large
              highlighted
            >
              Convert
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Convert
