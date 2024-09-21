import { BigNumber } from 'ethers'
import ArrowDownIcon from '@mui/icons-material/ArrowDownwardRounded'
import Box from '@mui/material/Box'
import CustomRecipientDropdown from './CustomRecipientDropdown.js'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { FC, useEffect } from 'react'
import SendAmountSelectorCard from '#pages/Send/SendAmountSelectorCard.js'
import SendIcon from '@mui/icons-material/Send'
import { Alert } from '#components/Alert/index.js'
import { Button } from '#components/Button/index.js'
import { ButtonsWrapper } from '#components/Button/ButtonsWrapper.js'
import { ConnectWalletButton } from '#components/Header/ConnectWalletButton.js'
import { DetailRow } from '#components/InfoTooltip/DetailRow.js'
import { ExternalLink } from '#components/Link/index.js'
import { FeeDetails } from '#components/InfoTooltip/FeeDetails.js'
import { FeeRefund } from './FeeRefund.js'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { V2TxStatusModal } from '#components/Modal/V2TxStatusModal.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useSendStyles } from './useSendStyles.js'
import { useV2Send } from '#hooks/useV2Send.js'
import RaisedSelect from '#components/selects/RaisedSelect.js'
import MenuItem from '@mui/material/MenuItem'
import SelectOption from '#components/selects/SelectOption.js'
import { AmmDetails } from '#components/AmmDetails/index.js'
import { MultiHopStepper } from './MultiHopStepper.js'
import { TokenListModal } from './TokenListModal.js'

export const SendV2: FC = () => {
  const styles = useSendStyles()
  const { theme } = useApp()
  const {
    accountAddress,
    amountIn: fromTokenAmount,
    approveReady,
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    chains,
    error,
    estimatedReceivedDisplay,
    estimatedReceivedUsdDisplay,
    fromChain,
    fromToken,
    fromTokenBalance,
    handleApprove,
    handleFromChainChange,
    handleRecipientInput,
    handleSwitchDirection,
    handleToChainChange,
    handleTokenChange,
    info,
    isApproving,
    isLoadingFromTokenBalance,
    isLoadingToTokenBalance,
    needsApproval,
    recipient,
    sendReady,
    sendTokens,
    setAmountIn,
    setError,
    setFromChainId,
    setInfo,
    setToChainId,
    setTokenSymbol,
    setTx,
    setWarning,
    toChain,
    toToken,
    toTokenAmount,
    toTokenBalance,
    tokenList,
    tokenSymbol,
    totalFeeDisplay,
    totalFeeUsdDisplay,
    tx,
    warning,
    v2Sdk,
    initialTokenSymbol,
    initialFromChainId,
    initialToChainId,
    routeChainIds,
    fetchingGetSendData,
  } = useV2Send()

  useEffect(() => {
    setTokenSymbol(initialTokenSymbol)
    setFromChainId(initialFromChainId)
    setToChainId(initialToChainId)
  }, [tokenList])

  const isSmartContractWallet = false // TODO
  const maxButtonFixedAmountToSubtract = BigNumber.from(0) // TODO
  const isSpecificRouteDeprecated = false // TODO
  const gnosisSafeWarning = null // TODO
  const isDestinationChainPaused = false // TODO
  const disabledTx = null // TODO
  const showFeeRefund = false // TODO
  const feeRefundTokenSymbol = '' // TODO
  const feeRefundDisplay = '' // TODO

  const rate = 1
  const slippageTolerance = 0.1
  const priceImpact = 0
  const amountOutMinDisplay = '123'
  const amountOutMinUsdDisplay = '$1'
  const transferTimeDisplay = '1 minute'

  const placeholderToken = {
    symbol: '',
  }

  const tokens = tokenList.map((_symbol: string) => {
    return {
      symbol: _symbol,
      image: ''
    }
  })

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box className={styles.header}>
        <Box display="flex" alignItems="center" className={styles.sendSelect}>
          <Typography variant="h4" className={styles.sendLabel}>
            Send V2
          </Typography>
          <RaisedSelect value={tokenSymbol} onChange={handleTokenChange}>
            {tokens.map(token => (
              <MenuItem value={token.symbol} key={token.symbol}>
                <SelectOption
                  value={token.symbol}
                  icon={token.image}
                  label={token.symbol}
                />
              </MenuItem>
            ))}
          </RaisedSelect>
        </Box>
      </Box>

      <SendAmountSelectorCard
        value={fromTokenAmount}
        token={fromToken as any ?? placeholderToken}
        label={'From'}
        onChange={setAmountIn}
        selectedNetwork={fromChain}
        networkOptions={chains}
        onNetworkChange={handleFromChainChange}
        balance={fromTokenBalance}
        loadingBalance={isLoadingFromTokenBalance}
        toNetwork={toChain}
        fromNetwork={fromChain}
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
        token={toToken as any ?? placeholderToken}
        label={'To (estimated)'}
        selectedNetwork={toChain}
        networkOptions={chains}
        onNetworkChange={handleToChainChange}
        balance={toTokenBalance}
        loadingBalance={isLoadingToTokenBalance}
        loadingValue={fetchingGetSendData}
        disableInput
      />

      <CustomRecipientDropdown
        styles={styles}
        customRecipient={recipient}
        handleCustomRecipientInput={handleRecipientInput}
        isOpen={recipient || isSmartContractWallet}
      />

      {!!gnosisSafeWarning?.text && (
        <Box className={styles.smartContractWalletWarning}>
          <Alert severity={gnosisSafeWarning.severity}>{gnosisSafeWarning.text}</Alert>
        </Box>
      )}

      {isDestinationChainPaused && (
        <Box className={styles.pausedWarning}>
          <Alert severity="warning">Deposits to destination chain {toChain?.name} are currently paused. Please check official announcement channels for status updates.</Alert>
        </Box>
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

      {routeChainIds?.length > 0 && (
        <MultiHopStepper steps={routeChainIds} />
      )}

      <Box className={styles.details}>
        <Box className={styles.destinationTxFeeAndAmount}>
          <DetailRow
            title={'Fees'}
            tooltip={
              <FeeDetails
                bonderFee={bonderFeeDisplay}
                bonderFeeUsd={bonderFeeUsdDisplay}
                v2Display
                />
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
        </Box>
      </Box>

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
            <Box mb={3} width={approveReady ? '100%' : 'auto'}>
              <Button
                className={styles.button}
                large
                highlighted={needsApproval}
                disabled={!approveReady}
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
        {tx && <V2TxStatusModal
          v2Sdk={v2Sdk}
          token={fromToken}
          fromChain={fromChain}
          toChain={toChain}
          onClose={() => setTx(null)} tx={tx as any} />}
      </Box>
      <TokenListModal selectedChainId={''} onTokenSelect={(token) => console.log('Selected token:', token)} />
    </Box>
  )
}
