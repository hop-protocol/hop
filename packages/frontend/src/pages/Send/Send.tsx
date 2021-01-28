import React, {
  FC,
  useState,
  useMemo,
  useRef,
  useEffect,
  ChangeEvent
} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import MuiButton from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import AmountSelectorCard from 'src/pages/Send/AmountSelectorCard'
import SendButton from 'src/pages/Send/SendButton'
import Transaction from 'src/models/Transaction'
import Alert from 'src/components/alert/Alert'
import { Contract, BigNumber } from 'ethers'
import {
  parseEther,
  parseUnits,
  formatEther,
  formatUnits,
} from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { addresses } from 'src/config'
import { UINT256 } from 'src/config/constants'
import uniswapV2PairArtifact from 'src/abi/UniswapV2Pair.json'

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

  const {
    user,
    tokens: allTokens,
    networks,
    contracts,
    txConfirm,
    txHistory
  } = useApp()
  const tokens = allTokens.filter((token: Token) => token.symbol === 'DAI')
  const l1Bridge = contracts?.l1Bridge

  const {
    provider,
    setRequiredNetworkId,
    connectedNetworkId,
    walletConnected
  } = useWeb3Context()

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
  const debouncer = useRef<number>(0)

  const calcAmount = async (
    amount: string,
    isAmountIn: boolean
  ): Promise<number> => {
    if (!fromNetwork) return 0
    if (!toNetwork) return 0
    if (!amount) return 0

    const amountBN = parseEther(amount)

    const decimals = 18
    // L1 -> L2 or L2 -> L1
    if (fromNetwork?.isLayer1 || toNetwork?.isLayer1) {
       const _amount = await _calcAmount(amountBN, isAmountIn, fromNetwork, toNetwork)
       return Number(formatUnits(_amount, decimals))
    }

    // L2 -> L2
    const layer1Network = networks.find( network => network.isLayer1 ) as Network
    const amountOut1 = await _calcAmount(amountBN, true, fromNetwork, layer1Network)
    const amountOut2 = await _calcAmount(amountOut1, true, layer1Network, toNetwork)

    return Number(formatUnits(amountOut2, decimals))
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
      let l2CanonicalTokenAddress = contracts?.networks[_toNetwork.slug].l2CanonicalToken?.address
      let l2BridgeAddress = contracts?.networks[_toNetwork.slug].l2Bridge?.address
      path = [l2BridgeAddress, l2CanonicalTokenAddress]
      uniswapRouter = contracts?.networks[_toNetwork.slug].uniswapRouter
    } else {
      let l2CanonicalTokenAddress = contracts?.networks[_fromNetwork.slug].l2CanonicalToken?.address
      let l2BridgeAddress = contracts?.networks[_fromNetwork.slug].l2Bridge?.address
      path = [l2CanonicalTokenAddress, l2BridgeAddress]
      uniswapRouter = contracts?.networks[_fromNetwork.slug].uniswapRouter
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
      console.error(err)
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
      console.error(err)
    }
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

    if (toNetwork?.name === 'Arbitrum') {
      setL2Bridge(contracts?.networks.arbitrum.l2Bridge)
      setUniswapRouter(contracts?.networks.arbitrum.uniswapRouter)
    } else if (toNetwork?.name === 'Optimism') {
      setL2Bridge(contracts?.networks.optimism.l2Bridge)
      setUniswapRouter(contracts?.networks.optimism.uniswapRouter)
    }
  }

  const checkWalletNetwork = () => {
    if (fromNetwork) {
      setRequiredNetworkId(fromNetwork?.networkId)
    }
    return connectedNetworkId === fromNetwork?.networkId
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

    let tx: any
    if (fromNetwork?.isLayer1) {
      const tokenContract = selectedToken
        .contractForNetwork(fromNetwork)
        .connect(signer)
      const approved = await tokenContract.allowance(
        await signer?.getAddress(),
        l1Bridge?.address
      )
      const parsedAmount = parseUnits(amount, selectedToken.decimals || 18)
      if (approved.lt(parsedAmount)) {
        tx = await txConfirm?.show({
          kind: 'approval',
          inputProps: {
            amount: 'ALL',
            token: selectedToken
          },
          onConfirm: async () => {
            return tokenContract.approve(l1Bridge?.address, UINT256)
          }
        })
        await tx?.wait()
        if (tx?.hash && fromNetwork) {
          txHistory?.addTransaction(
            new Transaction({
              hash: tx?.hash,
              networkName: fromNetwork?.slug
            })
          )
        }
      }
    } else {
      const tokenContract = selectedToken
        .contractForNetwork(fromNetwork)
        .connect(signer)

      const approved = await tokenContract.allowance(
        await signer?.getAddress(),
        l2Bridge?.address
      )
      const parsedAmount = parseUnits(amount, selectedToken.decimals || 18)
      if (approved.lt(parsedAmount)) {
        tx = await txConfirm?.show({
          kind: 'approval',
          inputProps: {
            amount: 'ALL',
            token: selectedToken
          },
          onConfirm: async () => {
            return tokenContract.approve(l2Bridge?.address, UINT256)
          }
        })
        await tx?.wait()
        if (tx?.hash && fromNetwork) {
          txHistory?.addTransaction(
            new Transaction({
              hash: tx?.hash,
              networkName: fromNetwork?.slug
            })
          )
        }
      }
    }

    if (tx?.hash && fromNetwork) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: fromNetwork?.slug
        })
      )
    }
  }

  const send = async () => {
    try {
      if (!fromNetwork || !toNetwork) {
        throw new Error('A network is undefined')
      }

      if (!checkWalletNetwork()) {
        return
      }

      setSending(true)
      await approve(fromTokenAmount)
      if (fromNetwork.isLayer1) {
        await sendl1ToL2()
      } else if (!fromNetwork.isLayer1 && toNetwork.isLayer1) {
        await sendl2ToL1()
      } else {
        await sendl2ToL2()
      }
    } catch (err) {
      if (!/cancelled/gi.test(err.message)) {
        setError(err.message)
      }
      console.error(err)
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
        return l1Bridge.sendToL2AndAttemptSwap(
          chainId,
          await signer.getAddress(),
          parseEther(fromTokenAmount),
          amountOutMin,
          deadline
        )
      }
    })

    if (toNetwork?.slug === 'optimism') {
      setInfo('You must wait 10 blocks before your funds are available on Optimism.')
    }

    if (tx?.hash && fromNetwork) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: fromNetwork?.slug
        })
      )
    }
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
        const chainId = toNetwork?.networkId
        const transferNonce = Date.now()
        const relayerFee = '0'
        const amountOutIn = '0'
        const destinationAmountOutMin = '0'
        return l2Bridge?.swapAndSend(
          chainId,
          await signer?.getAddress(),
          parseEther(fromTokenAmount),
          transferNonce,
          relayerFee,
          amountOutIn,
          deadline,
          destinationAmountOutMin,
          deadline
        )
      }
    })

    if (tx?.hash && fromNetwork) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: fromNetwork?.slug
        })
      )
    }
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
        const chainId = toNetwork?.networkId
        const transferNonce = Date.now()
        const relayerFee = '0'
        const amountOutIn = '0'
        const destinationAmountOutMin = '0'
        return l2Bridge?.swapAndSend(
          chainId,
          await signer?.getAddress(),
          parseEther(fromTokenAmount),
          transferNonce,
          relayerFee,
          amountOutIn,
          deadline,
          destinationAmountOutMin,
          deadline
        )
      }
    })

    if (tx?.hash && fromNetwork) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx?.hash,
          networkName: fromNetwork?.slug
        })
      )
    }
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

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center" className={styles.sendSelect}>
        <Typography variant="h4" className={styles.sendLabel}>
          Send
        </Typography>
        <RaisedSelect value={selectedToken.symbol} onChange={handleTokenSelect}>
          {tokens.map(token => (
            <MenuItem value={token.symbol} key={token.symbol}>
              {token.symbol}
            </MenuItem>
          ))}
        </RaisedSelect>
      </Box>
      <AmountSelectorCard
        value={fromTokenAmount}
        token={selectedToken}
        label={'From'}
        onChange={event => {
          if (!event.target.value) {
            setFromTokenAmount('')
            setToTokenAmount('')
            return
          }

          const amountIn = event.target.value
          setFromTokenAmount(amountIn)
          setIsFromLastChanged(true)
          updateAmountOut(amountIn)
        }}
        selectedNetwork={fromNetwork}
        networkOptions={networks}
        onNetworkChange={network => {
          setFromNetwork(network)

          if (network?.name === 'Arbitrum') {
            setL2Bridge(contracts?.networks.arbitrum.l2Bridge)
            setUniswapRouter(contracts?.networks.arbitrum.uniswapRouter)
          } else if (network?.name === 'Optimism') {
            setL2Bridge(contracts?.networks.optimism.l2Bridge)
            setUniswapRouter(contracts?.networks.optimism.uniswapRouter)
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
        onChange={event => {
          if (!event.target.value) {
            setToTokenAmount('')
            setFromTokenAmount('')
            return
          }

          const amountOut = event.target.value
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
            exchangeRate.toFixed(2)
          )}
        </Typography>
      </Box>
      <Alert severity="error" onClose={() => setError(null)} text={error} />
      <SendButton sending={sending} disabled={!validFormFields} onClick={send}>
        {buttonText}
      </SendButton>
      <br />
      <Alert severity="info" onClose={() => setInfo(null)} text={info} />
    </Box>
  )
}

export default Send
