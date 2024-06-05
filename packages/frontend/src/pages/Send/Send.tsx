import ArrowDownIcon from '@mui/icons-material/ArrowDownwardRounded'
import Box from '@mui/material/Box'
import CustomRecipientDropdown from './CustomRecipientDropdown.js'
import IconButton from '@mui/material/IconButton'
import React, { FC } from 'react'
import SendAmountSelectorCard from '#pages/Send/SendAmountSelectorCard.js'
import SendHeader from './SendHeader.js'
import SendIcon from '@mui/icons-material/Send'
import { Alert } from '#components/Alert/index.js'
import { AmmDetails } from '#components/AmmDetails/index.js'
import { Button } from '#components/Button/index.js'
import { ButtonsWrapper } from '#components/Button/ButtonsWrapper.js'
import { ConnectWalletButton } from '#components/Header/ConnectWalletButton.js'
import { DetailRow } from '#components/InfoTooltip/DetailRow.js'
import { ExternalLink } from '#components/Link/index.js'
import { FeeDetails } from '#components/InfoTooltip/FeeDetails.js'
import { FeeRefund } from './FeeRefund.js'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { TxStatusModal } from '#components/Modal/TxStatusModal.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useSend } from '#pages/Send/useSend.js'
import { useSendStyles } from './useSendStyles.js'

