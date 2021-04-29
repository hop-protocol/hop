import React, { FC, useState, useRef, useEffect, ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import MenuItem from '@material-ui/core/MenuItem'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import SelectOption from 'src/components/selects/SelectOption'
import AmountSelectorCard from 'src/pages/Send/AmountSelectorCard'
import Transaction from 'src/models/Transaction'
import Alert from 'src/components/alert/Alert'
import TxStatus from 'src/components/txStatus'
import Modal from 'src/components/modal'
import { BigNumber, ethers } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { UINT256, L1_NETWORK } from 'src/constants'
import logger from 'src/logger'
import { commafy, intersection, normalizeNumberInput } from 'src/utils'
import SendButton from 'src/pages/Send/SendButton'
import Settings from 'src/pages/Send/Settings'
import InfoTooltip from 'src/components/infoTooltip'
import useAvailableLiquidity from 'src/pages/Send/useAvailableLiquidity'

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
  settings: {
    position: 'absolute',
    top: '0',
    right: '0',
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      paddingLeft: '2rem'
    }
  }
}))

const Send: FC = () => {
  const styles = useStyles()
  const { pathname } = useLocation()
  let { user, tokens, networks, txConfirm, txHistory, sdk } = useApp()
  const {
    provider,
    walletConnected,
    checkConnectedNetworkId
  } = useWeb3Context()

  const networkSlugs = networks.map(network => network.slug)
  const pathNetwork = pathname.replace(/^\//, '')
  if (networkSlugs.includes(pathNetwork)) {
    // show only tokens supported by network
    tokens = tokens.filter(token => {
      return token.supportedNetworks.includes(pathNetwork)
    })
    networks = networks.filter(network => {
      return network.isLayer1 || network.slug == pathNetwork
    })
  } else {
    // show tokens supported by all networks
    tokens = tokens.filter(token => {
      return (
        intersection([networkSlugs, token.supportedNetworks]).length ===
        networkSlugs.length
      )
    })
  }
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  const [fromNetwork, setFromNetwork] = useState<Network>()
  const [toNetwork, setToNetwork] = useState<Network>()
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const [isFromLastChanged, setIsFromLastChanged] = useState<boolean>(true)
  const [sending, setSending] = useState<boolean>(false)
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5)
  const [deadlineMinutes, setDeadlineMinutes] = useState<number>(20)
  const [priceImpact, setPriceImpact] = useState<number>(0)
  const [fee, setFee] = useState<number | null>(null)
  const [amountOutMin, setAmountOutMin] = useState<number>(0)
  const [fromBalance, setFromBalance] = useState<number>(0)
  const [error, setError] = useState<string | null | undefined>(null)
  const [info, setInfo] = useState<string | null | undefined>(null)
  const [tx, setTx] = useState<Transaction | null>(null)
  const debouncer = useRef<number>(0)
  const [isLiquidityAvailable, setIsLiquidityAvailable] = useState<boolean>(true)

  const bridge = sdk.bridge(selectedToken?.symbol)
  const availableLiquidity = useAvailableLiquidity(bridge, toNetwork?.slug)

  useEffect(() => {
    if (!tokens.includes(selectedToken)) {
      setSelectedToken(tokens[0])
    }
  }, [networks])

  const calcAmount = async (amount: string): Promise<number> => {
    if (!fromNetwork) return 0
    if (!toNetwork) return 0
    if (!amount) return 0

    const amountBN = parseUnits(amount, selectedToken.decimals)

    const bridge = sdk.bridge(selectedToken?.symbol)
    const amountOut = await bridge.getAmountOut(
      amountBN,
      fromNetwork.slug,
      toNetwork.slug
    )

    return Number(formatUnits(amountOut, selectedToken.decimals))
  }

  const updateAmountOut = async (amountIn: string) => {
    try {
      if (!amountIn || !toNetwork) return
      const ctx = ++debouncer.current
      const amountOut = await calcAmount(amountIn)
      const rate = amountOut / Number(amountIn)
      if (ctx !== debouncer.current) return
      setToTokenAmount(amountOut.toFixed(2))
      setExchangeRate(rate)
    } catch (err) {
      logger.error(err)
    }
  }

  const updateAmountIn = async (amountOut: string) => {
    // ToDo: Remove reverse calculation
    console.error('Reverse calculation is unimplemented')
    return BigNumber.from('0')
  }

  const handleTokenSelect = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value
    const newSelectedToken = tokens.find(token => token.symbol === tokenSymbol)
    if (newSelectedToken) {
      setSelectedToken(newSelectedToken)
    }
  }

  const handleSwitchDirection = () => {
    setToTokenAmount(fromTokenAmount)
    setFromTokenAmount(toTokenAmount)
    setFromNetwork(toNetwork)
    setToNetwork(fromNetwork)
    setIsFromLastChanged(!isFromLastChanged)
  }

  useEffect(() => {
    updateAmountOut(fromTokenAmount)
  }, [fromNetwork])

  useEffect(() => {
    if (!toTokenAmount) {
      updateAmountOut(fromTokenAmount)
    }
  }, [toNetwork])

  // Control toTokenAmount when fromTokenAmount was edited last
  useEffect(() => {
    if (!isFromLastChanged) return
    updateAmountOut(fromTokenAmount)
  }, [isFromLastChanged])

  // Control fromTokenAmount when toTokenAmount was edited last
  useEffect(() => {
    if (isFromLastChanged) return
    updateAmountIn(toTokenAmount)
  }, [isFromLastChanged])

  useEffect(() => {
    const update = async () => {
      if (!availableLiquidity) return
      if (!fromNetwork) return
      if (!toNetwork) return
      if (!fromTokenAmount) return
      if (fromNetwork.isLayer1) return

      const amountBN = parseUnits(fromTokenAmount, 18)

      const bridge = sdk.bridge(selectedToken?.symbol)
      const liquidityRequired = await bridge.getRequiredLiquidity(
        amountBN,
        fromNetwork.slug
      )

      const isAvailable = BigNumber.from(availableLiquidity).gte(liquidityRequired)

      setIsLiquidityAvailable(isAvailable)

      const formattedAmount = formatUnits(availableLiquidity,  selectedToken.decimals)
      const errorMessage = `Insufficient liquidity. There is ${formattedAmount} ${selectedToken.symbol}`
      if (!isAvailable) {
        setError(errorMessage)
      } else {
        if (error === errorMessage) {
          setError('')
        }
      }
    }

    update()
  }, [fromNetwork, toNetwork, fromTokenAmount, availableLiquidity])

  useEffect(() => {
    const update = async () => {
      try {
        setFee(null)
        if (fromNetwork?.slug === L1_NETWORK) {
          setFee(0)
          return
        }

        const parsedAmountIn = parseUnits(
          fromTokenAmount,
          selectedToken.decimals
        )
        const bridge = sdk.bridge(selectedToken?.symbol)
        const bonderFee = await bridge.getBonderFee(
          parsedAmountIn as any,
          fromNetwork?.slug as string,
          toNetwork?.slug as string
        )
        const _fee = Number(formatUnits(bonderFee, selectedToken.decimals))
        setFee(_fee)
      } catch (err) {
        // noop
      }
    }

    update()
  }, [fromNetwork, toNetwork, fromTokenAmount])

  useEffect(() => {
    const update = async () => {
      setAmountOutMin(0)
      if (fromNetwork && toNetwork && fromTokenAmount && toTokenAmount) {
        const _amountOutMin =
          Number(toTokenAmount) -
          Number(toTokenAmount) * (slippageTolerance / 100)
        setAmountOutMin(_amountOutMin)
      }
    }

    update()
  }, [fromNetwork, toNetwork, fromTokenAmount, toTokenAmount])

  useEffect(() => {
    const update = async () => {
      setPriceImpact(0)
      if (exchangeRate) {
        const amountIn = '0.0001'
        const amountOut = await calcAmount(amountIn)
        const marketRate = amountOut / Number(amountIn)
        const _priceImpact = ((marketRate - exchangeRate) / marketRate) * 100
        setPriceImpact(_priceImpact)
      }
    }

    update()
  }, [exchangeRate])

  const approve = async (amount: string) => {
    const signer = user?.signer()
    if (!signer) {
      throw new Error('Wallet not connected')
    }

    if (!fromNetwork) {
      throw new Error('No fromNetwork selected')
    }

    if (!toNetwork) {
      throw new Error('No toNetwork selected')
    }

    const parsedAmount = parseUnits(amount, selectedToken.decimals)
    let tx: any
    const bridge = sdk.bridge(selectedToken?.symbol).connect(signer as any)
    const token = bridge.token
    const l1Bridge = await bridge.getL1Bridge()
    if (fromNetwork?.isLayer1) {
      const approved = await token.allowance(fromNetwork.slug, l1Bridge.address)
      if (approved.lt(parsedAmount)) {
        tx = await txConfirm?.show({
          kind: 'approval',
          inputProps: {
            amount: amount,
            token: selectedToken
          },
          onConfirm: async (approveAll: boolean) => {
            const approveAmount = approveAll ? UINT256 : parsedAmount
            return token.approve(
              fromNetwork.slug,
              l1Bridge.address,
              approveAmount as any
            )
          }
        })
        await tx?.wait()
        if (tx?.hash && fromNetwork) {
          txHistory?.addTransaction(
            new Transaction({
              hash: tx?.hash,
              networkName: fromNetwork?.slug,
              token: selectedToken
            })
          )
        }
      }
    } else {
      const bridge = await sdk
        .bridge(selectedToken?.symbol)
        .connect(signer as any)
      const ammWrapper = await bridge.getAmmWrapper(fromNetwork.slug)
      const approved = await token.allowance(
        fromNetwork.slug,
        ammWrapper.address
      )
      if (approved.lt(parsedAmount)) {
        tx = await txConfirm?.show({
          kind: 'approval',
          inputProps: {
            amount: amount,
            token: selectedToken
          },
          onConfirm: async (approveAll: boolean) => {
            const approveAmount = approveAll ? UINT256 : parsedAmount
            return token.approve(
              fromNetwork.slug,
              ammWrapper?.address as string,
              approveAmount as any
            )
          }
        })
        await tx?.wait()
        if (tx?.hash && fromNetwork) {
          txHistory?.addTransaction(
            new Transaction({
              hash: tx?.hash,
              networkName: fromNetwork?.slug,
              token: selectedToken
            })
          )
        }
      }
    }

    if (tx?.hash && fromNetwork) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: fromNetwork?.slug,
          token: selectedToken
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

    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        source: {
          amount: fromTokenAmount,
          token: selectedToken,
          network: fromNetwork
        },
        dest: {
          network: toNetwork
        }
      },
      onConfirm: async () => {
        const deadline = (Date.now() / 1000 + Number(deadlineMinutes) * 60) | 0
        const parsedAmount = parseUnits(
          fromTokenAmount,
          selectedToken.decimals
        ).toString()
        const recipient = await signer.getAddress()
        const parsedAmountOutMin = parseUnits(
          amountOutMin.toString(),
          selectedToken.decimals
        )
        const relayer = ethers.constants.AddressZero
        const relayerFee = 0
        const bridge = sdk.bridge(selectedToken?.symbol).connect(signer as any)
        const tx = await bridge.send(
          parsedAmount,
          sdk.Chain.Ethereum,
          toNetwork?.slug,
          {
            deadline,
            relayer,
            relayerFee,
            recipient,
            amountOutMin: parsedAmountOutMin as any
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
        token: selectedToken
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

    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        source: {
          amount: fromTokenAmount,
          token: selectedToken,
          network: fromNetwork
        },
        dest: {
          network: toNetwork
        }
      },
      onConfirm: async () => {
        const deadline = (Date.now() / 1000 + Number(deadlineMinutes) * 60) | 0
        const destinationDeadline = 0
        const amountOutMin = 0
        const destinationAmountOutMin = parseUnits(
          amountOutMin.toString(),
          selectedToken.decimals
        ).toString()
        const parsedAmountIn = parseUnits(
          fromTokenAmount,
          selectedToken.decimals
        )
        const bridge = sdk.bridge(selectedToken?.symbol).connect(signer as any)
        const bonderFee = await bridge.getBonderFee(
          parsedAmountIn as any,
          fromNetwork?.slug as string,
          toNetwork?.slug as string
        )
        if (bonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }
        const recipient = await signer?.getAddress()
        const tx = await bridge.send(
          parsedAmountIn as any,
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
        token: selectedToken
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

    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        source: {
          amount: fromTokenAmount,
          token: selectedToken,
          network: fromNetwork
        },
        dest: {
          network: toNetwork
        }
      },
      onConfirm: async () => {
        const deadline = (Date.now() / 1000 + Number(deadlineMinutes) * 60) | 0
        const destinationDeadline = deadline
        const amountOutMin = 0
        const destinationAmountOutMin = parseUnits(
          amountOutMin.toString(),
          selectedToken.decimals
        ).toString()
        const parsedAmountIn = parseUnits(
          fromTokenAmount,
          selectedToken.decimals
        )
        const recipient = await signer?.getAddress()
        const bridge = sdk.bridge(selectedToken?.symbol).connect(signer as any)
        const bonderFee = await bridge.getBonderFee(
          parsedAmountIn as any,
          fromNetwork?.slug as string,
          toNetwork?.slug as string
        )
        if (bonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }
        const tx = await bridge.send(
          parsedAmountIn as any,
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
        token: selectedToken
      })
      txHistory?.addTransaction(txObj)
    }

    return txObj
  }

  const enoughBalance = fromBalance >= Number(fromTokenAmount)
  const validFormFields = !!(
    fromTokenAmount &&
    toTokenAmount &&
    exchangeRate &&
    enoughBalance &&
    isLiquidityAvailable
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
            value={selectedToken?.symbol}
            onChange={handleTokenSelect}
          >
            {tokens.map(token => (
              <MenuItem value={token.symbol} key={token.symbol}>
                <SelectOption
                  value={token.symbol}
                  icon={token.imageUrl}
                  label={token.symbol}
                />
              </MenuItem>
            ))}
          </RaisedSelect>
        </Box>
        <div className={styles.settings}>
          <Settings
            onSlippageTolerance={setSlippageTolerance}
            onTransactionDeadline={setDeadlineMinutes}
          />
        </div>
      </div>
      <AmountSelectorCard
        value={fromTokenAmount}
        token={selectedToken}
        label={'From'}
        onChange={value => {
          if (!value) {
            setFromTokenAmount('')
            setToTokenAmount('')
            return
          }

          const amountIn = normalizeNumberInput(value)
          setFromTokenAmount(amountIn)
          setIsFromLastChanged(true)
          updateAmountOut(amountIn)
        }}
        selectedNetwork={fromNetwork}
        networkOptions={networks}
        onNetworkChange={network => {
          setFromNetwork(network)
        }}
        onBalanceChange={balance => {
          setFromBalance(balance)
        }}
      />
      <MuiButton
        className={styles.switchDirectionButton}
        onClick={handleSwitchDirection}
      >
        <ArrowDownIcon color="primary" className={styles.downArrow} />
      </MuiButton>
      <AmountSelectorCard
        value={toTokenAmount}
        token={selectedToken}
        label={'To (estimated)'}
        onChange={value => {
          if (!value) {
            setToTokenAmount('')
            setFromTokenAmount('')
            return
          }

          const amountOut = normalizeNumberInput(value)
          setToTokenAmount(amountOut)
          setIsFromLastChanged(false)
          updateAmountIn(amountOut)
        }}
        selectedNetwork={toNetwork}
        networkOptions={networks}
        onNetworkChange={network => {
          setToNetwork(network)
        }}
      />
      <div className={styles.details}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={styles.detailRow}
        >
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={styles.detailLabel}
          >
            Rate{' '}
            <InfoTooltip title="The rate for the token taking trade size into consideration." />
          </Typography>
          <Typography
            title={`${exchangeRate}`}
            variant="subtitle2"
            color="textSecondary"
          >
            {exchangeRate === 0 ? '-' : commafy(exchangeRate)}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={styles.detailRow}
        >
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={styles.detailLabel}
          >
            Slippage Tolerance{' '}
            <InfoTooltip title="Your transaction will revert if the price changes unfavorably by more than this percentage." />
          </Typography>
          <Typography
            title={`${slippageTolerance}`}
            variant="subtitle2"
            color="textSecondary"
          >
            {slippageTolerance}%
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={styles.detailRow}
        >
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={styles.detailLabel}
          >
            Price Impact{' '}
            <InfoTooltip title="The difference between the market price and estimated price due to trade size." />
          </Typography>
          <Typography
            title={`${priceImpact}`}
            variant="subtitle2"
            color="textSecondary"
          >
            {priceImpact === 0
              ? '-'
              : priceImpact < 0.01
              ? `<0.01%`
              : `${commafy(priceImpact)}%`}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={styles.detailRow}
        >
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={styles.detailLabel}
          >
            Minimum received{' '}
            <InfoTooltip title="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </Typography>
          <Typography
            title={`${amountOutMin}`}
            variant="subtitle2"
            color="textSecondary"
          >
            {amountOutMin === 0 ? '-' : commafy(amountOutMin)}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={styles.detailRow}
        >
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={styles.detailLabel}
          >
            Fee{' '}
            <InfoTooltip title="This fee goes towards the Bonder who bonds the transfer on the destination chain." />
          </Typography>
          <Typography
            title={`${fee}`}
            variant="subtitle2"
            color="textSecondary"
          >
            {fee === null ? '-' : commafy(fee, 5)}
          </Typography>
        </Box>
      </div>
      <Alert severity="error" onClose={() => setError(null)} text={error} />
      <SendButton sending={sending} disabled={!validFormFields} onClick={send}>
        {buttonText}
      </SendButton>
      <br />
      <Alert severity="info" onClose={() => setInfo(null)} text={info} />
      {tx ? (
        <Modal onClose={handleTxStatusClose}>
          <TxStatus tx={tx} />
          <Box
            display="flex"
            alignItems="center"
            className={styles.txStatusInfo}
          >
            <Typography variant="body1">
              <em>This may take a few minutes</em>
            </Typography>
            <MuiButton
              className={styles.txStatusCloseButton}
              onClick={handleTxStatusClose}
            >
              Close
            </MuiButton>
          </Box>
        </Modal>
      ) : null}
    </Box>
  )
}

export default Send
