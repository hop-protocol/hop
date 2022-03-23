import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import Button from 'src/components/buttons/Button'
import SendIcon from '@material-ui/icons/Send'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import SendAmountSelectorCard from 'src/pages/Send/SendAmountSelectorCard'
import Alert from 'src/components/alert/Alert'
import TxStatusModal from 'src/components/modal/TxStatusModal'
import DetailRow from 'src/components/InfoTooltip/DetailRow'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import logger from 'src/logger'
import { commafy, findMatchingBridge, sanitizeNumericalString, toTokenDisplay } from 'src/utils'
import useSendData from 'src/pages/Send/useSendData'
import AmmDetails from 'src/components/AmmDetails'
import FeeDetails from 'src/components/InfoTooltip/FeeDetails'
import { hopAppNetwork } from 'src/config'
import InfoTooltip from 'src/components/InfoTooltip'
import { ChainSlug } from '@hop-protocol/sdk'
import { amountToBN, formatError } from 'src/utils/format'
import { useSendStyles } from './useSendStyles'
import SendHeader from './SendHeader'
import CustomRecipientDropdown from './CustomRecipientDropdown'
import { Div, Flex } from 'src/components/ui'
import { useSendTransaction } from './useSendTransaction'
import {
  useAssets,
  useAsyncMemo,
  useFeeConversions,
  useApprove,
  useQueryParams,
  useNeedsTokenForFee,
  useBalance,
  useEstimateTxCost,
  useTxResult,
  useSufficientBalance,
  useDisableTxs,
  useGnosisSafeTransaction,
} from 'src/hooks'
import { ButtonsWrapper } from 'src/components/buttons/ButtonsWrapper'
import useAvailableLiquidity from './useAvailableLiquidity'
import useIsSmartContractWallet from 'src/hooks/useIsSmartContractWallet'
import { ExternalLink } from 'src/components/Link'

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
  const { checkConnectedNetworkId, address } = useWeb3Context()
  const { queryParams, updateQueryParams } = useQueryParams()
  const [fromNetwork, _setFromNetwork] = useState<Network>()
  const [toNetwork, _setToNetwork] = useState<Network>()
  const [fromTokenAmount, setFromTokenAmount] = useState<string>()
  const [toTokenAmount, setToTokenAmount] = useState<string>()
  const [approving, setApproving] = useState<boolean>(false)
  const [amountOutMinDisplay, setAmountOutMinDisplay] = useState<string>()
  const [warning, setWarning] = useState<any>(null)
  const [error, setError] = useState<string | null | undefined>(null)
  const [noLiquidityWarning, setNoLiquidityWarning] = useState<any>(null)
  const [minimumSendWarning, setMinimumSendWarning] = useState<string | null | undefined>(null)
  const [info, setInfo] = useState<string | null | undefined>(null)
  const [isLiquidityAvailable, setIsLiquidityAvailable] = useState<boolean>(true)
  const [customRecipient, setCustomRecipient] = useState<string>()
  const [manualWarning, setManualWarning] = useState<string>('')
  const { isSmartContractWallet } = useIsSmartContractWallet()
  const [manualError, setManualError] = useState<string>('')

  // Reset error message when fromNetwork/toNetwork changes
  useEffect(() => {
    if (warning) {
      setWarning('')
    }
    if (error) {
      setError('')
    }
  }, [fromNetwork, toNetwork])

  // Set fromNetwork and toNetwork using query params
  useEffect(() => {
    const _fromNetwork = networks.find(network => network.slug === queryParams.sourceNetwork)
    _setFromNetwork(_fromNetwork)

    const _toNetwork = networks.find(network => network.slug === queryParams.destNetwork)

    if (_fromNetwork?.name === _toNetwork?.name) {
      // Leave destination network empty
      return
    }

    _setToNetwork(_toNetwork)
  }, [queryParams, networks])

  // Get assets
  const { unsupportedAsset, sourceToken, destToken, placeholderToken } = useAssets(
    selectedBridge,
    fromNetwork,
    toNetwork
  )

  // Get token balances for both networks
  const { balance: fromBalance, loading: loadingFromBalance } = useBalance(sourceToken, address)
  const { balance: toBalance, loading: loadingToBalance } = useBalance(destToken, address)

  // Set fromToken -> BN
  const fromTokenAmountBN = useMemo<BigNumber | undefined>(() => {
    if (fromTokenAmount && sourceToken) {
      return amountToBN(fromTokenAmount, sourceToken.decimals)
    }
  }, [sourceToken, fromTokenAmount])

  // Get available liquidity
  const { availableLiquidity } = useAvailableLiquidity(
    selectedBridge,
    fromNetwork?.slug,
    toNetwork?.slug
  )

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
  } = useSendData(sourceToken, slippageTolerance, fromNetwork, toNetwork, fromTokenAmountBN)

  // Set toAmount
  useEffect(() => {
    if (!destToken) {
      setToTokenAmount('')
      return
    }

    let amount
    if (amountOut) {
      amount = toTokenDisplay(amountOut, destToken.decimals)
    }
    setToTokenAmount(amount)
  }, [destToken, amountOut])

  // Convert fees to displayed values
  const {
    destinationTxFeeDisplay,
    bonderFeeDisplay,
    totalBonderFeeDisplay,
    estimatedReceivedDisplay,
  } = useFeeConversions(adjustedDestinationTxFee, adjustedBonderFee, estimatedReceived, destToken)

  const { estimateSend } = useEstimateTxCost(fromNetwork)

  const { data: estimatedGasCost } = useTxResult(
    sourceToken,
    fromNetwork,
    toNetwork,
    fromTokenAmountBN,
    estimateSend,
    { deadline }
  )

  const { sufficientBalance, warning: sufficientBalanceWarning } = useSufficientBalance(
    sourceToken,
    fromTokenAmountBN,
    estimatedGasCost,
    fromBalance
  )

  // ==============================================================================================
  // Error and warning messages
  // ==============================================================================================
  useEffect(() => {
    setError(formatError(sendDataError))
  }, [sendDataError])

  // Set error message if asset is unsupported
  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else if (error) {
      setError('')
    }
  }, [unsupportedAsset])

  // Check if there is sufficient available liquidity
  useEffect(() => {
    const checkAvailableLiquidity = async () => {
      if (!toNetwork || !availableLiquidity || !requiredLiquidity || !sourceToken) {
        setNoLiquidityWarning('')
        return
      }

      const isAvailable = BigNumber.from(availableLiquidity).gte(requiredLiquidity)
      const formattedAmount = toTokenDisplay(availableLiquidity, sourceToken.decimals)

      const warningMessage = (
        <>
          Insufficient liquidity. There is {formattedAmount} {sourceToken.symbol} bonder liquidity
          available on {toNetwork.name}. Please try again in a few minutes when liquidity becomes
          available again.{' '}
          <InfoTooltip
            title={
              <>
                <div>
                  The Bonder does not have enough liquidity to bond the transfer at the destination.
                  Liquidity will become available again after the bonder has settled any bonded
                  transfers.
                </div>
                <div>Available liquidity: {formattedAmount}</div>
                <div>
                  Required liquidity: {toTokenDisplay(requiredLiquidity, sourceToken.decimals)}
                </div>
              </>
            }
          />
        </>
      )
      if (!isAvailable) {
        if (hopAppNetwork !== 'staging') {
          setIsLiquidityAvailable(false)
          return setNoLiquidityWarning(warningMessage)
        }
      } else {
        setIsLiquidityAvailable(true)
        setNoLiquidityWarning('')
      }
    }

    checkAvailableLiquidity()
  }, [fromNetwork, sourceToken, toNetwork, availableLiquidity, requiredLiquidity])

  const checkingLiquidity = useMemo(() => {
    return !fromNetwork?.isLayer1 && availableLiquidity === undefined
  }, [fromNetwork, availableLiquidity])

  const needsTokenForFee = useNeedsTokenForFee(fromNetwork)

  useEffect(() => {
    const warningMessage = `Send at least ${destinationTxFeeDisplay} to cover the transaction fee`
    if (estimatedReceived?.lte(0) && adjustedDestinationTxFee?.gt(0)) {
      setMinimumSendWarning(warningMessage)
    } else if (minimumSendWarning) {
      setMinimumSendWarning('')
    }
  }, [estimatedReceived, adjustedDestinationTxFee])

  useEffect(() => {
    let message = noLiquidityWarning || minimumSendWarning

    const isFavorableSlippage = Number(toTokenAmount) >= Number(fromTokenAmount)
    const isHighPriceImpact = priceImpact && priceImpact !== 100 && Math.abs(priceImpact) >= 1
    const showPriceImpactWarning = isHighPriceImpact && !isFavorableSlippage

    if (sufficientBalanceWarning) {
      message = sufficientBalanceWarning
    } else if (estimatedReceived && adjustedBonderFee?.gt(estimatedReceived)) {
      message = 'Bonder fee greater than estimated received'
    } else if (estimatedReceived?.lte(0)) {
      message = 'Estimated received too low. Send a higher amount to cover the fees.'
    } else if (showPriceImpactWarning) {
      message = `Warning: Price impact is high. Slippage is ${commafy(priceImpact)}%`
    }

    setWarning(message)
  }, [
    noLiquidityWarning,
    minimumSendWarning,
    sufficientBalanceWarning,
    estimatedReceived,
    priceImpact,
    fromTokenAmount,
    toTokenAmount,
  ])

  useEffect(() => {
    if (!amountOutMin || !destToken) {
      setAmountOutMinDisplay(undefined)
      return
    }
    let _amountOutMin = amountOutMin
    if (adjustedDestinationTxFee?.gt(0)) {
      _amountOutMin = _amountOutMin.sub(adjustedDestinationTxFee)
    }

    if (_amountOutMin.lt(0)) {
      _amountOutMin = BigNumber.from(0)
    }

    const amountOutMinFormatted = commafy(formatUnits(_amountOutMin, destToken.decimals), 4)
    setAmountOutMinDisplay(`${amountOutMinFormatted} ${destToken.symbol}`)
  }, [amountOutMin])

  // ==============================================================================================
  // Approve fromNetwork / fromToken
  // ==============================================================================================

  const { approve, checkApproval } = useApprove(sourceToken)

  const needsApproval = useAsyncMemo(async () => {
    try {
      if (!(fromNetwork && sourceToken && fromTokenAmount)) {
        return false
      }

      const parsedAmount = amountToBN(fromTokenAmount, sourceToken.decimals)
      const bridge = sdk.bridge(sourceToken.symbol)

      let spender: string
      if (fromNetwork.isLayer1) {
        const l1Bridge = await bridge.getL1Bridge()
        spender = l1Bridge.address
      } else {
        const ammWrapper = await bridge.getAmmWrapper(fromNetwork.slug)
        spender = ammWrapper.address
      }

      return checkApproval(parsedAmount, sourceToken, spender)
    } catch (err: any) {
      logger.error(err)
      return false
    }
  }, [sdk, fromNetwork, sourceToken, fromTokenAmount, checkApproval])

  const approveFromToken = async () => {
    if (!fromNetwork) {
      throw new Error('No fromNetwork selected')
    }

    if (!sourceToken) {
      throw new Error('No from token selected')
    }

    if (!fromTokenAmount) {
      throw new Error('No amount to approve')
    }

    const networkId = Number(fromNetwork.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) return

    const parsedAmount = amountToBN(fromTokenAmount, sourceToken.decimals)
    const bridge = sdk.bridge(sourceToken.symbol)

    let spender: string
    if (fromNetwork.isLayer1) {
      const l1Bridge = await bridge.getL1Bridge()
      spender = l1Bridge.address
    } else {
      const ammWrapper = await bridge.getAmmWrapper(fromNetwork.slug)
      spender = ammWrapper.address
    }

    const tx = await approve(parsedAmount, sourceToken, spender)

    await tx?.wait()
  }

  const handleApprove = async () => {
    try {
      setError(null)
      setApproving(true)
      await approveFromToken()
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, fromNetwork))
      }
      logger.error(err)
    }
    setApproving(false)
  }

  // ==============================================================================================
  // Send tokens
  // ==============================================================================================

  const { tx, setTx, send, sending } = useSendTransaction({
    amountOutMin,
    customRecipient,
    deadline,
    totalFee,
    fromNetwork,
    fromTokenAmount,
    intermediaryAmountOutMin,
    sdk,
    setError,
    sourceToken,
    toNetwork,
    txConfirm,
    txHistory,
    estimatedReceived: estimatedReceivedDisplay,
  })

  useEffect(() => {
    if (tx) {
      // clear from token input field
      setFromTokenAmount('')
    }
  }, [tx])

  const { gnosisEnabled, gnosisSafeWarning, isCorrectSignerNetwork } = useGnosisSafeTransaction(
    tx,
    customRecipient,
    fromNetwork,
    toNetwork
  )

  // ==============================================================================================
  // User actions
  // - Bridge / Network selection
  // - Custom recipient input
  // ==============================================================================================

  // Change the bridge if user selects different token to send
  const handleBridgeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const bridge = findMatchingBridge(bridges, tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  // Set fromNetwork
  const setFromNetwork = (network: Network | undefined) => {
    updateQueryParams({
      sourceNetwork: network?.slug ?? '',
    })
    _setFromNetwork(network)
  }

  // Set toNetwork
  const setToNetwork = (network: Network | undefined) => {
    updateQueryParams({
      destNetwork: network?.slug ?? '',
    })
    _setToNetwork(network)
  }

  // Switch the fromNetwork <--> toNetwork
  const handleSwitchDirection = () => {
    setToTokenAmount('')
    setFromNetwork(toNetwork)
    setToNetwork(fromNetwork)
  }

  // Change the fromNetwork
  const handleFromNetworkChange = (network: Network | undefined) => {
    if (network?.slug === toNetwork?.slug) {
      handleSwitchDirection()
    } else {
      setFromNetwork(network)
    }
  }

  // Change the toNetwork
  const handleToNetworkChange = (network: Network | undefined) => {
    if (network?.slug === fromNetwork?.slug) {
      handleSwitchDirection()
    } else {
      setToNetwork(network)
    }
  }

  // Specify custom recipient
  const handleCustomRecipientInput = (event: any) => {
    const value = event.target.value.trim()
    setCustomRecipient(value)
  }

  useEffect(() => {
    if (
      toNetwork?.slug === ChainSlug.Arbitrum &&
      customRecipient &&
      !address?.eq(customRecipient)
    ) {
      return setManualWarning(
        'Warning: transfers to exchanges that do not support internal transactions may result in lost funds.'
      )
    }
    setManualWarning('')
  }, [fromNetwork?.slug, toNetwork?.slug, customRecipient, address])

  useEffect(() => {
    // if (fromNetwork?.slug === ChainSlug.Polygon || toNetwork?.slug === ChainSlug.Polygon) {
    //   return setManualError('Warning: transfers to/from Polygon are temporarily down.')
    // }
    // setManualError('')
  }, [fromNetwork?.slug, toNetwork?.slug])

  const { disabledTx } = useDisableTxs(fromNetwork, toNetwork)

  const approveButtonActive = !needsTokenForFee && !unsupportedAsset && needsApproval

  const sendButtonActive = useMemo(() => {
    return !!(
      !needsApproval &&
      !approveButtonActive &&
      !checkingLiquidity &&
      !loadingToBalance &&
      !loadingSendData &&
      fromTokenAmount &&
      toTokenAmount &&
      rate &&
      sufficientBalance &&
      isLiquidityAvailable &&
      estimatedReceived?.gt(0) &&
      !manualError &&
      (!disabledTx || disabledTx.warningOnly) &&
      (gnosisEnabled ? isCorrectSignerNetwork : !isSmartContractWallet)
    )
  }, [
    needsApproval,
    approveButtonActive,
    checkingLiquidity,
    loadingToBalance,
    loadingSendData,
    fromTokenAmount,
    toTokenAmount,
    rate,
    sufficientBalance,
    isLiquidityAvailable,
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
        value={fromTokenAmount}
        token={sourceToken ?? placeholderToken}
        label={'From'}
        onChange={value => {
          if (!value) {
            setFromTokenAmount('')
            setToTokenAmount('')
            return
          }

          const amountIn = sanitizeNumericalString(value)
          setFromTokenAmount(amountIn)
        }}
        selectedNetwork={fromNetwork}
        networkOptions={networks}
        onNetworkChange={handleFromNetworkChange}
        balance={fromBalance}
        loadingBalance={loadingFromBalance}
        deadline={deadline}
        toNetwork={toNetwork}
        fromNetwork={fromNetwork}
        setWarning={setWarning}
      />

      <Flex justifyCenter alignCenter my={1} onClick={handleSwitchDirection} pointer hover>
        <ArrowDownIcon color="primary" className={styles.downArrow} />
      </Flex>

      <SendAmountSelectorCard
        value={toTokenAmount}
        token={destToken ?? placeholderToken}
        label={'To (estimated)'}
        selectedNetwork={toNetwork}
        networkOptions={networks}
        onNetworkChange={handleToNetworkChange}
        balance={toBalance}
        loadingBalance={loadingToBalance}
        loadingValue={loadingSendData}
        disableInput
      />

      <CustomRecipientDropdown
        styles={styles}
        customRecipient={customRecipient}
        handleCustomRecipientInput={handleCustomRecipientInput}
        isOpen={isSmartContractWallet}
      />

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
              <AmmDetails
                rate={rate}
                slippageTolerance={slippageTolerance}
                priceImpact={priceImpact}
                amountOutMinDisplay={amountOutMinDisplay}
              />
            }
            value={estimatedReceivedDisplay}
            xlarge
            bold
          />
        </div>
      </div>

      <Alert severity="error" onClose={() => setError(null)} text={error} />
      {!error && <Alert severity="warning">{warning}</Alert>}
      <Alert severity="warning">{manualWarning}</Alert>
      <Alert severity="error">{manualError}</Alert>

      <ButtonsWrapper>
        {!sendButtonActive && (
          <Div mb={[3]} fullWidth={approveButtonActive}>
            <Button
              className={styles.button}
              large
              highlighted={!!needsApproval}
              disabled={!approveButtonActive}
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
            startIcon={sendButtonActive && <SendIcon />}
            onClick={send}
            disabled={!sendButtonActive}
            loading={sending}
            large
            fullWidth
            highlighted
          >
            Send
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
