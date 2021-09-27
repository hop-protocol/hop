import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import Card from '@material-ui/core/Card'
import LargeTextField from 'src/components/LargeTextField'
import { makeStyles } from '@material-ui/core/styles'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import Button from 'src/components/buttons/Button'
import SendIcon from '@material-ui/icons/Send'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import MenuItem from '@material-ui/core/MenuItem'
import { Token } from '@hop-protocol/sdk'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import SelectOption from 'src/components/selects/SelectOption'
import AmountSelectorCard from 'src/pages/Send/AmountSelectorCard'
import Transaction from 'src/models/Transaction'
import Alert from 'src/components/alert/Alert'
import TxStatusModal from 'src/components/txStatus/TxStatusModal'
import DetailRow from 'src/components/DetailRow'
import { BigNumber, ethers } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import logger from 'src/logger'
import { commafy, getBonderFeeWithId, normalizeNumberInput, toTokenDisplay } from 'src/utils'
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
import { formatError } from 'src/utils/format'

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'center',
    width: '46.0rem',
    position: 'relative'
  },
  sendSelect: {
    marginBottom: '4.2rem'
  },
  sendLabel: {
    marginRight: '1.8rem'
  },
  downArrow: {
    margin: '0.8rem',
    height: '2.4rem',
    width: '2.4rem'
  },
  switchDirectionButton: {
    padding: 0,
    minWidth: 0,
    margin: '1.0rem'
  },
  details: {
    marginTop: '4.2rem',
    marginBottom: '5.4rem',
    width: '46.0rem',
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    }
  },
  detailRow: {},
  detailLabel: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  txStatusInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txStatusCloseButton: {
    marginTop: '1rem'
  },
  semiBold: {
    fontWeight: 600
  },
  extraBold: {
    fontWeight: 800
  },
  destinationTxFeeAndAmount: {
    marginTop: '2.4rem'
  },
  detailsDropdown: {
    marginTop: '2rem',
    width: '50.0rem',
    '&[open] summary span::before': {
      content: '"▾"',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    },
  },
  detailsDropdownSummary: {
    listStyle: 'none',
    display: 'block',
    textAlign: 'right',
    fontWeight: 'normal',
    paddingRight: '4rem',
    '&::marker': {
      display: 'none'
    }
  },
  detailsDropdownLabel: {
    position: 'relative',
    cursor: 'pointer',
    '& > span': {
      position: 'relative',
      display: 'inline-flex',
      justifyItems: 'center',
      alignItems: 'center'
    },
    '& > span::before': {
      display: 'block',
      content: '"▸"',
      position: 'absolute',
      top: '0',
      right: '-1.5rem',
    }
  },
  customRecipient: {
    width: '100%',
    padding: '2rem 0'
  },
  customRecipientLabel: {
    marginBottom: '1.5rem'
  },
  buttons: {
    marginTop: theme.padding.default
  },
  button: {
    margin: `0 ${theme.padding.light}`,
    width: '17.5rem'
  },
}))

