import React, { FC, useState, useMemo, useEffect, ChangeEvent, useCallback } from 'react'
import Button from 'src/components/buttons/Button'
import SendIcon from '@material-ui/icons/Send'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import SendAmountSelectorCard from 'src/pages/Send/SendAmountSelectorCard'
import Alert from 'src/components/alert/Alert'
import TxStatusModal from 'src/components/modal/TxStatusModal'
import DetailRow from 'src/components/InfoTooltip/DetailRow'
import { BigNumber } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import logger from 'src/logger'
import { commafy, sanitizeNumericalString, toTokenDisplay } from 'src/utils'
import useSendData from 'src/pages/Send/useSendData'
import { FeeDetails, AmmDetails } from 'src/components/InfoTooltip'
import { amountToBN, formatError } from 'src/utils/format'
import { useSendStyles } from './useSendStyles'
import SendHeader from './SendHeader'
import CustomRecipientDropdown from './CustomRecipientDropdown'
import { Div, Flex } from 'src/components/ui'
import { useSendTransaction } from './useSendTransaction'
import {
  useAssets,
  useApprove,
  useNeedsTokenForFee,
  useBalance,
  useEstimateTxCost,
  useTxResult,
  useSufficientBalance,
  useDisableTxs,
  useGnosisSafeTransaction,
  useChainSelector,
  useWarningErrorInfo,
  useDisplayedAmounts,
} from 'src/hooks'
import { ButtonsWrapper } from 'src/components/buttons/ButtonsWrapper'
import useAvailableLiquidity from './useAvailableLiquidity'
import useIsSmartContractWallet from 'src/hooks/useIsSmartContractWallet'
import { ExternalLink } from 'src/components/Link'
import L1CanonicalBridgeOption from './L1CanonicalBridgeOption'
import { useL1CanonicalBridge } from './useL1CanonicalBridge'

