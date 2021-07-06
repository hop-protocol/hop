import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
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
import { UINT256 } from 'src/constants'
import logger from 'src/logger'
import { commafy, normalizeNumberInput } from 'src/utils'
import SendButton from 'src/pages/Send/SendButton'
import useAvailableLiquidity from 'src/pages/Send/useAvailableLiquidity'
import useBalance from 'src/hooks/useBalance'
import useSendData from 'src/pages/Send/useSendData'
import useNeedsTokenForFee from 'src/hooks/useNeedsTokenForFee'
import useQueryParams from 'src/hooks/useQueryParams'

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
  }
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
  const [sending, setSending] = useState<boolean>(false)
  const [feeDisplay, setFeeDisplay] = useState<string>()
  const [amountOutMinDisplay, setAmountOutMinDisplay] = useState<string>()
  const [warning, setWarning] = useState<string | null | undefined>(null)
  const [error, setError] = useState<string | null | undefined>(null)
  const [noLiquidityWarning, setNoLiquidityWarning] = useState<string | null | undefined>(null)
  const [needsNativeTokenWarning, setNeedsNativeTokenWarning] = useState<string | null | undefined>(null)
  const [minimumSendWarning, setMinimumSendWarning] = useState<string | null | undefined>(null)
  const [info, setInfo] = useState<string | null | undefined>(null)
  const [tx, setTx] = useState<Transaction | null>(null)
  const [isLiquidityAvailable, setIsLiquidityAvailable] = useState<boolean>(
    true
  )

  const sourceToken = useMemo(() => {
    if (!fromNetwork || !selectedBridge) return
    return selectedBridge.getCanonicalToken(fromNetwork?.slug)
  }, [selectedBridge, fromNetwork])
  const destToken = useMemo(() => {
    if (!toNetwork || !selectedBridge) return
    return selectedBridge.getCanonicalToken(toNetwork?.slug)
  }, [selectedBridge, toNetwork])
  const placeholderToken = useMemo(() => {
    if (!selectedBridge) return
    return selectedBridge.getL1Token()
  }, [selectedBridge])

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
    bonderFee,
    requiredLiquidity,
    loading: loadingSendData
  } = useSendData(
    sourceToken,
    slippageTolerance,
    fromNetwork,
    toNetwork,
    fromTokenAmountBN
  )

  const needsTokenForFee = useNeedsTokenForFee(fromNetwork)

  useEffect(() => {
    if (!destToken) {
      setToTokenAmount('')
      return
    }

    let amount
    if (amountOut) {
      amount = commafy(formatUnits(amountOut, destToken.decimals), 4)
    }
    setToTokenAmount(amount)
  }, [destToken, amountOut])

  const availableLiquidity = useAvailableLiquidity(selectedBridge, toNetwork?.slug)

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

      const formattedAmount = formatUnits(
        availableLiquidity,
        sourceToken.decimals
      )
      const warningMessage = `Insufficient liquidity. There is ${formattedAmount} ${sourceToken.symbol} available on ${toNetwork.name}.`
      if (!isAvailable && !fromNetwork?.isLayer1) {
        setIsLiquidityAvailable(false)
        setNoLiquidityWarning(warningMessage)
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
    const warningMessage = `Send at least ${feeDisplay} to cover the transaction fee`
    if (amountOut?.eq(0) && feeDisplay) {
      setMinimumSendWarning(warningMessage)
    } else {
      setMinimumSendWarning('')
    }
  }, [amountOut, sourceToken, feeDisplay])

  useEffect(() => {
    setWarning(
      noLiquidityWarning ||
      minimumSendWarning ||
      needsNativeTokenWarning
    )
  }, [noLiquidityWarning, needsNativeTokenWarning, minimumSendWarning])

  useEffect(() => {
    if (!bonderFee || !sourceToken) {
      setFeeDisplay(undefined)
      return
    }

    const smallestFeeDecimals = sourceToken.decimals - 5
    const smallestFee = BigNumber.from(10 ** smallestFeeDecimals)
    let feeAmount: string
    if (bonderFee.gt('0') && bonderFee.lt(smallestFee)) {
      feeAmount = `<${formatUnits(smallestFee, sourceToken.decimals)}`
    } else {
      feeAmount = commafy(formatUnits(bonderFee, sourceToken.decimals), 5)
    }

    setFeeDisplay(`${feeAmount} ${sourceToken.symbol}`)
  }, [bonderFee])

  useEffect(() => {
    if (!amountOutMin || !sourceToken) {
      setAmountOutMinDisplay(undefined)
      return
    }

    const amountOutMinFormatted = commafy(
      formatUnits(amountOutMin, sourceToken.decimals),
      4
    )
    setAmountOutMinDisplay(`${amountOutMinFormatted} ${sourceToken.symbol}`)
  }, [amountOutMin])

  const approve = async (amount: string) => {
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Wallet not connected')
    }

    if (!fromNetwork) {
      throw new Error('No fromNetwork selected')
    }

    if (!toNetwork) {
      throw new Error('No toNetwork selected')
    }

    if (!sourceToken) {
      throw new Error('No from token selected')
    }

    const parsedAmount = parseUnits(amount, sourceToken.decimals)
    let tx: any
    const bridge = sdk.bridge(sourceToken.symbol).connect(signer)
    const token = bridge.getCanonicalToken(fromNetwork.slug)
    let spender : string
    if (fromNetwork.isLayer1) {
      const l1Bridge = await bridge.getL1Bridge()
      spender = l1Bridge.address
    } else {
      const bridge = await sdk
        .bridge(sourceToken.symbol)
        .connect(signer)
      const ammWrapper = await bridge.getAmmWrapper(fromNetwork.slug)
      spender = ammWrapper.address
    }
    const approved = await token.allowance(spender)
    if (approved.lt(parsedAmount)) {
      tx = await txConfirm?.show({
        kind: 'approval',
        inputProps: {
          tagline: `Allow Hop to spend your ${token.symbol} on ${fromNetwork.name}`,
          amount: amount,
          token: sourceToken.symbol
        },
        onConfirm: async (approveAll: boolean) => {
          const approveAmount = approveAll ? UINT256 : parsedAmount
          return token.approve(
            spender,
            approveAmount
          )
        }
      })
      await tx?.wait()
      if (tx?.hash && fromNetwork) {
        txHistory?.addTransaction(
          new Transaction({
            hash: tx?.hash,
            networkName: fromNetwork?.slug,
            token: sourceToken
          })
        )
      }
    }

    if (tx?.hash && fromNetwork) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: fromNetwork?.slug,
          token: sourceToken
        })
      )
    }
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
      await approve(fromTokenAmount)
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
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
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
        const recipient = await signer.getAddress()
        const relayer = ethers.constants.AddressZero
        const relayerFee = 0
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)
        const tx = await bridge.send(
          parsedAmount,
          sdk.Chain.Ethereum,
          toNetwork?.slug,
          {
            deadline,
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
        const destinationAmountOutMin = 0
        const destinationDeadline = 0
        const parsedAmountIn = parseUnits(
          fromTokenAmount,
          sourceToken.decimals
        )
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)
        const bonderFee = await bridge.getBonderFee(
          parsedAmountIn,
          fromNetwork?.slug as string,
          toNetwork?.slug as string
        )
        if (bonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }
        const recipient = await signer?.getAddress()
        const tx = await bridge.send(
          parsedAmountIn,
          fromNetwork?.slug as string,
          toNetwork?.slug as string,
          {
            recipient,
            bonderFee,
            amountOutMin,
            deadline,
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
        const parsedAmountIn = parseUnits(
          fromTokenAmount,
          sourceToken.decimals
        )
        const recipient = await signer?.getAddress()
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)
        const bonderFee = await bridge.getBonderFee(
          parsedAmountIn,
          fromNetwork?.slug as string,
          toNetwork?.slug as string
        )
        if (bonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }
        const tx = await bridge.send(
          parsedAmountIn,
          fromNetwork?.slug as string,
          toNetwork?.slug as string,
          {
            recipient,
            bonderFee,
            amountOutMin,
            deadline,
            destinationAmountOutMin: amountOutMin,
            destinationDeadline: deadline
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

  let enoughBalance = true
  if (fromBalance && fromTokenAmountBN && fromBalance.lt(fromTokenAmountBN)) {
    enoughBalance = false
  }
  const validFormFields = !!(
    fromTokenAmount &&
    toTokenAmount &&
    rate &&
    enoughBalance &&
    !needsTokenForFee &&
    isLiquidityAvailable &&
    !checkingLiquidity
  )

  let buttonText = 'Send'
  if (!walletConnected) {
    buttonText = 'Connect wallet'
  } else if (!fromNetwork) {
    buttonText = 'Select from network'
  } else if (!toNetwork) {
    buttonText = 'Select to network'
  } else if (!enoughBalance) {
    buttonText = 'Insufficient funds'
  } else if (needsTokenForFee) {
    buttonText = `Insufficient ${fromNetwork.nativeTokenSymbol}`
  } else if (!isLiquidityAvailable) {
    buttonText = 'Insufficient liquidity'
  } else if (checkingLiquidity) {
    buttonText = 'Checking liquidity'
  }

  const handleTxStatusClose = () => {
    setTx(null)
  }

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
      <div className={styles.details}>
        <DetailRow
          title="Rate"
          tooltip="The rate for the token taking trade size into consideration."
          value={rate === 0 ? '-' : commafy(rate, 4)}
        />
        <DetailRow
          title="Slippage Tolerance"
          tooltip="Your transaction will revert if the price changes unfavorably by more than this percentage."
          value={slippageTolerance ? `${slippageTolerance}%` : undefined}
        />
        <DetailRow
          title="Price Impact"
          tooltip="The difference between the market price and estimated price due to trade size."
          value={
            !priceImpact
              ? undefined
              : priceImpact < 0.01
                ? '<0.01%'
                : `${commafy(priceImpact)}%`
          }
        />
        <DetailRow
          title="Minimum received"
          tooltip="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
          value={amountOutMinDisplay}
        />
        <DetailRow
          title="Fee"
          tooltip="This fee goes towards the Bonder who bonds the transfer on the destination chain."
          value={feeDisplay}
          highlighted={toNetwork?.isLayer1}
        />
      </div>
      <Alert severity="error" onClose={() => setError(null)} text={error} />
      <Alert severity="warning" text={warning} />
      <SendButton sending={sending} disabled={!validFormFields} onClick={send}>
        {buttonText}
      </SendButton>
      <br />
      <Alert severity="info" onClose={() => setInfo(null)} text={info} />
      <TxStatusModal
        onClose={handleTxStatusClose}
        tx={tx} />
    </Box>
  )
}

export default Send
