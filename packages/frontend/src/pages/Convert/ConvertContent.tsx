import React, { FC, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import Button from 'src/components/buttons/Button'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import Alert from 'src/components/alert/Alert'
import TxStatusModal from 'src/components/modal/TxStatusModal'
import { useConvert } from 'src/pages/Convert/ConvertContext'
import TokenWrapper from 'src/components/TokenWrapper'
import { sanitizeNumericalString } from 'src/utils'
import { ChainSlug } from '@hop-protocol/sdk'
import { MethodNames } from 'src/hooks'
import { Div, Flex } from 'src/components/ui'
import { ButtonsWrapper } from 'src/components/buttons/ButtonsWrapper'

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
    minWidth: '17.5rem',
  },
}))

const ConvertContent: FC = () => {
  const styles = useStyles()
  const {
    approveTokens,
    approving,
    convertTokens,
    destBalance,
    destNetwork,
    destToken,
    destTokenAmount,
    details,
    error,
    loadingDestBalance,
    loadingSourceBalance,
    needsApproval,
    needsTokenForFee,
    sending,
    setDestTokenAmount,
    setError,
    setSourceTokenAmount,
    setTx,
    setWarning,
    sourceBalance,
    sourceNetwork,
    sourceToken,
    sourceTokenAmount,
    switchDirection,
    tx,
    unsupportedAsset,
    validFormFields,
    warning,
  } = useConvert()
  const [manualWarning, setManualWarning] = useState<string>('')

  useEffect(() => {
    setSourceTokenAmount('')
    setDestTokenAmount('')
  }, [setSourceTokenAmount, setDestTokenAmount])

  const handleSourceTokenAmountChange = async (amount: string) => {
    try {
      const normalizedAmount = sanitizeNumericalString(amount)
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

  useEffect(() => {
    if (sourceNetwork?.slug === ChainSlug.Polygon || destNetwork?.slug === ChainSlug.Polygon) {
      return setManualWarning('')
      // return setManualWarning('Warning: transfers to/from Polygon are temporarily down.')
    }
    setManualWarning('')
  }, [destNetwork?.slug, sourceNetwork?.slug])

  const sendableWarning = !warning || (warning as any)?.startsWith('Warning:')
  const sendButtonActive =
    validFormFields && !unsupportedAsset && !needsApproval && sendableWarning && !error && !manualWarning

  const approvalButtonActive = !needsTokenForFee && needsApproval && validFormFields

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
            methodName={MethodNames.convertTokens}
            selectedNetwork={sourceNetwork}
            destNetwork={destNetwork}
          />
          <Flex justifyCenter alignCenter my={1} onClick={switchDirection} pointer hover>
            <ArrowDownIcon color="primary" className={styles.downArrow} />
          </Flex>
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
          <Alert severity="error" onClose={() => setError()} text={error} />
          <Alert severity="warning">{warning}</Alert>
          <Alert severity="error">{manualWarning}</Alert>
          {tx && <TxStatusModal onClose={handleTxStatusClose} tx={tx} />}

          <ButtonsWrapper>
            {!sendButtonActive && (
              <Div mb={[3]} fullWidth={approvalButtonActive}>
                <Button
                  className={styles.button}
                  large
                  highlighted={!!needsApproval}
                  disabled={!approvalButtonActive}
                  onClick={handleApprove}
                  loading={approving}
                  fullWidth
                >
                  Approve
                </Button>
              </Div>
            )}

            <Div mb={[3]} fullWidth={sendButtonActive}>
              <Button
                className={styles.button}
                onClick={handleSend}
                disabled={!sendButtonActive}
                loading={sending}
                large
                highlighted
                fullWidth
              >
                Convert
              </Button>
            </Div>
          </ButtonsWrapper>
        </>
      )}
    </Box>
  )
}

export default ConvertContent
