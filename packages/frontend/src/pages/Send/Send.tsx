import ArrowDownIcon from '@mui/icons-material/ArrowDownwardRounded'
import Box from '@mui/material/Box'
import CustomRecipientDropdown from './CustomRecipientDropdown'
import IconButton from '@mui/material/IconButton'
import React, { FC } from 'react'
import SendAmountSelectorCard from 'src/pages/Send/SendAmountSelectorCard'
import SendHeader from './SendHeader'
import SendIcon from '@mui/icons-material/Send'
import { Alert } from 'src/components/Alert'
import { AmmDetails } from 'src/components/AmmDetails'
import { Button } from 'src/components/Button'
import { ButtonsWrapper } from 'src/components/Button/ButtonsWrapper'
import { ConnectWalletButton } from 'src/components/Header/ConnectWalletButton'
import { DetailRow } from 'src/components/InfoTooltip/DetailRow'
import { ExternalLink } from 'src/components/Link'
import { FeeDetails } from 'src/components/InfoTooltip/FeeDetails'
import { FeeRefund } from './FeeRefund'
import { InfoTooltip } from 'src/components/InfoTooltip'
import { TxStatusModal } from 'src/components/Modal/TxStatusModal'
import { useApp } from 'src/contexts/AppContext'
import { useSend } from 'src/pages/Send/useSend'
import { useSendStyles } from './useSendStyles'

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

      <div className={styles.smartContractWalletWarning}>
        <Alert severity={gnosisSafeWarning.severity}>{gnosisSafeWarning.text}</Alert>
      </div>

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
              title={`OP Onboarding Reward`}
              tokenSymbol={feeRefundTokenSymbol}
              tooltip={`The estimated amount you'll be able to claim as a refund when bridging into Optimism. This refund includes a percentage of the source transaction cost + bonder fee + AMM LP fee. The refund is capped at 20 OP per transfer.`}
              value={feeRefundDisplay}
            />
          )}
        </div>
      </div>

      {isSpecificRouteDeprecated && (
        <Box mb={4}>
          <Alert severity="error" text={`${fromToken?.symbol ? `The ${fromToken?.symbol}` : 'This'} bridge is deprecated. Only transfers from L2 to L1 are supported.`} />
        </Box>
      )}

      <Alert severity="error" onClose={() => setError('')} text={error} />
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
            <Box mb={[3]} width={isApproveButtonActive ? '100%' : 'auto'}>
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
          <Box mb={[3]} width={isSendButtonActive ? '100%' : 'auto'}>
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
          <Box mb={[3]} width="100%">
            <ConnectWalletButton fullWidth large mode={theme?.palette.type} />
          </Box>
        </ButtonsWrapper>
      }

      <Box mt={1}>
        <Alert severity="info" onClose={() => setInfo('')} text={info} />
        {tx && <TxStatusModal onClose={() => setTx(undefined)} tx={tx} />}
      </Box>
    </Box>
  )
}

export default Send