const Send: FC = () => {
  const styles = useStyles()
  const {
    networks,
    txConfirm,
    txHistory,
    sdk,
    bridges,
    selectedBridge,
    setSelectedBridge,
    settings
  } = useApp()
  const {
    slippageTolerance,
    deadline
  } = settings
  const {
    provider,
    walletConnected,
    checkConnectedNetworkId,
    address
  } = useWeb3Context()
  const { queryParams, updateQueryParams } = useQueryParams()

  const [fromNetwork, _setFromNetwork] = useState<Network>()
  const [toNetwork, _setToNetwork] = useState<Network>()

  useEffect(() => {
    const _fromNetwork = networks.find(network =>
      network.slug === queryParams.sourceNetwork
    )
    _setFromNetwork(_fromNetwork)

    const _toNetwork = networks.find(network =>
      network.slug === queryParams.destNetwork
    )
    _setToNetwork(_toNetwork)
  }, [queryParams, networks])

  const setFromNetwork = (network: Network | undefined) => {
    updateQueryParams({
      sourceNetwork: network?.slug ?? ''
    })

    _setFromNetwork(network)
  }

  const setToNetwork = (network: Network | undefined) => {
    updateQueryParams({
      destNetwork: network?.slug ?? ''
    })

    _setToNetwork(network)
  }

  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const [approving, setApproving] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)
  const [feeDisplay, setFeeDisplay] = useState<string>()
  const [amountOutMinDisplay, setAmountOutMinDisplay] = useState<string>()
  const [warning, setWarning] = useState<any>(null)
  const [error, setError] = useState<string | null | undefined>(null)
  const [noLiquidityWarning, setNoLiquidityWarning] = useState<any>(null)
  const [needsNativeTokenWarning, setNeedsNativeTokenWarning] = useState<string | null | undefined>(null)
  const [minimumSendWarning, setMinimumSendWarning] = useState<string | null | undefined>(null)
  const [info, setInfo] = useState<string | null | undefined>(null)
  const [tx, setTx] = useState<Transaction | null>(null)
  const [isLiquidityAvailable, setIsLiquidityAvailable] = useState<boolean>(
    true
  )
  const [customRecipient, setCustomRecipient] = useState<string>('')

  const unsupportedAsset = useMemo<any>(() => {
    if (!(
      selectedBridge &&
      fromNetwork &&
      toNetwork
    )) {
      return null
    }
    const unsupportedAssets = {
      Optimism: 'MATIC',
      Arbitrum: 'MATIC'
    }

    for (const chain in unsupportedAssets) {
      const tokenSymbol = unsupportedAssets[chain]
      const isUnsupported = (selectedBridge?.getTokenSymbol() === tokenSymbol && (
        [fromNetwork?.slug, toNetwork?.slug].includes(chain.toLowerCase())
      ))
      if (isUnsupported) {
        return {
          chain,
          tokenSymbol
        }
      }
    }

    return null
  }, [selectedBridge, fromNetwork, toNetwork])

  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else {
      setError('')
    }
  }, [unsupportedAsset])

  const sourceToken = useMemo(() => {
    try {
      if (!fromNetwork || !selectedBridge) return
      return selectedBridge.getCanonicalToken(fromNetwork?.slug)
    } catch (err) {
      logger.error(err)
    }
  }, [selectedBridge, fromNetwork])
  const destToken = useMemo(() => {
    try {
      if (!toNetwork || !selectedBridge) return
      return selectedBridge.getCanonicalToken(toNetwork?.slug)
    } catch (err) {
      logger.error(err)
    }
  }, [selectedBridge, toNetwork])
  const placeholderToken = useMemo(() => {
    if (!selectedBridge) return
    return selectedBridge.getL1Token()
  }, [selectedBridge])

  const { balance: fromBalance, loading: loadingFromBalance } = useBalance(
    sourceToken,
    fromNetwork,
    address,
  )
  const { balance: toBalance, loading: loadingToBalance } = useBalance(
    destToken,
    toNetwork,
    address,
  )

  // Reset error message
  useEffect(() => {
    setError('')
  }, [fromNetwork]);

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

  const amountToBN = (token: Token | undefined, amount: string): BigNumber | undefined => {
    if (!token) return
    let val
    try {
      const sanitizedAmount = amount.replace(/,/g, '')
      val = parseUnits(sanitizedAmount, token.decimals)
    } catch (err) {
      // noop
    }
    return val
  }

  const fromTokenAmountBN = useMemo<BigNumber | undefined>(() => {
    return amountToBN(sourceToken, fromTokenAmount)
  }, [sourceToken, fromTokenAmount])

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
    estimatedReceived
  } = useSendData(
    sourceToken,
    slippageTolerance,
    fromNetwork,
    toNetwork,
    fromTokenAmountBN
  )

  let totalBonderFee = destinationTxFee
  if (destinationTxFee && bonderFee) {
    totalBonderFee = destinationTxFee.add(bonderFee)
  }

  const bonderFeeDisplay = toTokenDisplay(
    bonderFee,
    destToken?.decimals,
    destToken?.symbol
  )

  const destinationTxFeeDisplay = toTokenDisplay(
    destinationTxFee,
    destToken?.decimals,
    destToken?.symbol
  )

  const totalBonderFeeDisplay = toTokenDisplay(
    totalBonderFee,
    destToken?.decimals,
    destToken?.symbol
  )

  const estimatedReceivedDisplay = toTokenDisplay(
    estimatedReceived,
    destToken?.decimals,
    destToken?.symbol
  )

  const needsTokenForFee = useNeedsTokenForFee(fromNetwork)

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

  let enoughBalance = true
  if (fromBalance && fromTokenAmountBN && fromBalance.lt(fromTokenAmountBN)) {
    enoughBalance = false
  }

  const availableLiquidity = useAvailableLiquidity(selectedBridge, fromNetwork?.slug, toNetwork?.slug)

  const handleBridgeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const bridge = bridges.find(bridge => bridge.getTokenSymbol() === tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  const handleSwitchDirection = () => {
    setToTokenAmount('')
    setFromNetwork(toNetwork)
    setToNetwork(fromNetwork)
  }

  const handleToNetworkChange = (network: Network | undefined) => {
    if (network === fromNetwork) {
      handleSwitchDirection()
    } else {
      setToNetwork(network)
    }
  }

  const handleFromNetworkChange = (network: Network | undefined) => {
    if (network === toNetwork) {
      handleSwitchDirection()
    } else {
      setFromNetwork(network)
    }
  }

  useEffect(() => {
    const checkAvailableLiquidity = async () => {
      if (
        !toNetwork ||
        !availableLiquidity ||
        !requiredLiquidity ||
        !sourceToken
      ) {
        setNoLiquidityWarning('')
        return
      }

      const isAvailable = BigNumber.from(availableLiquidity).gte(
        requiredLiquidity
      )

      const formattedAmount = toTokenDisplay(
        availableLiquidity,
        sourceToken.decimals
      )

      const warningMessage = (
        <>Insufficient liquidity. There is {formattedAmount} {sourceToken.symbol} available on {toNetwork.name}. <InfoTooltip
          title={`Required Liquidity: ${toTokenDisplay(requiredLiquidity, sourceToken.decimals)}`} /></>
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
    return (
      !fromNetwork?.isLayer1 &&
      availableLiquidity === undefined
    )
  }, [fromNetwork, availableLiquidity])

  useEffect(() => {
    if (needsTokenForFee && fromNetwork) {
      setNeedsNativeTokenWarning(`Add ${fromNetwork.nativeTokenSymbol} to your account on ${fromNetwork.name} for the transaction fee.`)
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
    let message = (
      noLiquidityWarning ||
      minimumSendWarning ||
      needsNativeTokenWarning
    )

    if (!enoughBalance) {
      message = 'Insufficient funds'
    } else if (estimatedReceived && bonderFee?.gt(estimatedReceived)) {
      message = 'Bonder fee greater than estimated received'
    } else if (estimatedReceived?.lte(0)) {
      message = 'Insufficient amount. Send higher amount to cover bonder fee.'
    }

    setWarning(message)
  }, [noLiquidityWarning, needsNativeTokenWarning, minimumSendWarning, enoughBalance, estimatedReceived])

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

    const amountOutMinFormatted = commafy(
      formatUnits(_amountOutMin, sourceToken.decimals),
      4
    )
    setAmountOutMinDisplay(`${amountOutMinFormatted} ${sourceToken.symbol}`)
  }, [amountOutMin])

  const { approve, checkApproval } = useApprove()
  const needsApproval = useAsyncMemo(async () => {
    try {
      if (!(
        fromNetwork &&
        sourceToken &&
        fromTokenAmount
      )) {
        return false
      }

      const parsedAmount = parseUnits(fromTokenAmount, sourceToken.decimals)
      const bridge = sdk.bridge(sourceToken.symbol)

      let spender : string
      if (fromNetwork.isLayer1) {
        const l1Bridge = await bridge.getL1Bridge()
        spender = l1Bridge.address
      } else {
        const ammWrapper = await bridge.getAmmWrapper(fromNetwork.slug)
        spender = ammWrapper.address
      }

      return checkApproval(
        parsedAmount,
        sourceToken,
        spender
      )
    } catch (err: any) {
      logger.error(err)
      return false
    }
  }, [
    sdk,
    fromNetwork,
    sourceToken,
    fromTokenAmount,
    checkApproval
  ])

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

    const parsedAmount = parseUnits(fromTokenAmount, sourceToken.decimals)
    const bridge = sdk.bridge(sourceToken.symbol)

    let spender : string
    if (fromNetwork.isLayer1) {
      const l1Bridge = await bridge.getL1Bridge()
      spender = l1Bridge.address
    } else {
      const ammWrapper = await bridge.getAmmWrapper(fromNetwork.slug)
      spender = ammWrapper.address
    }

    const tx = await approve(
      parsedAmount,
      sourceToken,
      spender
    )

    await tx?.wait()
  }

  const send = async () => {
    try {
      if (!fromNetwork || !toNetwork) {
        throw new Error('A network is undefined')
      }
      setError(null)
      setTx(null)

      const networkId = Number(fromNetwork.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setSending(true)
      let tx: Transaction | null = null
      if (fromNetwork.isLayer1) {
        tx = await sendl1ToL2()
      } else if (!fromNetwork.isLayer1 && toNetwork.isLayer1) {
        tx = await sendl2ToL1()
      } else {
        tx = await sendl2ToL2()
      }

      if (tx) {
        setTx(tx)
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, fromNetwork))
      }
      logger.error(err)
    }
    setSending(false)
  }

  const sendl1ToL2 = async () => {
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Cannot send: signer does not exist.')
    }
    if (!sourceToken) {
      throw new Error('No from token selected')
    }

    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient,
        source: {
          amount: fromTokenAmount,
          token: sourceToken,
          network: fromNetwork
        },
        dest: {
          network: toNetwork
        }
      },
      onConfirm: async () => {
        if (!amountOutMin) return
        const parsedAmount = parseUnits(
          fromTokenAmount,
          sourceToken.decimals
        ).toString()
        const recipient = customRecipient || await signer.getAddress()
        const relayer = ethers.constants.AddressZero
        const relayerFee = 0
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)
        const tx = await bridge.send(
          parsedAmount,
          sdk.Chain.Ethereum,
          toNetwork?.slug,
          {
            deadline: deadline(),
            relayer,
            relayerFee,
            recipient,
            amountOutMin
          }
        )
        return tx
      }
    })

    let txObj: Transaction | null = null
    if (tx?.hash && fromNetwork) {
      txObj = new Transaction({
        hash: tx?.hash,
        networkName: fromNetwork?.slug,
        destNetworkName: toNetwork?.slug,
        token: sourceToken
      })
      txHistory?.addTransaction(txObj)
    }

    return txObj
  }

  const sendl2ToL1 = async () => {
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Cannot send: signer does not exist.')
    }
    if (!sourceToken) {
      throw new Error('No from token selected')
    }

    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient,
        source: {
          amount: fromTokenAmount,
          token: sourceToken,
          network: fromNetwork
        },
        dest: {
          network: toNetwork
        }
      },
      onConfirm: async () => {
        if (!amountOutMin || !bonderFee) return
        const destinationAmountOutMin = 0
        const destinationDeadline = 0
        const parsedAmountIn = parseUnits(
          fromTokenAmount,
          sourceToken.decimals
        )
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)
        let totalBonderFee = bonderFee
        if (destinationTxFee?.gt(0)) {
          totalBonderFee = totalBonderFee.add(destinationTxFee)
        }

        if (totalBonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }
        const recipient = customRecipient || await signer?.getAddress()

        totalBonderFee = getBonderFeeWithId(totalBonderFee)
        const tx = await bridge.send(
          parsedAmountIn,
          fromNetwork?.slug as string,
          toNetwork?.slug as string,
          {
            recipient,
            bonderFee: totalBonderFee,
            amountOutMin: amountOutMin.sub(totalBonderFee),
            deadline: deadline(),
            destinationAmountOutMin,
            destinationDeadline
          }
        )
        return tx
      }
    })

    let txObj: Transaction | null = null
    if (tx?.hash && fromNetwork) {
      txObj = new Transaction({
        hash: tx?.hash,
        networkName: fromNetwork?.slug,
        destNetworkName: toNetwork?.slug,
        token: sourceToken
      })
      txHistory?.addTransaction(txObj)
    }

    return txObj
  }

  const sendl2ToL2 = async () => {
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Cannot send: signer does not exist.')
    }
    if (!sourceToken) {
      throw new Error('No from token selected')
    }

    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient,
        source: {
          amount: fromTokenAmount,
          token: sourceToken,
          network: fromNetwork
        },
        dest: {
          network: toNetwork
        }
      },
      onConfirm: async () => {
        if (!bonderFee) return
        const parsedAmountIn = parseUnits(
          fromTokenAmount,
          sourceToken.decimals
        )
        const recipient = customRecipient || await signer?.getAddress()
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)

        let totalBonderFee = bonderFee
        if (destinationTxFee?.gt(0)) {
          totalBonderFee = totalBonderFee.add(destinationTxFee)
        }

        if (totalBonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        totalBonderFee = getBonderFeeWithId(totalBonderFee)
        const tx = await bridge.send(
          parsedAmountIn,
          fromNetwork?.slug as string,
          toNetwork?.slug as string,
          {
            recipient,
            bonderFee: totalBonderFee,
            amountOutMin: intermediaryAmountOutMin.sub(totalBonderFee),
            deadline: deadline(),
            destinationAmountOutMin: amountOutMin.sub(totalBonderFee),
            destinationDeadline: deadline()
          }
        )
        return tx
      }
    })

    let txObj: Transaction | null = null
    if (tx?.hash && fromNetwork) {
      txObj = new Transaction({
        hash: tx?.hash,
        networkName: fromNetwork?.slug,
        destNetworkName: toNetwork?.slug,
        token: sourceToken
      })
      txHistory?.addTransaction(txObj)
    }

    return txObj
  }

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

  const handleTxStatusClose = () => {
    setTx(null)
  }

  const sendButtonActive = (validFormFields && !unsupportedAsset && !needsApproval)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <div className={styles.header}>
        <Box display="flex" alignItems="center" className={styles.sendSelect}>
          <Typography variant="h4" className={styles.sendLabel}>
            Send
          </Typography>
          <RaisedSelect
            value={selectedBridge?.getTokenSymbol()}
            onChange={handleBridgeChange}
          >
            {bridges.map(bridge => (
              <MenuItem value={bridge.getTokenSymbol()} key={bridge.getTokenSymbol()}>
                <SelectOption
                  value={bridge.getTokenSymbol()}
                  icon={bridge.getTokenImage()}
                  label={bridge.getTokenSymbol()}
                />
              </MenuItem>
            ))}
          </RaisedSelect>
        </Box>
      </div>
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
      <MuiButton
        className={styles.switchDirectionButton}
        onClick={handleSwitchDirection}
      >
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
      <details className={styles.detailsDropdown}>
        <summary className={styles.detailsDropdownSummary}>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            component="div"
            className={styles.detailsDropdownLabel}
          >
            <span>Options</span>
          </Typography>
        </summary>
        <div>
          <div className={styles.customRecipient}>
            <Card>
              <Typography variant="body1" className={styles.customRecipientLabel}>
                Custom recipient
              </Typography>
              <LargeTextField
                style={{
                  width: '100%'
                }}
                leftAlign
                value={customRecipient}
                onChange={handleCustomRecipientInput}
                placeholder="0x" />
            </Card>
          </div>
        </div>
      </details>
      <div className={styles.details}>
        <div className={styles.destinationTxFeeAndAmount}>
          {
            totalBonderFee?.gt(0) &&
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
          }
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
      <Alert severity="warning">{warning}</Alert>
      <Box className={styles.buttons} display="flex" flexDirection="row" alignItems="center">
        <Button
          className={styles.button}
          large
          highlighted={!!needsApproval}
          disabled={!needsApproval}
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
      <br />
      <Alert severity="info" onClose={() => setInfo(null)} text={info} />
      <TxStatusModal
        onClose={handleTxStatusClose}
        tx={tx} />
    </Box>
  )
}

export default Send
