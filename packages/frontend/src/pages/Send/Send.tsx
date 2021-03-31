import React, {
  FC,
  useState,
  useMemo,
  useRef,
  useEffect,
  ChangeEvent
} from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem'
import SelectOption from 'src/components/selects/SelectOption'
import AmountSelectorCard from 'src/pages/Send/AmountSelectorCard'
import SendButton from 'src/pages/Send/SendButton'
import Transaction from 'src/models/Transaction'
import Alert from 'src/components/alert/Alert'
import TxStatus from 'src/components/txStatus'
import Modal from 'src/components/modal'
import { Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { UINT256, L1_NETWORK } from 'src/constants'
import uniswapV2PairArtifact from 'src/abi/UniswapV2Pair.json'
import logger from 'src/logger'
import { commafy, intersection, normalizeNumberInput } from 'src/utils'

const useStyles = makeStyles(theme => ({
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
  detailRow: {
    marginTop: '4.2rem',
    marginBottom: '5.4rem',
    width: '46.0rem',
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    }
  }
}))

const Send: FC = () => {
  const styles = useStyles()
  const { pathname } = useLocation()
  let { user, tokens, networks, contracts, txConfirm, txHistory } = useApp()
  const {
    provider,
    walletConnected,
    checkConnectedNetworkId,
    getWriteContract
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
  const [l2Bridge, setL2Bridge] = useState<Contract | undefined>()
  const [uniswapRouter, setUniswapRouter] = useState<Contract | undefined>()
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  const [fromNetwork, setFromNetwork] = useState<Network>()
  const [toNetwork, setToNetwork] = useState<Network>()
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const [isFromLastChanged, setIsFromLastChanged] = useState<boolean>(true)
  const [sending, setSending] = useState<boolean>(false)
  const [fetchingRate, setFetchingRate] = useState<boolean>(false)
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [fromBalance, setFromBalance] = useState<number>(0)
  const [toBalance, setToBalance] = useState<number>(0)
  const [error, setError] = useState<string | null | undefined>(null)
  const [info, setInfo] = useState<string | null | undefined>(null)
  const [tx, setTx] = useState<Transaction | null>(null)
  const l1Bridge = contracts?.tokens[selectedToken?.symbol][L1_NETWORK].l1Bridge
  const debouncer = useRef<number>(0)

  useEffect(() => {
    if (!tokens.includes(selectedToken)) {
      setSelectedToken(tokens[0])
    }
  }, [networks])
  const calcAmount = async (
    amount: string,
    isAmountIn: boolean
  ): Promise<number> => {
    if (!fromNetwork) return 0
    if (!toNetwork) return 0
    if (!amount) return 0

    const amountBN = parseUnits(amount, 18)

    const decimals = 18
    // L1 -> L2 or L2 -> L1
    if (fromNetwork?.isLayer1 || toNetwork?.isLayer1) {
      const _amount = await _calcAmount(
        amountBN,
        isAmountIn,
        fromNetwork,
        toNetwork
      )
      return Number(formatUnits(_amount.toString(), decimals))
    }

    // L2 -> L2
    const layer1Network = networks.find(network => network.isLayer1) as Network
    const amountOut1 = await _calcAmount(
      amountBN,
      true,
      fromNetwork,
      layer1Network
    )
    const amountOut2 = await _calcAmount(
      amountOut1,
      true,
      layer1Network,
      toNetwork
    )

    return Number(formatUnits(amountOut2.toString(), decimals))
  }

  const _calcAmount = async (
    amount: BigNumber,
    isAmountIn: boolean,
    _fromNetwork: Network,
    _toNetwork: Network
  ): Promise<BigNumber> => {
    let path
    let uniswapRouter
    if (_fromNetwork.isLayer1) {
      if (!_toNetwork) {
        return BigNumber.from('0')
      }
      let l2CanonicalTokenAddress =
        contracts?.tokens[selectedToken.symbol][_toNetwork.slug]
          .l2CanonicalToken?.address
      let l2HopBridgeTokenAddress =
        contracts?.tokens[selectedToken.symbol][_toNetwork.slug]
          .l2HopBridgeToken?.address
      path = [l2HopBridgeTokenAddress, l2CanonicalTokenAddress]
      uniswapRouter =
        contracts?.tokens[selectedToken.symbol][_toNetwork.slug].uniswapRouter
    } else {
      if (!_fromNetwork) {
        return BigNumber.from('0')
      }
      let l2CanonicalTokenAddress =
        contracts?.tokens[selectedToken.symbol][_fromNetwork.slug]
          .l2CanonicalToken?.address
      let l2HopBridgeTokenAddress =
        contracts?.tokens[selectedToken.symbol][_fromNetwork.slug]
          .l2HopBridgeToken?.address
      path = [l2CanonicalTokenAddress, l2HopBridgeTokenAddress]
      uniswapRouter =
        contracts?.tokens[selectedToken.symbol][_fromNetwork.slug].uniswapRouter
    }
    if (!path) {
      return BigNumber.from('0')
    }
    if (isAmountIn) {
      const amountsOut = await uniswapRouter?.getAmountsOut(amount, path)
      return amountsOut[1]
    } else {
      const amountsIn = await uniswapRouter?.getAmountsIn(amount, path)
      return amountsIn[0]
    }
  }

  const updateAmountOut = async (amountIn: string) => {
    try {
      if (!amountIn || !toNetwork) return
      const ctx = ++debouncer.current
      const amountOut = await calcAmount(amountIn, true)
      const rate = amountOut / Number(amountIn)
      if (ctx !== debouncer.current) return
      setToTokenAmount((Number(amountIn) * rate).toFixed(2))
      setExchangeRate(rate)
    } catch (err) {
      logger.error(err)
    }
  }

  const updateAmountIn = async (amountOut: string) => {
    try {
      if (!amountOut || !fromNetwork) return
      const ctx = ++debouncer.current
      const amountIn = await calcAmount(amountOut, false)
      const rate = Number(amountOut) / amountIn
      if (ctx !== debouncer.current) return
      setFromTokenAmount((Number(amountOut) / rate).toFixed(2))
      setExchangeRate(rate)
    } catch (err) {
      logger.error(err)
    }
  }

  const handleTokenSelect = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value
    const newSelectedToken = tokens.find(token => token.symbol === tokenSymbol)
    if (newSelectedToken) {
      setSelectedToken(newSelectedToken)
      if (fromNetwork && !fromNetwork?.isLayer1) {
        setL2Bridge(
          contracts?.tokens[newSelectedToken.symbol][
            fromNetwork?.slug as string
          ].l2Bridge
        )
        setUniswapRouter(
          contracts?.tokens[newSelectedToken.symbol][
            fromNetwork?.slug as string
          ].uniswapRouter
        )
      } else if (toNetwork && !toNetwork?.isLayer1) {
        setL2Bridge(
          contracts?.tokens[newSelectedToken.symbol][toNetwork?.slug as string]
            .l2Bridge
        )
        setUniswapRouter(
          contracts?.tokens[newSelectedToken.symbol][toNetwork?.slug as string]
            .uniswapRouter
        )
      }
    }
  }

  const handleSwitchDirection = () => {
    setToTokenAmount(fromTokenAmount)
    setFromTokenAmount(toTokenAmount)
    setFromNetwork(toNetwork)
    setToNetwork(fromNetwork)
    setIsFromLastChanged(!isFromLastChanged)

    if (toNetwork && !toNetwork?.isLayer1) {
      setL2Bridge(
        contracts?.tokens[selectedToken.symbol][toNetwork?.slug as string]
          .l2Bridge
      )
      setUniswapRouter(
        contracts?.tokens[selectedToken.symbol][toNetwork?.slug as string]
          .uniswapRouter
      )
    }
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

  const getBonderFee = async () => {
    if (!fromNetwork) {
      throw new Error('No from network selected')
    }
    if (!toNetwork) {
      throw new Error('No to network selected')
    }
    const amountOut = await _calcAmount(
      parseUnits(fromTokenAmount, 18),
      true,
      fromNetwork,
      toNetwork
    )
    const minBonderBps = await l2Bridge?.minBonderBps()
    const minBonderFeeAbsolute = await l2Bridge?.minBonderFeeAbsolute()
    const minBonderFeeRelative = amountOut.mul(minBonderBps).div(10000)
    const minBonderFee = minBonderFeeRelative.gt(minBonderFeeAbsolute)
      ? minBonderFeeRelative
      : minBonderFeeAbsolute
    return minBonderFee
  }

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

    const tokenContractRead = selectedToken.contractForNetwork(fromNetwork)
    const tokenContract = await getWriteContract(tokenContractRead)
    if (!tokenContract) return // User needs to switch networks
    const parsedAmount = parseUnits(amount, selectedToken.decimals || 18)
    let tx: any
    if (fromNetwork?.isLayer1) {
      const approved = await tokenContract.allowance(
        await signer?.getAddress(),
        l1Bridge?.address
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
            return tokenContract.approve(l1Bridge?.address, approveAmount)
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
      const uniswapWrapper =
        contracts?.tokens[selectedToken?.symbol][fromNetwork?.slug as string]
          .uniswapWrapper

      const approved = await tokenContract.allowance(
        await signer?.getAddress(),
        uniswapWrapper?.address
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
            return tokenContract.approve(uniswapWrapper?.address, approveAmount)
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
    if (!l1Bridge || !signer) {
      throw new Error('Cannot send: l1Bridge or signer does not exist.')
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
        const deadline = (Date.now() / 1000 + 300) | 0
        const amountOutMin = '0'
        const chainId = toNetwork?.networkId
        const relayerFee = '0'
        return l1Bridge.sendToL2(
          chainId,
          await signer.getAddress(),
          parseUnits(fromTokenAmount, 18),
          amountOutMin,
          deadline,
          relayerFee
        )
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
    if (!l2Bridge || !signer) {
      throw new Error('Cannot send: l1Bridge or signer does not exist.')
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
        const deadline = (Date.now() / 1000 + 300) | 0
        const destinationDeadline = '0'
        const amountOutIn = '0'
        const destinationAmountOutMin = '0'
        const bonderFee = await getBonderFee()
        const chainId = toNetwork?.networkId
        const transferNonce = Date.now()
        const uniswapWrapper =
          contracts?.tokens[selectedToken?.symbol][fromNetwork?.slug as string]
            .uniswapWrapper

        const parsedAmountIn = parseUnits(fromTokenAmount, 18)
        if (bonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        const wrapperWrite = await getWriteContract(uniswapWrapper)
        return wrapperWrite?.swapAndSend(
          chainId,
          await signer?.getAddress(),
          parsedAmountIn,
          bonderFee.toString(),
          amountOutIn,
          deadline,
          destinationAmountOutMin,
          destinationDeadline,
          {
            //gasLimit: 1000000
          }
        )
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
    if (!l2Bridge || !signer) {
      throw new Error('Cannot send: l1Bridge or signer does not exist.')
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
        const deadline = (Date.now() / 1000 + 300) | 0
        const destinationDeadline = deadline
        const chainId = toNetwork?.networkId
        const amountOutIn = '0'
        const destinationAmountOutMin = '0'
        const bonderFee = await getBonderFee()
        const uniswapWrapper =
          contracts?.tokens[selectedToken?.symbol][fromNetwork?.slug as string]
            .uniswapWrapper

        const parsedAmountIn = parseUnits(fromTokenAmount, 18)
        if (bonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        const wrapperWrite = await getWriteContract(uniswapWrapper)
        return wrapperWrite?.swapAndSend(
          chainId,
          await signer?.getAddress(),
          parseUnits(fromTokenAmount, 18),
          bonderFee,
          amountOutIn,
          deadline,
          destinationAmountOutMin,
          destinationDeadline
        )
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
    !fetchingRate
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
  } else if (fetchingRate) {
    buttonText = 'Fetching rate...'
  }

  const handleTxStatusClose = () => {
    setTx(null)
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" className={styles.sendSelect}>
        <Typography variant="h4" className={styles.sendLabel}>
          Send
        </Typography>
        <RaisedSelect value={selectedToken.symbol} onChange={handleTokenSelect}>
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
          if (network && !network?.isLayer1) {
            setL2Bridge(
              contracts?.tokens[selectedToken.symbol][network?.slug as string]
                .l2Bridge
            )
            setUniswapRouter(
              contracts?.tokens[selectedToken.symbol][network?.slug as string]
                .uniswapRouter
            )
          }
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
        onBalanceChange={balance => {
          setToBalance(balance)
        }}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className={styles.detailRow}
      >
        <Typography variant="subtitle2" color="textSecondary">
          Rate
        </Typography>
        <Typography
          title={`${exchangeRate}`}
          variant="subtitle2"
          color="textSecondary"
        >
          {fetchingRate ? (
            <CircularProgress size={12} />
          ) : exchangeRate === 0 ? (
            '-'
          ) : (
            commafy(exchangeRate)
          )}
        </Typography>
      </Box>
      <Alert severity="error" onClose={() => setError(null)} text={error} />
      <SendButton sending={sending} disabled={!validFormFields} onClick={send}>
        {buttonText}
      </SendButton>
      <br />
      <Alert severity="info" onClose={() => setInfo(null)} text={info} />
      {tx ? (
        <Modal onClose={handleTxStatusClose}>
          <TxStatus tx={tx} />
        </Modal>
      ) : null}
    </Box>
  )
}

export default Send
