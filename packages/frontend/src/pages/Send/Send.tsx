import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import Button from 'src/components/buttons/Button'
import SendIcon from '@material-ui/icons/Send'
import Box from '@material-ui/core/Box'
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
import { commafy, findMatchingBridge, sanitizeNumericalString, toTokenDisplay, toUsdDisplay } from 'src/utils'
import useSendData from 'src/pages/Send/useSendData'
import AmmDetails from 'src/components/AmmDetails'
import FeeDetails from 'src/components/InfoTooltip/FeeDetails'
import { hopAppNetwork, reactAppNetwork, showRewards } from 'src/config'
import InfoTooltip from 'src/components/InfoTooltip'
import { ChainSlug } from '@hop-protocol/sdk'
import { amountToBN, formatError } from 'src/utils/format'
import { getTransferTimeString } from 'src/utils/getTransferTimeString'
import { useSendStyles } from './useSendStyles'
import SendHeader from './SendHeader'
import CustomRecipientDropdown from './CustomRecipientDropdown'
import { Div, Flex } from 'src/components/ui'
import styled from 'styled-components'
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
import { FeeRefund } from './FeeRefund'
import IconButton from '@material-ui/core/IconButton'

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
  const [amountOutMinUsdDisplay, setAmountOutMinUsdDisplay] = useState<string>()
  const [warning, setWarning] = useState<any>(null)
  const [error, setError] = useState<string | null | undefined>(null)
  const [noLiquidityWarning, setNoLiquidityWarning] = useState<any>(null)
  const [minimumSendWarning, setMinimumSendWarning] = useState<string | null | undefined>(null)
  const [info, setInfo] = useState<string | null | undefined>(null)
  const [isLiquidityAvailable, setIsLiquidityAvailable] = useState<boolean>(true)
  const [customRecipient, setCustomRecipient] = useState<string>('')
  const [manualWarning, setManualWarning] = useState<string>('')
  const { isSmartContractWallet } = useIsSmartContractWallet()
  const [manualError, setManualError] = useState<string>('')
  const [feeRefund, setFeeRefund] = useState<string>('')
  const [feeRefundUsd, setFeeRefundUsd] = useState<string>('')
  const [feeRefundTokenSymbol, setFeeRefundTokenSymbol] = useState<string>('')
  const [destinationChainPaused, setDestinationChainPaused] = useState<boolean>(false)
  const [feeRefundEnabled] = useState<boolean>(showRewards)

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

  useEffect(() => {
    if (queryParams.amount && !Number.isNaN(Number(queryParams.amount))) {
      setFromTokenAmount(queryParams.amount as string)
      updateQueryParams({
        amount: undefined
      })
    }
  }, [queryParams])

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
    relayFeeEth,
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

    let amount : any
    if (amountOut) {
      amount = toTokenDisplay(amountOut, destToken.decimals)
    }
    setToTokenAmount(amount)
  }, [destToken, amountOut])

  // Convert fees to displayed values
  const {
    destinationTxFeeDisplay,
    destinationTxFeeUsdDisplay,
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    totalBonderFee,
    totalBonderFeeDisplay,
    totalBonderFeeUsdDisplay,
    totalFeeDisplay, // bonderFee + messageRelayFee
    totalFeeUsdDisplay, // bonderFee + messageRelayFee
    estimatedReceivedDisplay,
    estimatedReceivedUsdDisplay,
    tokenUsdPrice,
    relayFeeEthDisplay,
    relayFeeUsdDisplay,
  } = useFeeConversions({
    destinationTxFee: adjustedDestinationTxFee,
    bonderFee: adjustedBonderFee,
    estimatedReceived,
    destToken,
    relayFee: relayFeeEth
  })

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

  useEffect(() => {
    const update = async () => {
      if (fromNetwork?.isL1 && toNetwork && sourceToken) {
        const bridge = sdk.bridge(sourceToken.symbol)
        const isPaused = await bridge.isDestinationChainPaused(toNetwork?.slug)
        setDestinationChainPaused(isPaused)
      } else {
        setDestinationChainPaused(false)
      }
    }

    update().catch(console.error)
  }, [sdk, sourceToken, fromNetwork, toNetwork])

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

      let isAvailable = BigNumber.from(availableLiquidity).gte(requiredLiquidity)
      if (fromNetwork?.isL1) {
        isAvailable = true
      }

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
    try {
      let message = noLiquidityWarning || minimumSendWarning

      const isFavorableSlippage = Number(toTokenAmount) >= Number(fromTokenAmount)
      const isHighPriceImpact = priceImpact && priceImpact !== 100 && Math.abs(priceImpact) >= 1
      const showPriceImpactWarning = isHighPriceImpact && !isFavorableSlippage
      const bonderFeeMajority = sourceToken?.decimals && estimatedReceived && totalFee && ((Number(formatUnits(totalFee, sourceToken?.decimals)) / Number(fromTokenAmount)) > 0.5)
      const insufficientRelayFeeFunds = sourceToken?.symbol === 'ETH' && fromTokenAmountBN?.gt(0) && relayFeeEth?.gt(0) && fromBalance && fromTokenAmountBN.gt(fromBalance.sub(relayFeeEth))

      if (sufficientBalanceWarning) {
        message = sufficientBalanceWarning
      } else if (estimatedReceived && adjustedBonderFee?.gt(estimatedReceived)) {
        message = 'Bonder fee greater than estimated received'
      } else if (insufficientRelayFeeFunds) {
        message = `Insufficient balance to cover the cost of tx. Please add ${sourceToken.nativeTokenSymbol} to pay for tx fees.`
      } else if (estimatedReceived?.lte(0)) {
        message = 'Estimated received too low. Send a higher amount to cover the fees.'
      } else if (showPriceImpactWarning) {
        message = `Warning: Price impact is high. Slippage is ${commafy(priceImpact)}%`
      } else if (bonderFeeMajority) {
        message = 'Warning: More than 50% of amount will go towards bonder fee'
      }

      setWarning(message)
    } catch (err: any) {
      console.error(err)
      setWarning('')
    }
  }, [
    sourceToken,
    noLiquidityWarning,
    minimumSendWarning,
    sufficientBalanceWarning,
    estimatedReceived,
    priceImpact,
    fromTokenAmount,
    fromTokenAmountBN,
    toTokenAmount,
    totalFee,
    toNetwork,
    relayFeeEth,
    fromBalance
  ])

  useEffect(() => {
    if (!amountOutMin || !destToken) {
      setAmountOutMinDisplay(undefined)
      setAmountOutMinUsdDisplay(undefined)
      return
    }
    let _amountOutMin = amountOutMin
    if (adjustedDestinationTxFee?.gt(0)) {
      _amountOutMin = _amountOutMin.sub(adjustedDestinationTxFee)
    }

    if (_amountOutMin.lt(0)) {
      _amountOutMin = BigNumber.from(0)
    }

    const amountOutMinDisplay = toTokenDisplay(_amountOutMin, destToken.decimals, destToken.symbol)
    const amountOutMinUsdDisplay = toUsdDisplay(_amountOutMin, destToken.decimals, tokenUsdPrice)
    setAmountOutMinDisplay(amountOutMinDisplay)
    setAmountOutMinUsdDisplay(amountOutMinUsdDisplay)
  }, [amountOutMin, tokenUsdPrice])

  // ==============================================================================================
  // Approve fromNetwork / fromToken
  // ==============================================================================================

  const { approve, checkApproval } = useApprove(sourceToken)

  const needsApproval = useAsyncMemo(async () => {
    try {
      if (!(fromNetwork && toNetwork && sourceToken && fromTokenAmount)) {
        return false
      }

      const parsedAmount = amountToBN(fromTokenAmount, sourceToken.decimals)
      const bridge = sdk.bridge(sourceToken.symbol)

      const isHTokenTransfer = false
      const spender: string = bridge.getSendApprovalAddress(fromNetwork.slug, isHTokenTransfer, toNetwork.slug)
      return checkApproval(parsedAmount, sourceToken, spender)
    } catch (err: any) {
      logger.error(err)
      return false
    }
  }, [sdk, fromNetwork, toNetwork, sourceToken, fromTokenAmount, checkApproval])

  const approveFromToken = async () => {
    if (!fromNetwork) {
      throw new Error('No fromNetwork selected')
    }

    if (!toNetwork) {
      throw new Error('No toNetwork selected')
    }

    if (!sourceToken) {
      throw new Error('No from token selected')
    }

    if (!fromTokenAmount) {
      throw new Error('No amount to approve')
    }

    const networkId = Number(fromNetwork.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) {
      throw new Error('wrong network connected')
    }

    const parsedAmount = amountToBN(fromTokenAmount, sourceToken.decimals)
    const bridge = sdk.bridge(sourceToken.symbol)

    const isHTokenTransfer = false
    const spender: string = bridge.getSendApprovalAddress(fromNetwork.slug, isHTokenTransfer, toNetwork.slug)
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
  // Fee refund
  // ==============================================================================================

  useEffect(() => {
    async function update() {
      try {
        if (!feeRefundEnabled) {
          return
        }
        if (fromNetwork && toNetwork && sourceToken && fromTokenAmountBN && totalBonderFee && estimatedGasCost && toNetwork?.slug === ChainSlug.Optimism) {
          const payload :any = {
            gasCost: estimatedGasCost?.toString(),
            amount: fromTokenAmountBN?.toString(),
            token: sourceToken?.symbol,
            bonderFee: totalBonderFee.toString(),
            fromChain: fromNetwork?.slug
          }

          const query = new URLSearchParams(payload).toString()
          const apiBaseUrl = reactAppNetwork === 'goerli' ? 'https://hop-merkle-rewards-backend.hop.exchange' : 'https://optimism-fee-refund-api.hop.exchange'
          // const apiBaseUrl = 'http://localhost:8000'
          const url = `${apiBaseUrl}/v1/refund-amount?${query}`
          const res = await fetch(url)
          const json = await res.json()
          if (json.error) {
            throw new Error(json.error)
          }
          console.log(json.data.refund)
          const { refundAmountInRefundToken, refundAmountInUsd, refundTokenSymbol } = json.data.refund
          setFeeRefundTokenSymbol(refundTokenSymbol)
          if (refundAmountInUsd > 0) {
            setFeeRefund(refundAmountInRefundToken.toFixed(4))
            setFeeRefundUsd(refundAmountInUsd.toFixed(2))
          } else {
            setFeeRefund('')
            setFeeRefundUsd('')
          }
        } else {
          setFeeRefund('')
          setFeeRefundUsd('')
        }
      } catch (err) {
        console.error('fee refund fetch error:', err)
        setFeeRefund('')
        setFeeRefundUsd('')
      }
    }

    update().catch(console.error)
  }, [feeRefundEnabled, fromNetwork, toNetwork, sourceToken, fromTokenAmountBN, totalBonderFee, estimatedGasCost])

  // ==============================================================================================
  // Send tokens
  // ==============================================================================================

  const { tx, setTx, send, sending, setIsGnosisSafeWallet } = useSendTransaction({
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
    estimatedReceived: estimatedReceivedDisplay
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
    toNetwork,
  )

  useEffect(() => {
    setIsGnosisSafeWallet(gnosisEnabled)
  }, [gnosisEnabled])

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
    if (customRecipient) {
      if (gnosisEnabled && address?.eq(customRecipient)) {
        setManualWarning(
          'Warning: make sure gnosis safe exists at the destination chain otherwise it may result in lost funds.'
        )
      }
      setManualWarning(
        'Warning: transfers to exchanges that do not support internal transactions may result in lost funds.'
      )
    } else {
      setManualWarning('')
    }
  }, [fromNetwork?.slug, toNetwork?.slug, customRecipient, address])

  useEffect(() => {
    // if (fromNetwork?.slug === ChainSlug.Polygon || toNetwork?.slug === ChainSlug.Polygon) {
    //   return setManualError('Warning: transfers to/from Polygon are temporarily down.')
    // }
    // setManualError('')
  }, [fromNetwork?.slug, toNetwork?.slug])

  const transferTime = useMemo(() => {
    if (fromNetwork && toNetwork) {
      return getTransferTimeString(fromNetwork?.slug, toNetwork?.slug)
    }
  }, [fromNetwork, toNetwork])

  const { disabledTx } = useDisableTxs(fromNetwork, toNetwork, sourceToken?.symbol)

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
      (!disabledTx || disabledTx?.warningOnly) &&
      (gnosisEnabled ? isCorrectSignerNetwork : !isSmartContractWallet) &&
      !destinationChainPaused
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

  const showFeeRefund = feeRefundEnabled && toNetwork?.slug === ChainSlug.Optimism && !!feeRefund && !!feeRefundUsd && !!feeRefundTokenSymbol
  const feeRefundDisplay = feeRefund && feeRefundUsd && feeRefundTokenSymbol ? `${feeRefund} ($${feeRefundUsd})` : ''

  const AppWrapper = styled(Flex)<any>`
    background: ${({ theme }) => theme.colors.table.default};
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    padding: 16px;
    z-index: 1;
  `

  return (
    <AppWrapper
      column
      alignCenter
    >
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
        maxButtonFixedAmountToSubtract={sourceToken?.symbol === 'ETH' ? relayFeeEth : 0}
      />

      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={handleSwitchDirection} title="Click to switch direction">
          <ArrowDownIcon color="primary" className={styles.downArrow} />
        </IconButton>
      </Box>

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
        isOpen={customRecipient || isSmartContractWallet}
      />

      <div className={styles.smartContractWalletWarning}>
        <Alert severity={gnosisSafeWarning.severity}>{gnosisSafeWarning.text}</Alert>
      </div>

      {destinationChainPaused && (
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
              <FeeDetails bonderFee={bonderFeeDisplay} bonderFeeUsd={bonderFeeUsdDisplay} destinationTxFee={destinationTxFeeDisplay} destinationTxFeeUsd={destinationTxFeeUsdDisplay} relayFee={relayFeeEthDisplay} relayFeeUsd={relayFeeUsdDisplay} />
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
                transferTime={transferTime}
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
    </AppWrapper>
  )
}

export default Send