const Send: FC = () => {
  const styles = useSendStyles()
  const { theme } = useApp()
  const {
    accountAddress,
    amountOutMinDisplay,
    amountOutMinUsdDisplay,
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    bridges,
    customRecipient,
    deadline,
    destinationTxFeeDisplay,
    destinationTxFeeUsdDisplay,
    disabledTx,
    error,
    estimatedReceivedDisplay,
    estimatedReceivedUsdDisplay,
    feeRefundDisplay,
    feeRefundTokenSymbol,
    fromAmountInputChangeHandler,
    fromBalance,
    fromNetwork,
    fromToken,
    fromTokenAmount,
    gnosisSafeWarning,
    handleApprove,
    handleBridgeChange,
    handleCustomRecipientInput,
    handleFromNetworkChange,
    handleSwitchDirection,
    handleToNetworkChange,
    info,
    isApproveButtonActive,
    isApproving,
    isDestinationChainPaused,
    isLoadingFromBalance,
    isLoadingSendData,
    isLoadingToBalance,
    isSendButtonActive,
    isSmartContractWallet,
    isSpecificRouteDeprecated,
    manualError,
    manualWarning,
    maxButtonFixedAmountToSubtract,
    needsApproval,
    networks,
    placeholderToken,
    priceImpact,
    rate,
    relayFeeEthDisplay,
    relayFeeUsdDisplay,
    selectedBridge,
    send,
    setError,
    setInfo,
    setTx,
    setWarning,
    showFeeRefund,
    slippageTolerance,
    toBalance,
    toNetwork,
    toToken,
    toTokenAmount,
    totalFeeDisplay,
    totalFeeUsdDisplay,
    transferTimeDisplay,
    tx,
    warning,
  } = useSend()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <SendHeader
        styles={styles}
        bridges={bridges}
        selectedBridge={selectedBridge}
        handleBridgeChange={handleBridgeChange}
      />

      <SendAmountSelectorCard
        value={fromTokenAmount}
        token={fromToken ?? placeholderToken}
        label={'From'}
        onChange={fromAmountInputChangeHandler}
        selectedNetwork={fromNetwork}
        networkOptions={networks}
        onNetworkChange={handleFromNetworkChange}
        balance={fromBalance}
        loadingBalance={isLoadingFromBalance}
        deadline={deadline}
        toNetwork={toNetwork}
        fromNetwork={fromNetwork}
        setWarning={setWarning}
        maxButtonFixedAmountToSubtract={maxButtonFixedAmountToSubtract}
        disableInput={isSpecificRouteDeprecated}
      />

      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={handleSwitchDirection} title="Click to switch direction">
          <ArrowDownIcon color="primary" className={styles.downArrow} />
        </IconButton>
      </Box>

      <SendAmountSelectorCard
        value={toTokenAmount}
        token={toToken ?? placeholderToken}
        label={'To (estimated)'}
        selectedNetwork={toNetwork}
        networkOptions={networks}
        onNetworkChange={handleToNetworkChange}
        balance={toBalance}
        loadingBalance={isLoadingToBalance}
        loadingValue={isLoadingSendData}
        disableInput
      />

      <CustomRecipientDropdown
        styles={styles}
        customRecipient={customRecipient}
        handleCustomRecipientInput={handleCustomRecipientInput}
        isOpen={customRecipient || isSmartContractWallet}
      />

      {!!gnosisSafeWarning.text && (
        <div className={styles.smartContractWalletWarning}>
          <Alert severity={gnosisSafeWarning.severity}>{gnosisSafeWarning.text}</Alert>
        </div>
      )}

      {isDestinationChainPaused && (
        <div className={styles.pausedWarning}>
          <Alert severity="warning">Deposits to destination chain {toNetwork?.name} are currently paused. Please check official announcement channels for status updates.</Alert>
        </div>
      )}

      {disabledTx && (
        <Alert severity={disabledTx?.message?.severity ||  'warning'}>
          <ExternalLink
            href={disabledTx.message?.href}
            text={disabledTx.message?.text}
            linkText={disabledTx.message?.linkText}
            postText={disabledTx.message?.postText}
          />
        </Alert>
      )}

      <div className={styles.details}>
        <div className={styles.destinationTxFeeAndAmount}>
          <DetailRow
            title={'Fees'}
            tooltip={
              <FeeDetails
                bonderFee={bonderFeeDisplay}
                bonderFeeUsd={bonderFeeUsdDisplay}
                destinationTxFee={destinationTxFeeDisplay}
                destinationTxFeeUsd={destinationTxFeeUsdDisplay}
                relayFee={relayFeeEthDisplay}
                relayFeeUsd={relayFeeUsdDisplay} />
            }
            value={<>
              <InfoTooltip title={totalFeeUsdDisplay}>
                <Box>{totalFeeDisplay}</Box>
              </InfoTooltip>
            </>}
            large
          />

          <DetailRow
            title="Estimated Received"
            tooltip={
              <AmmDetails
                rate={rate}
                slippageTolerance={slippageTolerance}
                priceImpact={priceImpact}
                amountOutMinDisplay={amountOutMinDisplay}
                amountOutMinUsdDisplay={amountOutMinUsdDisplay}
                transferTime={transferTimeDisplay}
              />
            }
            value={<>
              <InfoTooltip title={estimatedReceivedUsdDisplay}>
                <Box>{estimatedReceivedDisplay}</Box>
              </InfoTooltip>
            </>}
            xlarge
            bold
          />

          {showFeeRefund && (
            <FeeRefund
              title={`${feeRefundTokenSymbol} Onboarding Reward`}
              tokenSymbol={feeRefundTokenSymbol}
              tooltip={`The estimated amount you'll be able to claim as a refund when bridging into this L2. This refund includes a percentage of the source transaction cost + bonder fee + AMM LP fee. The refund is capped at 20 ${feeRefundTokenSymbol} per transfer.`}
              value={feeRefundDisplay}
            />
          )}
        </div>
      </div>

      {isSpecificRouteDeprecated && (
        <Box mb={4}>
          <Alert severity="error" text={`${fromToken?.symbol ? `This ${fromToken?.symbol}` : 'This'} bridge route is deprecated or no longer supported.`} />
        </Box>
      )}

      {!!info && (
        <Box className={styles.infoWarning}>
          <Alert severity="info" onClose={() => setInfo('')} text={info} />
        </Box>
      )}

      {!!error && (
        <Alert severity="error" onClose={() => setError('')} text={error} />
      )}

      {!error && <Alert severity="warning">{warning}</Alert>}
      <Alert severity="warning">{manualWarning}</Alert>
      {!!manualError && (
        <Box mt={2}>
          <Alert severity="error">{manualError}</Alert>
        </Box>
      )}

      { accountAddress
      ? <ButtonsWrapper>
          {!isSendButtonActive && (
            <Box mb={3} width={isApproveButtonActive ? '100%' : 'auto'}>
              <Button
                className={styles.button}
                large
                highlighted={!!needsApproval}
                disabled={!isApproveButtonActive}
                onClick={handleApprove}
                loading={isApproving}
                fullWidth
              >
                Approve
              </Button>
            </Box>
          )}
          <Box mb={3} width={isSendButtonActive ? '100%' : 'auto'}>
            <Button
              className={styles.button}
              startIcon={isSendButtonActive && <SendIcon />}
              onClick={send}
              disabled={!isSendButtonActive}
              large
              fullWidth
              highlighted
            >
              Send
            </Button>
          </Box>
        </ButtonsWrapper>
      : <ButtonsWrapper>
          <Box mb={3} width="100%">
            <ConnectWalletButton fullWidth large mode={theme?.palette?.mode} />
          </Box>
        </ButtonsWrapper>
      }

      <Box mt={1}>
        {tx && <TxStatusModal onClose={() => setTx(undefined)} tx={tx} />}
      </Box>
    </Box>
  )
}

export default Send
