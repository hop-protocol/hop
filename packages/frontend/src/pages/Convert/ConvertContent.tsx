import ArrowDownIcon from '@mui/icons-material/ArrowDownwardRounded'
import Box from '@mui/material/Box'
import CustomRecipientDropdown from 'src/pages/Send/CustomRecipientDropdown'
import HopConvertOption from 'src/pages/Convert/ConvertOption/HopConvertOption'
import IconButton from '@mui/material/IconButton'
import React, { FC, useEffect, useState } from 'react'
import TokenWrapper from 'src/components/TokenWrapper'
import Typography from '@mui/material/Typography'
import useIsSmartContractWallet from 'src/hooks/useIsSmartContractWallet'
import { Alert } from 'src/components/Alert'
import { AmountSelectorCard } from 'src/components/AmountSelectorCard'
import { Button } from 'src/components/Button'
import { ButtonsWrapper } from 'src/components/Button/ButtonsWrapper'
import { ConnectWalletButton } from 'src/components/Header/ConnectWalletButton'
import { MethodNames, useGnosisSafeTransaction } from 'src/hooks'
import { TxStatusModal } from 'src/components/Modal/TxStatusModal'
import { makeStyles } from '@mui/styles'
import { sanitizeNumericalString } from 'src/utils'
import { useCheckPoolDeprecated } from 'src/hooks/useCheckPoolDeprecated'
import { useConvert } from 'src/pages/Convert/ConvertContext'

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
    height: '2.4rem !important',
    width: '2.4rem !important',
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
    address,
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
    destinationChainPaused,
    info
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
    // uncomment and set custom warning here
    // if (sourceNetwork?.slug === ChainSlug.Polygon || destNetwork?.slug === ChainSlug.Polygon) {
    //   return setManualWarning('Warning: transfers to/from Polygon are temporarily down.')
    // }
    setManualWarning('')
  }, [destNetwork?.slug, sourceNetwork?.slug])

  const handleCustomRecipientInput = (event: any) => {
    const value = event.target.value.trim()
    setCustomRecipient(value)
  }

  const isTokenDeprecated = useCheckPoolDeprecated(sourceToken?._symbol)
  const specificRouteDeprecated = isTokenDeprecated && convertOption instanceof HopConvertOption && sourceNetwork?.isL1

  const sendableWarning = !warning || (warning as string)?.startsWith('Warning:')

  const checkSendButtonActive = () => (validFormFields && !unsupportedAsset && !needsApproval && sendableWarning && !error && !manualWarning && (gnosisEnabled ? isCorrectSignerNetwork : true) && !specificRouteDeprecated)
  const [sendButtonActive, setSendButtonActive] = useState(checkSendButtonActive())

  useEffect(() => {
    setSendButtonActive(checkSendButtonActive())
  }, [validFormFields, unsupportedAsset, needsApproval, sendableWarning, error, manualWarning, gnosisEnabled, isCorrectSignerNetwork, specificRouteDeprecated])

  const checkApprovalButtonActive = () => (!needsTokenForFee && needsApproval && validFormFields && !specificRouteDeprecated)
  const [approvalButtonActive, setApprovalButtonActive] = useState(checkApprovalButtonActive())

  useEffect(() => {
    setApprovalButtonActive(checkApprovalButtonActive())
  }, [needsTokenForFee, needsApproval, validFormFields, specificRouteDeprecated])

  const allowCustomRecipient = convertOption?.slug === 'hop-bridge'

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {(unsupportedAsset || assetWithoutAmm) ? (
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
            disableInput={specificRouteDeprecated}
          />
          <Box display="flex" style={{ position: 'relative' }}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton onClick={switchDirection} title="Click to switch direction">
                <ArrowDownIcon color="primary" className={styles.downArrow} />
              </IconButton>
            </Box>
            <Box style={{ position: 'absolute', left: '65px', top: '20px', width: '200px' }} onClick={switchDirection}>
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

          {!error && <Box className={styles.details}>{details}</Box>}
          <Alert severity="info">{info}</Alert>
          <Alert severity="error" onClose={() => setError()} text={error} />
          <Alert severity="warning">{warning}</Alert>
          <Alert severity="error">{manualWarning}</Alert>
          {allowCustomRecipient && (
            <Box className={styles.smartContractWalletWarning}>
              <Alert severity={gnosisSafeWarning.severity}>{gnosisSafeWarning.text}</Alert>
            </Box>
          )}
          {destinationChainPaused && (
            <Box className={styles.pausedWarning}>
              <Alert severity="warning">Deposits to destination chain {destNetwork?.name} are currently paused. Please check official announcement channels for status updates.</Alert>
            </Box>
          )}
          {tx && <TxStatusModal onClose={handleTxStatusClose} tx={tx} />}

          { address
          ? <ButtonsWrapper>
              {!sendButtonActive && (
                <Box mb={3} width={approvalButtonActive ? '100%' : 'auto'}>
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
                </Box>
              )}

              <Box mb={3} width={sendButtonActive ? '100%' : 'auto'}>
                <Button
                  className={styles.button}
                  onClick={handleSend}
                  disabled={!sendButtonActive}
                  large
                  highlighted
                  fullWidth
                >
                  Convert
                </Button>
              </Box>
            </ButtonsWrapper>
          : <ButtonsWrapper>
              <Box mb={3} width="100%">
                <ConnectWalletButton fullWidth large />
              </Box>
            </ButtonsWrapper>
          }
        </>
      )}
    </Box>
  )
}

export default ConvertContent
