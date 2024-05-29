import { BigNumber } from 'ethers'
import ArrowDownIcon from '@mui/icons-material/ArrowDownwardRounded'
import Box from '@mui/material/Box'
import CustomRecipientDropdown from './CustomRecipientDropdown.js'
import IconButton from '@mui/material/IconButton'
import React, { FC, useEffect } from 'react'
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
import { useSendStyles } from './useSendStyles.js'
import { useV2Send } from '#hooks/useV2Send.js'
import RaisedSelect from '#components/selects/RaisedSelect.js'
import MenuItem from '@mui/material/MenuItem'
import Link from '@mui/material/Link'
import SelectOption from '#components/selects/SelectOption.js'
import {
  GnosisSafeWarning,
  useApprove,
  useAssets,
  useAsyncMemo,
  useBalance,
  useDisableTxs,
  useEstimateTxCost,
  useFeeConversions,
  useGnosisSafeTransaction,
  useNeedsTokenForFee,
  useQueryParams,
  useSufficientBalance,
  useTxResult
} from '#hooks/index.js'

export const SendV2: FC = () => {
  const styles = useSendStyles()
  const { theme } = useApp()
  const {
    accountAddress,
    tokenList,
    needsApproval,
    approveTokens,
    sendTokens,
    sendReady,
    tokenSymbol,
    setTokenSymbol,
    setAmountIn,
    fromChainId,
    setFromChainId,
    toChainId,
    setToChainId,
    tx,
    setTx,
    amountIn: fromTokenAmount,
    error,
    setError,
    warning,
    setWarning,
    recipient: customRecipient,
    setRecipient: setCustomRecipient,
    info,
    setInfo,
    isApproving,
    fromTokenBalance,
    isLoadingFromTokenBalance,
    toTokenBalance,
    isLoadingToTokenBalance
  } = useV2Send()
  const {
    networks,
    settings,
    txConfirm,
    txHistory
  } = useApp()
  const { slippageTolerance } = settings

  useEffect(() => {
    // TODO
    setTokenSymbol(tokenList[0])
    setFromChainId('11155111')
    setToChainId('11155420')
  }, [tokenList])

  // TODO
  const isSmartContractWallet = false
  const maxButtonFixedAmountToSubtract = BigNumber.from(0)
  const isSpecificRouteDeprecated = false // TODO
  const toTokenAmount = null
  const isLoadingSendData = false
  const gnosisSafeWarning = null
  const isDestinationChainPaused = false
  const disabledTx = null
  const bonderFeeDisplay = ''
  const bonderFeeUsdDisplay = ''
  const destinationTxFeeDisplay = ''
  const destinationTxFeeUsdDisplay = ''
  const relayFeeEthDisplay = ''
  const relayFeeUsdDisplay = ''
  const totalFeeUsdDisplay = ''
  const totalFeeDisplay = ''
  const rate = null
  const priceImpact = null
  const amountOutMinDisplay = ''
  const amountOutMinUsdDisplay = ''
  const transferTimeDisplay = null
  const estimatedReceivedUsdDisplay = ''
  const estimatedReceivedDisplay = ''
  const showFeeRefund = false
  const feeRefundTokenSymbol = ''
  const feeRefundDisplay = ''
  const isApproveButtonActive = needsApproval
  function handleBridgeChange(event: any) {
    setTokenSymbol(event.target.value)
  }
  function handleFromNetworkChange(network: any) {
    if (network.networkId?.toString() === toChainId) {
      handleSwitchDirection()
    } else {
      setFromChainId(network.networkId.toString())
    }
  }
  function handleToNetworkChange(network: any) {
    if (network.networkId?.toString() === fromChainId) {
      handleSwitchDirection()
    } else {
      setToChainId(network.networkId.toString())
    }
  }
  function handleSwitchDirection() {
    setAmountIn('')
    setFromChainId(toChainId)
    setToChainId(fromChainId)
  }
  function handleCustomRecipientInput(event: any) {
    setCustomRecipient(event.target.value)
  }
  function handleApprove() {
    approveTokens()
  }

  const fromNetwork = networks.find(network => network.networkId?.toString() === fromChainId)
  const toNetwork = networks.find(network => network.networkId?.toString() === toChainId)

  const placeholderToken = {
    symbol: '',
  }

  // TODO
  const fromToken = {
    symbol: tokenSymbol,
    decimals: 18,
  }

  const toToken = {
    symbol: tokenSymbol,
    decimals: 18,
  }

  function newToken(_tokenSymbol: string) {
    return {
      tokenSymbol: _tokenSymbol,
      tokenImage: ''
    }
  }

  const tokens = tokenList.map(newToken)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <div>Send V2</div>

      <RaisedSelect value={tokenSymbol} onChange={handleBridgeChange}>
        {tokens.map(token => (
          <MenuItem value={token.tokenSymbol} key={token.tokenSymbol}>
            <SelectOption
              value={token.tokenSymbol}
              icon={token.tokenImage}
              label={token.tokenSymbol}
            />
          </MenuItem>
        ))}
      </RaisedSelect>

      <SendAmountSelectorCard
        value={fromTokenAmount}
        token={fromToken ?? placeholderToken}
        label={'From'}
        onChange={setAmountIn}
        selectedNetwork={fromNetwork}
        networkOptions={networks}
        onNetworkChange={handleFromNetworkChange}
        balance={fromTokenBalance}
        loadingBalance={isLoadingFromTokenBalance}
        toNetwork={toNetwork}
        fromNetwork={fromNetwork}
        setWarning={setWarning}
        maxButtonFixedAmountToSubtract={maxButtonFixedAmountToSubtract}
        disableInput={isSpecificRouteDeprecated}
        deadline={0} // required for max button
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
        balance={toTokenBalance}
        loadingBalance={isLoadingToTokenBalance}
        loadingValue={isLoadingSendData}
        disableInput
      />

      <CustomRecipientDropdown
        styles={styles}
        customRecipient={customRecipient}
        handleCustomRecipientInput={handleCustomRecipientInput}
        isOpen={customRecipient || isSmartContractWallet}
      />

      {!!gnosisSafeWarning?.text && (
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

      { accountAddress
      ? <ButtonsWrapper>
          {!sendReady && (
            <Box mb={3} width={isApproveButtonActive ? '100%' : 'auto'}>
              <Button
                className={styles.button}
                large
                highlighted={needsApproval}
                disabled={!isApproveButtonActive}
                onClick={handleApprove}
                loading={isApproving}
                fullWidth
              >
                Approve
              </Button>
            </Box>
          )}
          <Box mb={3} width={sendReady ? '100%' : 'auto'}>
            <Button
              className={styles.button}
              startIcon={sendReady && <SendIcon />}
              onClick={sendTokens}
              disabled={!sendReady}
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
        {tx && <TxStatusModal onClose={() => setTx(null)} tx={tx as any} />}
      </Box>
    </Box>
  )
}
