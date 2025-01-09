import React, { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import logger from '#logger/index.js'
import useAvailableLiquidity from './useAvailableLiquidity.js'
import useIsSmartContractWallet from '#hooks/useIsSmartContractWallet.js'
import useSendData from '#pages/Send/useSendData.js'
import { Address } from '#models/Address.js'
import { BigNumber, utils } from 'ethers'
import { ChainSlug, HopBridge, Token } from '@hop-protocol/sdk'
import { DisabledRoute } from '#config/disabled.js'
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
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { Network } from '#models/Network.js'
import { Transaction } from '#models/Transaction.js'
import { amountToBN, formatError } from '#utils/format.js'
import { commafy, findMatchingBridge, networkSlugToId, sanitizeNumericalString, toTokenDisplay, toUsdDisplay } from '#utils/index.js'
import { getTransferTimeString } from '#utils/getTransferTimeString.js'
import { isMainnet, showRewards } from '#config/index.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useCheckTokenDeprecated } from '#hooks/useCheckTokenDeprecated.js'
import { useSendTransaction } from './useSendTransaction'
import { useWeb3Context } from '#contexts/Web3Context.js'

export type SendResponseProps = {
  accountAddress: Address | undefined
  amountOutMinDisplay: string
  amountOutMinUsdDisplay: string
  bonderFeeDisplay: string
  bonderFeeUsdDisplay: string
  bridges: HopBridge[]
  customRecipient: string
  deadline: () => number
  destinationTxFeeDisplay: string
  destinationTxFeeUsdDisplay: string
  disabledTx: DisabledRoute | undefined
  error: string
  estimatedReceivedDisplay: string
  estimatedReceivedUsdDisplay: string
  feeRefundDisplay: string
  feeRefundTokenSymbol: string
  fromAmountInputChangeHandler: (value: string) => void
  fromBalance: BigNumber
  fromNetwork: Network | undefined
  fromToken: Token
  fromTokenAmount: string
  gnosisSafeWarning: GnosisSafeWarning
  handleApprove: () => void
  handleBridgeChange: (event: ChangeEvent<{ value: unknown }>) => void
  handleCustomRecipientInput: (event: ChangeEvent<HTMLInputElement>) => void
  handleFromNetworkChange: (network: Network | undefined) => void
  handleSwitchDirection: () => void
  handleToNetworkChange: (network: Network | undefined) => void
  info: string
  isApproveButtonActive: boolean
  isApproving: boolean
  isDestinationChainPaused: boolean
  isLoadingFromBalance: boolean
  isLoadingSendData: boolean
  isLoadingToBalance: boolean
  isSendButtonActive: boolean
  isSmartContractWallet: boolean
  isSpecificRouteDeprecated: boolean
  manualError: string
  manualWarning: string
  maxButtonFixedAmountToSubtract: BigNumber
  needsApproval: boolean
  networks: Network[]
  placeholderToken: Token | undefined
  priceImpact: number
  rate: number
  relayFeeEthDisplay: string
  relayFeeUsdDisplay: string
  selectedBridge: HopBridge
  send: () => void
  setError: (error: string) => void
  setInfo: (info: string) => void
  setTx: (tx: Transaction | undefined) => void
  setWarning: (warning: string | ReactNode) => void
  showFeeRefund: boolean
  slippageTolerance: number
  toBalance: BigNumber
  toNetwork: Network | undefined
  toToken: Token
  toTokenAmount: string
  totalFeeDisplay: string
  totalFeeUsdDisplay: string
  transferTimeDisplay: string
  tx: Transaction | undefined
  warning: string | ReactNode
}

export function useSend(): SendResponseProps {
  const {
    bridges,
    networks,
    sdk,
    selectedBridge,
    setSelectedBridge,
    settings,
    txConfirm,
    txHistory
  } = useApp()
  const { slippageTolerance, deadline } = settings
  const { checkConnectedNetworkId, address: accountAddress, connectedNetworkId } = useWeb3Context()
  const { queryParams, updateQueryParams } = useQueryParams()
  const [fromNetwork, setFromNetwork] = useState<Network>()
  const [toNetwork, setToNetwork] = useState<Network>()
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [amountOutMinDisplay, setAmountOutMinDisplay] = useState<string>('')
  const [amountOutMinUsdDisplay, setAmountOutMinUsdDisplay] = useState<string>('')
  const [warning, setWarning] = useState<string | ReactNode>('')
  const [error, setError] = useState<string>('')
  const [noLiquidityWarning, setNoLiquidityWarning] = useState<string | ReactNode>('')
  const [minimumSendWarning, setMinimumSendWarning] = useState<string>('')
  const [info, setInfo] = useState<string>('')
  const [isLiquidityAvailable, setIsLiquidityAvailable] = useState<boolean>(true)
  const [customRecipient, setCustomRecipient] = useState<string>('')
  const [manualWarning, setManualWarning] = useState<string>('')
  const { isSmartContractWallet } = useIsSmartContractWallet()
  const [manualError, setManualError] = useState<string>('')
  const [feeRefund, setFeeRefund] = useState<string>('')
  const [feeRefundUsd, setFeeRefundUsd] = useState<string>('')
  const [feeRefundTokenSymbol, setFeeRefundTokenSymbol] = useState<string>('')
  const [isDestinationChainPaused, setIsDestinationChainPaused] = useState<boolean>(false)
  const [slippageToleranceTooLowWarning, setSlippageToleranceTooLowWarning] = useState<boolean>(false)
  const feeRefundEnabled = showRewards

  // Reset error message when fromNetwork/toNetwork changes
  useEffect(() => {
    if (warning) {
      setWarning('')
    }
    if (error) {
      setError('')
    }
  }, [fromNetwork, toNetwork])

  // Set fromNetwork and toNetwork if query params exist
  useEffect(() => {
    const selectedFromNetwork = networks.find(network => network.slug === queryParams.sourceNetwork)
    setFromNetwork(selectedFromNetwork)

    const selectedToNetwork = networks.find(network => network.slug === queryParams.destNetwork)
    if (selectedFromNetwork?.name !== selectedToNetwork?.name) {
      setToNetwork(selectedToNetwork)
    }
  }, [queryParams, networks])

  // use the values saved to localStorage for default network selection, if they exist
  useEffect(() => {
    try {
      const fromNetworkString = localStorage.getItem('fromNetwork')
      const savedFromNetwork = fromNetworkString ? JSON.parse(fromNetworkString) : ''

      const toNetworkString = localStorage.getItem('toNetwork')
      const savedToNetwork = toNetworkString ? JSON.parse(toNetworkString) : ''

      if (savedFromNetwork) {
        setFromNetworkAndUpdateQueryParams(savedFromNetwork)
      } else if (!queryParams.sourceNetwork) {
        setFromNetworkAndUpdateQueryParams(networks.find(network => network.chainId === networkSlugToId(ChainSlug.Ethereum)))
      }

      if (savedToNetwork) {
        setToNetworkAndUpdateQueryParams(savedToNetwork)
      }
    } catch (err: any) {
      logger.error(err)
    }
  }, [])

  // update localStorage on network change for persistent field values
  useEffect(() => {
    try {
      if (fromNetwork) {
        localStorage.setItem('fromNetwork', JSON.stringify(fromNetwork))
      } else {
        localStorage.removeItem('fromNetwork')
      }

      if (toNetwork) {
        localStorage.setItem('toNetwork', JSON.stringify(toNetwork))
      } else {
        localStorage.removeItem('toNetwork')
      }
    } catch (err: any) {
      logger.error(err)
    }
  }, [fromNetwork, toNetwork])

  // update fromNetwork to be the connectedNetwork on load and change
  useEffect(() => {
    if (connectedNetworkId) {
      const selectedNetwork = networks.find(network => network.chainId === connectedNetworkId)
      if (selectedNetwork) {
        setFromNetworkAndUpdateQueryParams(selectedNetwork)
      }
    }

    // ensure fromNetwork is not the same as toNetwork
    if (queryParams.sourceNetwork && queryParams.sourceNetwork === queryParams.destNetwork) {
      setToNetworkAndUpdateQueryParams(undefined)
    }
  }, [connectedNetworkId])

  // set amount input field to query param value on load, if it exists
  useEffect(() => {
    if (queryParams.amount && !Number.isNaN(Number(queryParams.amount))) {
      setFromTokenAmount(queryParams.amount as string)
      updateQueryParams({
        amount: undefined
      })
    }
  }, [queryParams])

  // Get assets
  const { unsupportedAsset, fromToken, toToken, placeholderToken } = useAssets(
    selectedBridge,
    fromNetwork,
    toNetwork
  )

  // Get token balances for both networks
  const { balance: fromBalance, loading: isLoadingFromBalance } = useBalance(fromToken, accountAddress)
  const { balance: toBalance, loading: isLoadingToBalance } = useBalance(toToken, accountAddress)

  // Set fromToken (string) to BigNumber
  const fromTokenAmountBN = useMemo<BigNumber>(() => {
    if (fromTokenAmount && fromToken) {
      return amountToBN(fromTokenAmount, fromToken.decimals)
    }
    return BigNumber.from(0)
  }, [fromToken, fromTokenAmount])

  // Get available liquidity
  const { availableLiquidity } = useAvailableLiquidity(
    selectedBridge,
    fromNetwork?.slug,
    toNetwork?.slug
  )

  // Use send data for tx
  const {
    adjustedBonderFee,
    adjustedDestinationTxFee,
    amountOut,
    amountOutMin,
    error: sendDataError,
    estimatedReceived,
    intermediaryAmountOutMin,
    loading: isLoadingSendData,
    priceImpact,
    rate,
    relayFeeEth,
    requiredLiquidity,
    totalFee,
  } = useSendData(fromToken, slippageTolerance, fromNetwork, toNetwork, fromTokenAmountBN)

  // Set toAmount field value based on calculated amountOut amount
  useEffect(() => {
    if (!toToken) {
      setToTokenAmount('')
      return
    }

    let amount : string = ''
    if (amountOut) {
      amount = toTokenDisplay(amountOut, toToken.decimals)
    }
    setToTokenAmount(amount)
  }, [toToken, amountOut])

  // check if destination bridge is paused
  useEffect(() => {
    async function update () {
      if (fromNetwork?.isL1 && toNetwork && fromToken) {
        const bridge = sdk.bridge(fromToken.symbol)
        const isPaused = await bridge.isDestinationChainPaused(toNetwork?.slug)
        setIsDestinationChainPaused(isPaused)
      } else {
        setIsDestinationChainPaused(false)
      }
    }

    update().catch(logger.error)
  }, [sdk, fromToken, fromNetwork, toNetwork])

  // Convert fees to displayed values
  const {
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    destinationTxFeeDisplay,
    destinationTxFeeUsdDisplay,
    estimatedReceivedDisplay,
    estimatedReceivedUsdDisplay,
    relayFeeEthDisplay,
    relayFeeUsdDisplay,
    tokenUsdPrice,
    totalBonderFee,
    totalFeeDisplay, // this is: totalFee = bonderFee + messageRelayFee
    totalFeeUsdDisplay, // this is: totalFee = bonderFee + messageRelayFee
  } = useFeeConversions({
    destinationTxFee: adjustedDestinationTxFee,
    bonderFee: adjustedBonderFee,
    estimatedReceived,
    destToken: toToken,
    relayFee: relayFeeEth
  })

  // set amounOutMin display values
  useEffect(() => {
    if (!amountOutMin || !toToken) {
      setAmountOutMinDisplay('')
      setAmountOutMinUsdDisplay('')
      return
    }
    let amountOutMinAdjusted = amountOutMin
    if (adjustedDestinationTxFee?.gt(0)) {
      amountOutMinAdjusted = amountOutMin.sub(adjustedDestinationTxFee)
    }

    if (amountOutMinAdjusted.lt(0)) {
      amountOutMinAdjusted = BigNumber.from(0)
    }

    const amountOutMinDisplay = toTokenDisplay(amountOutMinAdjusted, toToken.decimals, toToken.symbol)
    const amountOutMinUsdDisplay = toUsdDisplay(amountOutMinAdjusted, toToken.decimals, tokenUsdPrice)
    setAmountOutMinDisplay(amountOutMinDisplay)
    setAmountOutMinUsdDisplay(amountOutMinUsdDisplay)
  }, [amountOutMin, tokenUsdPrice])

  const { estimateSend } = useEstimateTxCost(fromNetwork)

  const { data: estimatedGasCost } = useTxResult(
    fromToken,
    fromNetwork,
    toNetwork,
    fromTokenAmountBN,
    estimateSend,
    { deadline }
  )

  const { sufficientBalance, warning: sufficientBalanceWarning } = useSufficientBalance(
    fromToken,
    fromTokenAmountBN,
    estimatedGasCost,
    fromBalance
  )

  const needsTokenForFee = useNeedsTokenForFee(fromNetwork)

  const isCheckingLiquidity = useMemo(() => {
    return !fromNetwork?.isLayer1 && availableLiquidity === undefined
  }, [fromNetwork, availableLiquidity])

  // ==============================================================================================
  // Error and warning messages
  // ==============================================================================================
  // Check if there is sufficient available liquidity
  useEffect(() => {
    const checkAvailableLiquidity = async () => {
      if (!toNetwork || !availableLiquidity || !requiredLiquidity || !fromToken) {
        setNoLiquidityWarning('')
        return
      }

      let isAvailable = BigNumber.from(availableLiquidity).gte(requiredLiquidity)
      if (fromNetwork?.isL1) {
        isAvailable = true
      }

      const formattedAmount = toTokenDisplay(availableLiquidity, fromToken.decimals)

      let message = `Insufficient liquidity. There is ${formattedAmount} ${fromToken.symbol} bonder liquidity available on ${toNetwork.name}. Please try again in a few minutes when liquidity becomes available again.`
      if (fromToken?.symbol === 'USDC') {
        message = `Insufficient liquidity. There is ${formattedAmount} ${fromToken.symbol} liquidity available on ${toNetwork.name} at the moment. Please try again at a later time when liquidity becomes available again.`
      }

      const warningMessage = (
        <>
          {message}{' '}
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
                  Required liquidity: {toTokenDisplay(requiredLiquidity, fromToken.decimals)}
                </div>
              </>
            }
          />
        </>
      )
      if (!isAvailable) {
        setIsLiquidityAvailable(false)
        return setNoLiquidityWarning(warningMessage)
      } else {
        setIsLiquidityAvailable(true)
        setNoLiquidityWarning('')
      }
    }

    checkAvailableLiquidity()
  }, [fromNetwork, fromToken, toNetwork, availableLiquidity, requiredLiquidity])

  useEffect(() => {
    const warningMessage = `Send at least ${destinationTxFeeDisplay} to cover the transaction fee`
    if (estimatedReceived?.lte(0) && adjustedDestinationTxFee?.gt(0)) {
      setMinimumSendWarning(warningMessage)
    } else if (minimumSendWarning) {
      setMinimumSendWarning('')
    }
  }, [estimatedReceived, adjustedDestinationTxFee])

  useEffect(() => {
    const a = Number(fromTokenAmount) || 0
    const b = Number(toTokenAmount) || 0
    const threshold = 0.3
    let isLow = false
    if (a && b && !isMainnet) {
      const diff =  (a - b) / ((a + b) / 2)
      if (diff > threshold) {
        isLow = diff > (Number(slippageTolerance) / 100)
      }
    }
    setSlippageToleranceTooLowWarning(isLow)
  }, [sdk, slippageTolerance, toTokenAmount, fromTokenAmount])

  useEffect(() => {
    const isUSDCe = fromToken?.symbol === 'USDC.e'
    if (isUSDCe) {
      setInfo('Notice: Native USDC (not USDC.e) will be received at the destination.')
    } else {
      setInfo('')
    }
  }, [fromToken])

  // set warning message
  useEffect(() => {
    try {
      let message: string | ReactNode = ''

      const isFavorableSlippage = Number(toTokenAmount) >= Number(fromTokenAmount)
      const isHighPriceImpact = priceImpact && priceImpact !== 100 && Math.abs(priceImpact) >= 1
      const showPriceImpactWarning = isHighPriceImpact && !isFavorableSlippage
      const bonderFeeMajority = fromToken?.decimals && estimatedReceived && totalFee && ((Number(utils.formatUnits(totalFee, fromToken?.decimals)) / Number(fromTokenAmount)) > 0.5)
      const insufficientRelayFeeFunds = fromToken?.symbol === 'ETH' && fromTokenAmountBN?.gt(0) && relayFeeEth?.gt(0) && fromBalance && fromTokenAmountBN?.gt(fromBalance.sub(relayFeeEth))
      const notEnoughBonderFee = estimatedReceived && adjustedBonderFee?.gt(estimatedReceived)
      const estimatedReceivedLow = estimatedReceived?.lte(0)

      if (noLiquidityWarning) {
        message = noLiquidityWarning
      } else if (minimumSendWarning) {
        message = minimumSendWarning
      } else if (notEnoughBonderFee) {
        message = 'Bonder fee greater than estimated received. A higher amount is needed to cover fees.'
      } else if (sufficientBalanceWarning) {
        message = sufficientBalanceWarning
      } else if (insufficientRelayFeeFunds) {
        message = `Insufficient balance to cover the cost of tx. Please add ${fromToken.nativeTokenSymbol} to pay for tx fees.`
      } else if (estimatedReceivedLow) {
        message = 'Estimated received too low. Send a higher amount to cover the fees.'
      } else if (showPriceImpactWarning) {
        message = `Warning: Price impact is high. Slippage is ${commafy(priceImpact)}%`
      } else if (bonderFeeMajority) {
        message = 'Warning: More than 50% of amount will go towards bonder fee'
      } else if (slippageToleranceTooLowWarning) {
        message = `Warning: Swap at destination might fail due to slippage tolerance used (${slippageTolerance}%). Try increasing slippage if you don't want to receive h${fromToken?.symbol}.`
      }

      setWarning(message)
    } catch (err: any) {
      logger.error(err)
      setWarning('')
    }
  }, [
    estimatedReceived,
    fromBalance,
    fromToken,
    fromTokenAmount,
    fromTokenAmountBN,
    minimumSendWarning,
    noLiquidityWarning,
    priceImpact,
    relayFeeEth,
    slippageTolerance,
    slippageToleranceTooLowWarning,
    sufficientBalanceWarning,
    toNetwork,
    toTokenAmount,
    totalFee,
  ])

  // set error message
  useEffect(() => {
    let errMsg : string = ''
    if (sendDataError) {
      errMsg = formatError(sendDataError)
    } else if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      errMsg = `${tokenSymbol} is currently not supported on ${chain}`
    }

    setError(errMsg)
  }, [sendDataError, unsupportedAsset])

  // ==============================================================================================
  // Approve fromNetwork / fromToken
  // ==============================================================================================

  const { approve, checkApproval } = useApprove(fromToken)

  const needsApproval = useAsyncMemo(async () => {
    try {
      if (!(fromNetwork && toNetwork && fromToken && fromTokenAmount)) {
        return false
      }

      const parsedAmount = amountToBN(fromTokenAmount, fromToken.decimals)
      const bridge = sdk.bridge(fromToken.symbol)

      const isHTokenTransfer = false
      const spender: string = bridge.getSendApprovalAddress(fromNetwork.slug, isHTokenTransfer, toNetwork.slug)
      const isApprovalOk = await checkApproval(parsedAmount, fromToken, spender)
      return isApprovalOk
    } catch (err: any) {
      logger.error(err)
      return false
    }
  }, [sdk, fromNetwork, toNetwork, fromToken, fromTokenAmount, checkApproval]) ?? false

  const approveFromToken = async () => {
    if (!fromNetwork) {
      throw new Error('No fromNetwork selected')
    }

    if (!toNetwork) {
      throw new Error('No toNetwork selected')
    }

    if (!fromToken) {
      throw new Error('No from token selected')
    }

    if (!fromTokenAmount) {
      throw new Error('No amount to approve')
    }

    const networkId = Number(fromNetwork.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) {
      throw new Error(`wrong network connected on wallet. Expected chainId "${networkId}", got "${connectedNetworkId}"`)
    }

    const parsedAmount = amountToBN(fromTokenAmount, fromToken.decimals)
    const bridge = sdk.bridge(fromToken.symbol)

    const isHTokenTransfer = false
    const spender: string = bridge.getSendApprovalAddress(fromNetwork.slug, isHTokenTransfer, toNetwork.slug)
    const tx = await approve(parsedAmount, fromToken, spender)

    await tx?.wait()
  }

  const handleApprove = async () => {
    try {
      setError('')
      setIsApproving(true)
      await approveFromToken()
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, fromNetwork))
      }
      logger.error(err)
    }
    setIsApproving(false)
  }

  // ==============================================================================================
  // Fee refund
  // ==============================================================================================

  useEffect(() => {
    async function update () {
      try {
        if (!(isMainnet && feeRefundEnabled && fromNetwork && toNetwork && fromToken && fromTokenAmountBN && totalBonderFee && estimatedGasCost && [ChainSlug.Optimism].includes(toNetwork?.slug as ChainSlug))) {
          setFeeRefund('')
          setFeeRefundUsd('')
          return
        }

        let gasCost = estimatedGasCost?.toString()

        // reduce estimated gas cost for fee refund display due to hardcoded gas limit in sdk being too high.
        // this can be removed once the sdk txOverrides is fixed.
        if (fromNetwork?.isL1) {
          if (toNetwork.slug === ChainSlug.Optimism) {
            gasCost = BigNumber.from(gasCost).div(2).toString()
          }
          if (toNetwork.slug === ChainSlug.Arbitrum) {
            gasCost = BigNumber.from(gasCost).div(6).toString()
          }
        }

        let tokenSymbol = fromToken?.symbol
        if (tokenSymbol === 'USDC.e') {
          tokenSymbol = 'USDC'
        }
        const payload :Record<string, string> = {
          gasCost,
          amount: fromTokenAmountBN?.toString(),
          token: tokenSymbol,
          bonderFee: totalBonderFee.toString(),
          fromChain: fromNetwork?.slug
        }

        const query = new URLSearchParams(payload).toString()
        const apiBaseUrl = `https://${toNetwork.slug}-fee-refund-api.hop.exchange`
        // const apiBaseUrl = 'http://localhost:8000'
        const url = `${apiBaseUrl}/v1/refund-amount?${query}`
        const res = await fetch(url)
        const json = await res.json()
        if (json.error) {
          throw new Error(json.error)
        }
        logger.log(json.data.refund)
        const { refundAmountInRefundToken, refundAmountInUsd, refundTokenSymbol } = json.data.refund
        setFeeRefundTokenSymbol(refundTokenSymbol)
        if (refundAmountInUsd > 0) {
          setFeeRefund(refundAmountInRefundToken.toFixed(4))
          setFeeRefundUsd(refundAmountInUsd.toFixed(2))
        } else {
          setFeeRefund('')
          setFeeRefundUsd('')
        }
      } catch (err) {
        logger.error('fee refund fetch error:', err)
        setFeeRefund('')
        setFeeRefundUsd('')
      }
    }

    update().catch(logger.error)
  }, [feeRefundEnabled, fromNetwork, toNetwork, fromToken, fromTokenAmountBN, totalBonderFee, estimatedGasCost])

  // ==============================================================================================
  // Send tokens
  // ==============================================================================================

  const { tx, setTx, send, setIsGnosisSafeWallet } = useSendTransaction({
    amountOutMin,
    customRecipient,
    deadline,
    estimatedReceived: estimatedReceivedDisplay,
    fromNetwork,
    fromToken,
    fromTokenAmount,
    intermediaryAmountOutMin,
    sdk,
    setError,
    toNetwork,
    totalFee,
    txConfirm,
    txHistory,
  })

  useEffect(() => {
    if (tx) {
      // clear from token input field after sending tx
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

  // Set from Network
  const setFromNetworkAndUpdateQueryParams = (network: Network | undefined) => {
    updateQueryParams({
      sourceNetwork: network?.slug ?? '',
    })
    setFromNetwork(network)
  }

  // Set to Network
  const setToNetworkAndUpdateQueryParams = (network: Network | undefined) => {
    updateQueryParams({
      destNetwork: network?.slug ?? '',
    })
    setToNetwork(network)
  }

  // Switch the fromNetwork <--> toNetwork
  const handleSwitchDirection = () => {
    setToTokenAmount('')
    setFromNetworkAndUpdateQueryParams(toNetwork)
    setToNetworkAndUpdateQueryParams(fromNetwork)
  }

  // the fromNetwork input handler
  const handleFromNetworkChange = (network: Network | undefined) => {
    if (network?.slug === toNetwork?.slug) {
      handleSwitchDirection()
    } else {
      setFromNetworkAndUpdateQueryParams(network)
    }
  }

  // the toNetwork input handler
  const handleToNetworkChange = (network: Network | undefined) => {
    if (network?.slug === fromNetwork?.slug) {
      handleSwitchDirection()
    } else {
      setToNetworkAndUpdateQueryParams(network)
    }
  }

  const fromAmountInputChangeHandler = (value: string) => {
    if (!value) {
      setFromTokenAmount('')
      setToTokenAmount('')
      return
    }

    const amountIn = sanitizeNumericalString(value)
    setFromTokenAmount(amountIn)
  }

  // custom recipient handler
  const handleCustomRecipientInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    setCustomRecipient(value)
  }

  // custom recipient warning message
  useEffect(() => {
    if (customRecipient) {
      if (gnosisEnabled && accountAddress?.eq(customRecipient)) {
        setManualWarning(
          'Warning: make sure Gnosis Safe exists at the destination chain otherwise it may result in lost funds.'
        )
      } else if (isSmartContractWallet && accountAddress?.eq(customRecipient)) {
        setManualWarning(
          'Warning: make sure smart contract wallet exists at the destination chain otherwise it may result in lost funds.'
        )
      } else {
        setManualWarning(
          'Warning: Transfers to exchanges that do not support internal transactions may result in lost funds. If the recipient is not an exchange address, then you can ignore this warning.'
        )
      }
    } else if (isSmartContractWallet && !customRecipient) {
        setManualWarning(
          'The connected wallet is a smart contract wallet. Please set the recipient address above. Make sure the recipient can receive funds at the destination chain.'
        )
    } else {
      setManualWarning('')
    }
  }, [gnosisEnabled, isSmartContractWallet, fromNetwork?.slug, toNetwork?.slug, customRecipient, accountAddress])

  // reset manual warning on network change
  useEffect(() => {
    setManualError('')
  }, [fromNetwork?.slug, toNetwork?.slug])

  const transferTimeDisplay = useMemo(() => {
    if (fromNetwork && toNetwork) {
      return getTransferTimeString(fromNetwork?.slug, toNetwork?.slug)
    }
    return ''
  }, [fromNetwork, toNetwork])

  const { disabledTx } = useDisableTxs(fromNetwork, toNetwork, fromToken?.symbol)

  const isTokenDeprecated = useCheckTokenDeprecated(fromToken?.symbol)
  const isSpecificRouteDeprecated = useMemo(() => {
    if (isTokenDeprecated && !toNetwork?.isL1) {
      return true
    }

    if (fromNetwork && toNetwork && selectedBridge && ['USDC', 'USDC.e', 'MAGIC'].includes(fromToken?.symbol) && !selectedBridge?.getIsSupportedCctpRoute(fromNetwork?.slug, toNetwork?.slug)) {
      return true
    }

    return false
  }, [fromNetwork, toNetwork, fromToken?.symbol, selectedBridge])

  const isApproveButtonActive = !!(!needsTokenForFee && !unsupportedAsset && needsApproval && !isSpecificRouteDeprecated)

  const isSendButtonActive = useMemo(() => {
    return !!(
      !needsApproval &&
      !isApproveButtonActive &&
      !isCheckingLiquidity &&
      !isLoadingToBalance &&
      !isLoadingSendData &&
      fromTokenAmount &&
      toTokenAmount &&
      rate &&
      sufficientBalance &&
      isLiquidityAvailable &&
      estimatedReceived?.gt(0) &&
      !manualError &&
      (!disabledTx || disabledTx?.warningOnly) &&
      (gnosisEnabled ? (isSmartContractWallet && isCorrectSignerNetwork && !!customRecipient) : (isSmartContractWallet ? !!customRecipient : true)) &&
      !isDestinationChainPaused &&
      !isSpecificRouteDeprecated
    )
  }, [
    disabledTx,
    estimatedReceived,
    fromNetwork?.slug,
    fromToken?.symbol,
    fromTokenAmount,
    gnosisEnabled,
    isApproveButtonActive,
    isCheckingLiquidity,
    isCorrectSignerNetwork,
    isLiquidityAvailable,
    isLoadingSendData,
    isLoadingToBalance,
    isSmartContractWallet,
    isTokenDeprecated,
    manualError,
    needsApproval,
    rate,
    sufficientBalance,
    toNetwork?.slug,
    toTokenAmount,
  ])

  const showFeeRefund = feeRefundEnabled && [ChainSlug.Optimism, ChainSlug.Arbitrum].includes(toNetwork?.slug as ChainSlug) && !!feeRefund && !!feeRefundUsd && !!feeRefundTokenSymbol
  const feeRefundDisplay = feeRefund && feeRefundUsd && feeRefundTokenSymbol ? `${feeRefund} ($${feeRefundUsd})` : ''
  const maxButtonFixedAmountToSubtract = fromToken?.symbol === 'ETH' ? relayFeeEth : BigNumber.from(0)

  return {
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
  }
}
