import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import Box from '@material-ui/core/Box'
import MuiButton from '@material-ui/core/Button'
import Button from 'src/components/buttons/Button'
import SendIcon from '@material-ui/icons/Send'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import AmountSelectorCard from 'src/pages/Send/AmountSelectorCard'
import Alert from 'src/components/alert/Alert'
import TxStatusModal from 'src/components/txStatus/TxStatusModal'
import DetailRow from 'src/components/DetailRow'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import logger from 'src/logger'
import { commafy, normalizeNumberInput, toTokenDisplay } from 'src/utils'
import useAvailableLiquidity from 'src/pages/Send/useAvailableLiquidity'
import useBalance from 'src/hooks/useBalance'
import useSendData from 'src/pages/Send/useSendData'
import useNeedsTokenForFee from 'src/hooks/useNeedsTokenForFee'
import useQueryParams from 'src/hooks/useQueryParams'
import AmmDetails from 'src/components/AmmDetails'
import FeeDetails from 'src/components/FeeDetails'
import useApprove from 'src/hooks/useApprove'
import { reactAppNetwork } from 'src/config'
import InfoTooltip from 'src/components/infoTooltip'
import { amountToBN, formatError } from 'src/utils/format'
import { useFeeConversions } from 'src/hooks/useFeeConversions'
import { useSendStyles } from './useSendStyles'
import { useAssets } from 'src/hooks/useAssets'
import SendHeader from './SendHeader'
import CustomRecipientDropdown from './CustomRecipientDropdown'
import { Flex } from 'src/components/ui'
import { useSendTransaction } from './useSendTransaction'

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
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const [approving, setApproving] = useState<boolean>(false)
  const [feeDisplay, setFeeDisplay] = useState<string>()
  const [amountOutMinDisplay, setAmountOutMinDisplay] = useState<string>()
  const [warning, setWarning] = useState<any>(null)
  const [error, setError] = useState<string | null | undefined>(null)
  const [noLiquidityWarning, setNoLiquidityWarning] = useState<any>(null)
  const [needsNativeTokenWarning, setNeedsNativeTokenWarning] = useState<string>()
  const [minimumSendWarning, setMinimumSendWarning] = useState<string | null | undefined>(null)
  const [info, setInfo] = useState<string | null | undefined>(null)
  const [isLiquidityAvailable, setIsLiquidityAvailable] = useState<boolean>(true)
  const [customRecipient, setCustomRecipient] = useState<string>('')

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
  const { balance: fromBalance, loading: loadingFromBalance } = useBalance(
    sourceToken,
    fromNetwork,
    address
  )
  const { balance: toBalance, loading: loadingToBalance } = useBalance(
    destToken,
    toNetwork,
    address
  )

  // Get available liquidity
  const availableLiquidity = useAvailableLiquidity(
    selectedBridge,
    fromNetwork?.slug,
    toNetwork?.slug
  )

  // Set fromToken -> BN
  const fromTokenAmountBN = useMemo<BigNumber | undefined>(() => {
    if (sourceToken) {
      return amountToBN(fromTokenAmount, sourceToken.decimals)
    }
  }, [sourceToken, fromTokenAmount])

  // Use send data for tx
  const {
    amountOut,
    rate,
    priceImpact,
    amountOutMin,
    intermediaryAmountOutMin,
    bonderFee,
    lpFees,
    requiredLiquidity,
    loading: loadingSendData,
    destinationTxFee,
    estimatedReceived,
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
    totalBonderFee,
    totalBonderFeeDisplay,
    estimatedReceivedDisplay,
  } = useFeeConversions(destinationTxFee, bonderFee, estimatedReceived, destToken)

  // Check if user has enough balance (more than the inputed value)
  const enoughBalance = useMemo(() => {
    if (fromBalance && fromTokenAmountBN && fromBalance.lt(fromTokenAmountBN)) {
      return false
    }
    return true
  }, [fromBalance, fromTokenAmountBN])

  // ==============================================================================================
  // Error and warning messages
  // ==============================================================================================

  // Set error message if asset is unsupported
  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else {
      setError('')
    }
  }, [unsupportedAsset])

  // Reset error message when fromNetwork changes
  useEffect(() => {
    setError('')
  }, [fromNetwork])

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
          Insufficient liquidity. There is {formattedAmount} {sourceToken.symbol} available on{' '}
          {toNetwork.name}.{' '}
          <InfoTooltip
            title={<><div>The Bonder does not have enough liquidity to bond the transfer at the destination.</div><div>Available liquidity: {formattedAmount}</div><div>Required liquidity: {toTokenDisplay(requiredLiquidity, sourceToken.decimals)}</div></>}
          />
        </>
      )
      if (!isAvailable && !fromNetwork?.isLayer1) {
        if (reactAppNetwork !== 'staging') {
          setIsLiquidityAvailable(false)
          setNoLiquidityWarning(warningMessage)
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
    if (needsTokenForFee && fromNetwork) {
      setNeedsNativeTokenWarning(
        `Add ${fromNetwork.nativeTokenSymbol} to your account on ${fromNetwork.name} for the transaction fee.`
      )
    } else {
      setNeedsNativeTokenWarning('')
    }
  }, [needsTokenForFee, fromNetwork])

  useEffect(() => {
    const warningMessage = `Send at least ${destinationTxFeeDisplay} to cover the transaction fee`
    if (estimatedReceived?.lte(0) && destinationTxFee?.gt(0)) {
      setMinimumSendWarning(warningMessage)
    } else {
      setMinimumSendWarning('')
    }
  }, [estimatedReceived, destinationTxFee])

  useEffect(() => {
    let message = noLiquidityWarning || minimumSendWarning

    if (!enoughBalance) {
      message = 'Insufficient funds'
    } else if (estimatedReceived && bonderFee?.gt(estimatedReceived)) {
      message = 'Bonder fee greater than estimated received'
    } else if (estimatedReceived?.lte(0)) {
      message = 'Insufficient amount. Send higher amount to cover bonder fee.'
    }

    if (needsNativeTokenWarning) {
      message = needsNativeTokenWarning
    }

    setWarning(message)
  }, [
    noLiquidityWarning,
    needsNativeTokenWarning,
    minimumSendWarning,
    enoughBalance,
    estimatedReceived,
  ])

  useEffect(() => {
    if (!lpFees || !sourceToken) {
      setFeeDisplay(undefined)
      return
    }

    const smallestFeeDecimals = sourceToken.decimals - 5
    const smallestFee = BigNumber.from(10 ** smallestFeeDecimals)
    let feeAmount: string
    if (lpFees.gt('0') && lpFees.lt(smallestFee)) {
      feeAmount = `<${formatUnits(smallestFee, sourceToken.decimals)}`
    } else {
      feeAmount = commafy(formatUnits(lpFees, sourceToken.decimals), 5)
    }

    setFeeDisplay(`${feeAmount} ${sourceToken.symbol}`)
  }, [lpFees])

  useEffect(() => {
    if (!amountOutMin || !sourceToken) {
      setAmountOutMinDisplay(undefined)
      return
    }
    let _amountOutMin = amountOutMin
    if (destinationTxFee?.gt(0)) {
      _amountOutMin = _amountOutMin.sub(destinationTxFee)
    }

    if (_amountOutMin.lt(0)) {
      _amountOutMin = BigNumber.from(0)
    }

    const amountOutMinFormatted = commafy(formatUnits(_amountOutMin, sourceToken.decimals), 4)
    setAmountOutMinDisplay(`${amountOutMinFormatted} ${sourceToken.symbol}`)
  }, [amountOutMin])

  // ==============================================================================================
  // Approve fromNetwork / fromToken
  // ==============================================================================================

  const { approve, checkApproval } = useApprove()

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
    bonderFee,
    customRecipient,
    deadline,
    destinationTxFee,
    fromNetwork,
    fromTokenAmount,
    intermediaryAmountOutMin,
    sdk,
    setError,
    sourceToken,
    toNetwork,
    txConfirm,
    txHistory,
  })

  // ==============================================================================================
  // User actions
  // - Bridge / Network selection
  // - Custom recipient input
  // ==============================================================================================

  // Change the bridge if user selects different token to send
  const handleBridgeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const bridge = bridges.find(bridge => bridge.getTokenSymbol() === tokenSymbol)
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
    if (network === toNetwork) {
      handleSwitchDirection()
    } else {
      setFromNetwork(network)
    }
  }

  // Change the toNetwork
  const handleToNetworkChange = (network: Network | undefined) => {
    if (network === fromNetwork) {
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

  const validFormFields = !!(
    fromTokenAmount &&
    toTokenAmount &&
    rate &&
    enoughBalance &&
    !needsTokenForFee &&
    isLiquidityAvailable &&
    !checkingLiquidity &&
    estimatedReceived?.gt(0)
  )

  const approveButtonActive = !needsTokenForFee && !unsupportedAsset && needsApproval
  const sendButtonActive = validFormFields && !unsupportedAsset && !needsApproval

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <SendHeader
        styles={styles}
        bridges={bridges}
        selectedBridge={selectedBridge}
        handleBridgeChange={handleBridgeChange}
      />

      <AmountSelectorCard
        value={fromTokenAmount}
        token={sourceToken ?? placeholderToken}
        label={'From'}
        onChange={value => {
          if (!value) {
            setFromTokenAmount('')
            setToTokenAmount('')
            return
          }

          const amountIn = normalizeNumberInput(value)
          setFromTokenAmount(amountIn)
        }}
        selectedNetwork={fromNetwork}
        networkOptions={networks}
        onNetworkChange={handleFromNetworkChange}
        balance={fromBalance}
        loadingBalance={loadingFromBalance}
      />

      <MuiButton className={styles.switchDirectionButton} onClick={handleSwitchDirection}>
        <ArrowDownIcon color="primary" className={styles.downArrow} />
      </MuiButton>

      <AmountSelectorCard
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
      />

      <div className={styles.details}>
        <div className={styles.destinationTxFeeAndAmount}>
          {totalBonderFee?.gt(0) && (
            <DetailRow
              title={'Fees'}
              tooltip={
                <FeeDetails
                  bonderFee={bonderFeeDisplay}
                  destinationTxFee={destinationTxFeeDisplay}
                />
              }
              value={totalBonderFeeDisplay}
              large
            />
          )}
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
            large
            bold
          />
        </div>
      </div>

      <Alert severity="error" onClose={() => setError(null)} text={error} />
      {!error && <Alert severity="warning">{warning}</Alert>}

      <Box className={styles.buttons} display="flex" flexDirection="row" alignItems="center">
        <Button
          className={styles.button}
          large
          highlighted={!!needsApproval}
          disabled={!approveButtonActive}
          onClick={handleApprove}
          loading={approving}
        >
          Approve
        </Button>
        <Button
          className={styles.button}
          startIcon={sendButtonActive && <SendIcon />}
          onClick={send}
          disabled={!sendButtonActive}
          loading={sending}
          large
          highlighted
        >
          Send
        </Button>
      </Box>

      <Flex mt={1}>
        <Alert severity="info" onClose={() => setInfo(null)} text={info} />
        {tx && <TxStatusModal onClose={() => setTx(null)} tx={tx} />}
      </Flex>
    </Box>
  )
}

export default Send
