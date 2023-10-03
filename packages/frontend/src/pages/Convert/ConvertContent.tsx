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
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'
import { ChainSlug } from '@hop-protocol/sdk'
import { MethodNames, useGnosisSafeTransaction } from 'src/hooks'
import useCheckTokenDeprecated from 'src/hooks/useCheckTokenDeprecated'
import { Div, Flex } from 'src/components/ui'
import { ButtonsWrapper } from 'src/components/buttons/ButtonsWrapper'
import AmmConvertOption from 'src/pages/Convert/ConvertOption/AmmConvertOption'
import HopConvertOption from 'src/pages/Convert/ConvertOption/HopConvertOption'
import CustomRecipientDropdown from 'src/pages/Send/CustomRecipientDropdown'
import useIsSmartContractWallet from 'src/hooks/useIsSmartContractWallet'
import IconButton from '@material-ui/core/IconButton'

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
    marginBottom: '0'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: '0',
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
  customRecipientBox: {
    marginBottom: '5.4rem',
  },
  detailRow: {},
  detailLabel: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  detailsDropdown: {
    width: '51.6rem',
    marginTop: '2rem',
    '&[open] summary span::before': {
      content: '"▾"',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  detailsDropdownSummary: {
    listStyle: 'none',
    display: 'block',
    textAlign: 'right',
    fontWeight: 'normal',
    paddingRight: '4rem',
    '&::marker': {
      display: 'none',
    },
  },
  detailsDropdownLabel: {
    position: 'relative',
    cursor: 'pointer',
    '& > span': {
      position: 'relative',
      display: 'inline-flex',
      justifyItems: 'center',
      alignItems: 'center',
    },
    '& > span::before': {
      display: 'block',
      content: '"▸"',
      position: 'absolute',
      top: '0',
      right: '-1.5rem',
    },
  },
  customRecipient: {
    width: '51.6rem',
    marginTop: '1rem',
    boxSizing: 'border-box',
    borderRadius: '3rem',
    boxShadow: theme.boxShadow.inner,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  customRecipientLabel: {
    textAlign: 'right',
    marginBottom: '1.5rem',
  },
  smartContractWalletWarning: {
    marginTop: theme.padding.light,
  },
  pausedWarning: {
    marginTop: theme.padding.light,
  }
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
    assetWithoutAmm,
    validFormFields,
    warning,
    convertOption,
    destinationChainPaused
  } = useConvert()
  const [manualWarning, setManualWarning] = useState<string>('')
  const [customRecipient, setCustomRecipient] = useState<string>('')
  const { isSmartContractWallet } = useIsSmartContractWallet()
  const { gnosisEnabled, gnosisSafeWarning, isCorrectSignerNetwork } = useGnosisSafeTransaction(
    tx,
    customRecipient,
    sourceNetwork,
    destNetwork
  )

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
    convertTokens(customRecipient)
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

  const handleCustomRecipientInput = (event: any) => {
    const value = event.target.value.trim()
    setCustomRecipient(value)
  }

  const isTokenDeprecated = useCheckTokenDeprecated(normalizeTokenSymbol(sourceToken?._symbol ?? ''))

  const sendableWarning = !warning || (warning as any)?.startsWith('Warning:')
  const sendButtonActive =
    validFormFields && !unsupportedAsset && !needsApproval && sendableWarning && !error && !manualWarning && (gnosisEnabled ? isCorrectSignerNetwork : true)

  const approvalButtonActive = !needsTokenForFee && needsApproval && validFormFields
  const allowCustomRecipient = convertOption?.slug === 'hop-bridge'

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {(unsupportedAsset || (assetWithoutAmm && convertOption instanceof AmmConvertOption) || (isTokenDeprecated && convertOption instanceof HopConvertOption)) ? (
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
          <Box display="flex" style={{ position: 'relative' }}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton onClick={switchDirection} title="Click to switch direction">
                <ArrowDownIcon color="primary" className={styles.downArrow} />
              </IconButton>
            </Box>
            <Box style={{ position: 'absolute', left: '65px', top: '22px', width: '200px' }} onClick={switchDirection}>
              <Typography variant="body2" style={{ opacity: '0.2' }}>click to switch direction</Typography>
            </Box>
          </Box>
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

          <Box className={styles.customRecipientBox}>
            {allowCustomRecipient && (
              <CustomRecipientDropdown
                styles={styles}
                customRecipient={customRecipient}
                handleCustomRecipientInput={handleCustomRecipientInput}
                isOpen={customRecipient || isSmartContractWallet}
              />
            )}
          </Box>

          <div className={styles.details}>{details}</div>
          <Alert severity="error" onClose={() => setError()} text={error} />
          <Alert severity="warning">{warning}</Alert>
          <Alert severity="error">{manualWarning}</Alert>
          {allowCustomRecipient && (
            <div className={styles.smartContractWalletWarning}>
              <Alert severity={gnosisSafeWarning.severity}>{gnosisSafeWarning.text}</Alert>
            </div>
          )}
          {destinationChainPaused && (
            <div className={styles.pausedWarning}>
              <Alert severity="warning">Deposits to destination chain {destNetwork?.name} are currently paused. Please check official announcement channels for status updates.</Alert>
            </div>
          )}
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