const Send: FC = () => {
  const styles = useSendStyles()
  const {
    networks,
    txConfirm,
    txHistory,
    sdk,
    bridges,
    selectedBridge,
    setSelectedBridge,
    settings,
  } = useApp()
  const { slippageTolerance, deadline } = settings
  const { address } = useWeb3Context()
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>()
  const [customRecipient, setCustomRecipient] = useState<string>()
  const [approving, setApproving] = useState<boolean>(false)

  const { isSmartContractWallet } = useIsSmartContractWallet()
  const {
    sourceChain,
    destinationChain,
    handleBridgeChange,
    handleSwitchDirection,
    handleSourceChainChange,
    handleDestinationChainChange,
  } = useChainSelector({ networks, bridges, setSelectedBridge })
  const { disabledTx } = useDisableTxs(sourceChain, destinationChain)
  const needsTokenForFee = useNeedsTokenForFee(sourceChain)

  // Get assets
  const { unsupportedAsset, sourceToken, destinationToken, placeholderToken } = useAssets(
    selectedBridge,
    sourceChain,
    destinationChain
  )

  // Set sourceTokenAmount -> BN
  const sourceTokenAmountBN = useMemo<BigNumber | undefined>(() => {
    if (sourceTokenAmount && sourceToken) {
      return amountToBN(sourceTokenAmount, sourceToken.decimals)
    }
  }, [sourceToken, sourceTokenAmount])

  // Get token balances for both networks
  const { balance: fromBalance, loading: loadingFromBalance } = useBalance(
    sourceToken,
    address,
    sourceChain?.chainId
  )
  const { balance: toBalance, loading: loadingToBalance } = useBalance(
    destinationToken,
    address,
    destinationChain?.chainId
  )

  // ==============================================================================================
  // Displayed data
  // ==============================================================================================

  // Use send data for tx
  const {
    amountOut,
    rate,
    priceImpact,
    amountOutMin,
    intermediaryAmountOutMin,
    adjustedBonderFee,
    adjustedDestinationTxFee,
    totalFee,
    requiredLiquidity,
    loading: loadingSendData,
    estimatedReceived,
    error: sendDataError,
  } = useSendData(
    sourceToken,
    slippageTolerance,
    sourceChain,
    destinationChain,
    sourceTokenAmountBN
  )

  // Get available liquidity
  const {
    availableLiquidity,
    sufficientLiquidity,
    warning: liquidityWarning,
  } = useAvailableLiquidity(
    selectedBridge,
    sourceToken,
    sourceChain,
    destinationChain,
    requiredLiquidity
  )

  const checkingLiquidity = useMemo(() => {
    return !sourceChain?.isLayer1 && availableLiquidity === undefined
  }, [sourceChain, availableLiquidity])

  const {
    destinationAmount,
    setDestinationAmount,
    amountOutMinDisplay,
    destinationTxFeeDisplay,
    bonderFeeDisplay,
    totalBonderFeeDisplay,
    estimatedReceivedDisplay,
  } = useDisplayedAmounts({
    destinationToken,
    amountOut,
    amountOutMin,
    estimatedReceived,
    adjustedDestinationTxFee,
    adjustedBonderFee,
    sourceTokenAmount: sourceTokenAmountBN,
  })

  // ==============================================================================================
  // Error and warning messages
  // ==============================================================================================

  const {
    warning,
    setWarning,
    error,
    setError,
    manualError,
    setManualError,
    manualWarning,
    setManualWarning,
    minimumSendWarning,
    info,
    setInfo,
  } = useWarningErrorInfo({
    sourceChain,
    destinationChain,
    unsupportedAsset,
    customRecipient,
    destinationTxFeeDisplay,
    estimatedReceived,
    adjustedDestinationTxFee,
    sendDataError,
    sourceToken,
    sourceTokenAmount: sourceTokenAmountBN,
    sourceTokenBalance: fromBalance,
  })

  // ==============================================================================================
  // Send tokens
  // ==============================================================================================

  const { tx, setTx, send, sending, setSending } = useSendTransaction({
    amountOutMin,
    customRecipient,
    deadline,
    totalFee,
    sourceChain,
    sourceTokenAmount,
    intermediaryAmountOutMin,
    sdk,
    setError,
    sourceToken,
    destinationChain,
    txConfirm,
    txHistory,
    estimatedReceived: estimatedReceivedDisplay,
  })

  useEffect(() => {
    if (tx) {
      // clear from token input field
      setSourceTokenAmount('')
    }
  }, [tx])

  const { gnosisEnabled, gnosisSafeWarning, isCorrectSignerNetwork } = useGnosisSafeTransaction(
    sourceChain,
    destinationChain,
    customRecipient
  )

  const {
    l1CanonicalBridge,
    sendL1CanonicalBridge,
    usingNativeBridge,
    selectNativeBridge,
    approveNativeBridge,
    needsNativeBridgeApproval,
    estimateApproveNativeBridge,
    estimateSendNativeBridge,
  } = useL1CanonicalBridge({
    sdk,
    sourceToken,
    sourceTokenAmount: sourceTokenAmountBN,
    sourceChain,
    destinationChain,
    estimatedReceived,
    txConfirm,
    customRecipient,
    approving,
    setApproving,
    setSending,
    setTx,
    setError,
  })

  // ==============================================================================================
  // Approve sourceChain / sourceToken
  // ==============================================================================================

  const { needsApproval, approveSourceToken } = useApprove(
    sourceToken,
    sourceChain,
    sourceTokenAmountBN,
    setApproving,
    approving,
    usingNativeBridge,
    destinationChain
  )

  // ==============================================================================================
  // Tx Estimations
  // ==============================================================================================

  const { estimateSend, estimateApprove, estimateTxError } = useEstimateTxCost({
    sourceChain,
    sourceToken,
    sourceTokenAmount: sourceTokenAmountBN,
    usingNativeBridge,
    needsNativeBridgeApproval,
    l1CanonicalBridge,
    destinationChain,
  })

  const { estimatedGasLimit } = useTxResult({
    sourceToken,
    sourceChain,
    destinationChain,
    sourceTokenAmount: sourceTokenAmountBN,
    estimateFns: {
      usingNativeBridge,
      needsNativeBridgeApproval,
      needsApproval,
      estimateApprove,
      estimateApproveNativeBridge,
      estimateSend,
      estimateSendNativeBridge,
    },
  })

  const { sufficientBalance, sufficientBalanceWarning } = useSufficientBalance({
    sourceChain,
    sourceToken,
    sourceTokenAmount: sourceTokenAmountBN,
    destinationChain,
    estimatedGasLimit,
    tokenBalance: fromBalance,
    isSmartContractWallet,
    usingNativeBridge,
    needsNativeBridgeApproval,
    needsApproval,
    l1CanonicalBridge,
  })

  const { sufficientBalanceForNativeDeposit, sufficientBalanceForNativeDepositWarning } =
    useSufficientBalance({
      sourceChain,
      sourceToken,
      sourceTokenAmount: sourceTokenAmountBN,
      destinationChain,
      estimatedGasLimit,
      tokenBalance: fromBalance,
      isSmartContractWallet,
      usingNativeBridge,
      needsNativeBridgeApproval,
      needsApproval,
      l1CanonicalBridge,
    })

  // ==============================================================================================
  // More warning messages
  // ==============================================================================================

  useEffect(() => {
    let message =
      liquidityWarning ||
      minimumSendWarning ||
      sufficientBalanceWarning ||
      sufficientBalanceForNativeDepositWarning

    const isFavorableSlippage = Number(destinationAmount) >= Number(sourceTokenAmount)
    const isHighPriceImpact = priceImpact && priceImpact !== 100 && Math.abs(priceImpact) >= 1
    const showPriceImpactWarning = isHighPriceImpact && !isFavorableSlippage

    if (estimatedReceived && adjustedBonderFee?.gt(estimatedReceived)) {
      message = 'Bonder fee greater than estimated received'
    } else if (estimatedReceived?.lte(0)) {
      message = 'Estimated received too low. Send a higher amount to cover the fees.'
    } else if (showPriceImpactWarning) {
      message = `Warning: Price impact is high. Slippage is ${commafy(priceImpact)}%`
    }

    setWarning(message)

    if (estimateTxError) {
      setError(estimateTxError)
    }
  }, [
    liquidityWarning,
    minimumSendWarning,
    sufficientBalanceWarning,
    sufficientBalanceForNativeDepositWarning,
    estimatedReceived,
    adjustedBonderFee,
    priceImpact,
    sourceTokenAmount,
    destinationAmount,
    estimateTxError,
  ])

  // ==============================================================================================
  // Approval
  // ==============================================================================================

  const handleApprove = () => {
    setError(null)

    try {
      if (l1CanonicalBridge && usingNativeBridge && needsNativeBridgeApproval) {
        return approveNativeBridge()
      } else {
        return approveSourceToken()
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, sourceChain))
      }
      logger.error(err)
    }
  }

  const handleSend = () => {
    setError(null)

    try {
      if (l1CanonicalBridge && usingNativeBridge) {
        return sendL1CanonicalBridge()
      } else {
        return send()
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, sourceChain))
      }
      logger.error(err)
    }
  }
  // ==============================================================================================
  // Buttons enabled
  // ==============================================================================================

  const usingNativeBridgeAndNeedsApprovalOrUsingHopAndNeedsApproval = useMemo(() => {
    return (
      (usingNativeBridge && needsNativeBridgeApproval === true) ||
      (usingNativeBridge === false && needsApproval === true)
    )
  }, [usingNativeBridge, needsNativeBridgeApproval, needsApproval])

  const approveButtonActive = useMemo(() => {
    return (
      !manualWarning &&
      !manualError &&
      ((usingNativeBridge && usingNativeBridgeAndNeedsApprovalOrUsingHopAndNeedsApproval) ||
        (needsApproval === true && !unsupportedAsset && !needsTokenForFee))
    )
  }, [
    manualError,
    manualWarning,
    needsApproval,
    usingNativeBridge,
    usingNativeBridgeAndNeedsApprovalOrUsingHopAndNeedsApproval,
    needsTokenForFee,
    unsupportedAsset,
  ])

  const sufficientBalanceForNBDeposit = useMemo(() => {
    return usingNativeBridge && sufficientBalanceForNativeDeposit
  }, [usingNativeBridge, sufficientBalanceForNativeDeposit])

  const sendButtonActive = useMemo(() => {
    return !!(
      !approveButtonActive &&
      address &&
      ((!usingNativeBridge && !needsApproval) ||
        (usingNativeBridge && !needsNativeBridgeApproval)) &&
      !unsupportedAsset &&
      !checkingLiquidity &&
      !loadingToBalance &&
      !loadingSendData &&
      sourceTokenAmount &&
      destinationAmount &&
      rate &&
      (sufficientBalanceForNBDeposit === true || sufficientBalance) &&
      sufficientLiquidity &&
      estimatedReceived?.gt(0) &&
      !manualError &&
      (!disabledTx || disabledTx.warningOnly) &&
      (gnosisEnabled ? isCorrectSignerNetwork : !isSmartContractWallet)
    )
  }, [
    approveButtonActive,
    address,
    usingNativeBridge,
    needsNativeBridgeApproval,
    needsApproval,
    unsupportedAsset,
    checkingLiquidity,
    loadingToBalance,
    loadingSendData,
    sourceTokenAmount,
    destinationAmount,
    rate,
    sufficientBalance,
    sufficientBalanceForNBDeposit,
    sufficientLiquidity,
    estimatedReceived,
    manualError,
    disabledTx,
    gnosisEnabled,
    isCorrectSignerNetwork,
    isSmartContractWallet,
  ])

  return (
    <Flex column alignCenter>
      <SendHeader
        styles={styles}
        bridges={bridges}
        selectedBridge={selectedBridge}
        handleBridgeChange={handleBridgeChange}
      />

      <SendAmountSelectorCard
        value={sourceTokenAmount}
        token={sourceToken ?? placeholderToken}
        label={'From'}
        onChange={value => {
          if (!value) {
            setSourceTokenAmount('')
            setDestinationAmount('')
            return
          }
          setSourceTokenAmount(sanitizeNumericalString(value))
        }}
        selectedNetwork={sourceChain}
        networkOptions={networks}
        onNetworkChange={handleSourceChainChange}
        balance={fromBalance}
        loadingBalance={loadingFromBalance}
        deadline={deadline}
        destinationChain={destinationChain}
        sourceChain={sourceChain}
        setWarning={setWarning}
      />

      <Flex justifyCenter alignCenter my={1} onClick={handleSwitchDirection} pointer hover>
        <ArrowDownIcon color="primary" className={styles.downArrow} />
      </Flex>

      <SendAmountSelectorCard
        value={usingNativeBridge ? sourceTokenAmount : destinationAmount}
        token={destinationToken ?? placeholderToken}
        label={'To (estimated)'}
        selectedNetwork={destinationChain}
        networkOptions={networks}
        onNetworkChange={handleDestinationChainChange}
        balance={toBalance}
        loadingBalance={loadingToBalance}
        loadingValue={loadingSendData}
        estimateSend={estimateSend}
        disableInput
      />

      {sourceChain?.isLayer1 && (
        <L1CanonicalBridgeOption
          amount={sourceTokenAmountBN}
          l1CanonicalBridge={l1CanonicalBridge}
          destToken={destinationToken}
          destinationChain={destinationChain}
          selectNativeBridge={selectNativeBridge}
          estimatedReceivedDisplay={estimatedReceivedDisplay}
          usingNativeBridge={usingNativeBridge}
        />
      )}

      <CustomRecipientDropdown
        styles={styles}
        customRecipient={customRecipient}
        setCustomRecipient={setCustomRecipient}
        isOpen={isSmartContractWallet}
        setError={setError}
      />

      <div className={styles.details}>
        <div className={styles.destinationTxFeeAndAmount}>
          <DetailRow
            title={'Fees'}
            tooltip={
              <FeeDetails bonderFee={bonderFeeDisplay} destinationTxFee={destinationTxFeeDisplay} />
            }
            value={totalBonderFeeDisplay}
            large
          />

          <DetailRow
            title="Estimated Received"
            tooltip={
              usingNativeBridge ? undefined : (
                <AmmDetails
                  rate={rate}
                  slippageTolerance={slippageTolerance}
                  priceImpact={priceImpact}
                  amountOutMinDisplay={amountOutMinDisplay}
                />
              )
            }
            value={
              usingNativeBridge
                ? toTokenDisplay(
                    sourceTokenAmountBN,
                    sourceToken?.decimals,
                    destinationToken?.symbol
                  )
                : estimatedReceivedDisplay
            }
            xlarge
            bold
          />
        </div>
      </div>

      <div className={styles.smartContractWalletWarning}>
        <Alert severity={gnosisSafeWarning.severity}>{gnosisSafeWarning.text}</Alert>
      </div>

      {disabledTx && (
        <Alert severity={disabledTx.warningOnly ? 'warning' : 'error'}>
          <ExternalLink
            href={disabledTx.message?.href}
            text={disabledTx.message?.text}
            linkText={disabledTx.message?.linkText}
            postText={disabledTx.message?.postText}
          />
        </Alert>
      )}

      <Alert severity="error" onClose={() => setError(null)} text={error} />
      {!error && (
        <Alert severity="warning" onClose={() => setWarning(null)}>
          {warning}
        </Alert>
      )}
      <Alert severity="warning" onClose={() => setManualWarning(null)}>
        {manualWarning}
      </Alert>
      <Alert severity="error" onClose={() => setManualError(null)}>
        {manualError}
      </Alert>

      <ButtonsWrapper>
        {!sendButtonActive && (
          <Div mb={[3]} fullWidth={!!approveButtonActive}>
            <Button
              className={styles.button}
              large
              highlighted={approveButtonActive}
              disabled={!approveButtonActive}
              onClick={handleApprove}
              loading={approving}
              fullWidth
            >
              Approve
            </Button>
          </Div>
        )}

        <Div mb={[3]} fullWidth={!!approveButtonActive || !!sendButtonActive}>
          <Button
            className={styles.button}
            startIcon={sendButtonActive && <SendIcon />}
            onClick={handleSend}
            disabled={!sendButtonActive}
            loading={sending}
            large
            fullWidth
            highlighted
          >
            {address ? 'Send' : 'Connect Wallet'}
          </Button>
        </Div>
      </ButtonsWrapper>

      <Flex mt={1}>
        <Alert severity="info" onClose={() => setInfo(null)} text={info} />
        {tx && <TxStatusModal onClose={() => setTx(undefined)} tx={tx} />}
      </Flex>
    </Flex>
  )
}

export default Send
