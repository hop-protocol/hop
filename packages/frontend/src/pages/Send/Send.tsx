import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
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
import { Contract } from 'ethers'
import {
  parseEther,
  parseUnits,
  formatEther,
  formatUnits
} from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { addresses } from 'src/config'
import { UINT256 } from 'src/config/constants'
import uniswapV2PairArtifact from 'src/abi/UniswapV2Pair.json'

const useStyles = makeStyles(() => ({
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
    width: '46.0rem'
  }
}))

const Send: FC = () => {
  const styles = useStyles()

  const { user, tokens, networks, contracts, txConfirm, txHistory } = useApp()
  const l1Bridge = contracts?.l1Bridge
  const arbitrumBridge = contracts?.arbitrumBridge
  const arbitrumUniswapRouter = contracts?.arbitrumUniswapRouter
  const arbitrumUniswapFactory = contracts?.arbitrumUniswapFactory

  const {
    provider,
    setRequiredNetworkId,
    connectedNetworkId,
    walletConnected
  } = useWeb3Context()

  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  const [fromNetwork, setFromNetwork] = useState<Network>()
  const [toNetwork, setToNetwork] = useState<Network>()
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const [isFromLastChanged, setIsFromLastChanged] = useState<boolean>(true)
  const [sending, setSending] = useState<boolean>(false)
  let [daiRate, setDaiRate] = useState<number>(0)
  let [hopDaiRate, setHopDaiRate] = useState<number>(0)
  const [fetchingRate, setFetchingRate] = useState<boolean>(false)
  const [fromRate, setFromRate] = useState<number>(0)
  const [toRate, setToRate] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(0)

  const getRate = async (network: Network): Promise<number> => {
    if (!network) return 0
    if (network.slug === 'kovan') {
      return 1
    }
    const hopDai = addresses.arbitrumBridge
    const dai = addresses.l1Dai
    const path = [dai, hopDai]
    const pairAddress = await arbitrumUniswapFactory?.getPair(...path)
    const pair = new Contract(
      pairAddress,
      uniswapV2PairArtifact.abi,
      contracts?.arbitrumProvider
    )

    const decimals = await pair.decimals()
    const reserves = await pair.getReserves()
    const reserve0 = formatUnits(reserves[0].toString(), decimals)
    const reserve1 = formatUnits(reserves[1].toString(), decimals)
    const amount0 = parseUnits('1', decimals)
    const amount1 = await arbitrumUniswapRouter?.quote(
      amount0,
      parseUnits(reserve0, decimals),
      parseUnits(reserve1, decimals)
    )
    const formattedAmountB = formatUnits(amount1, decimals)
    return Number(formattedAmountB) // token1Rate
  }

  useEffect(() => {
    const update = async () => {
      if (!fromNetwork) return
      if (!toNetwork) return
      if (!fetchingRate) {
        setFetchingRate(true)
      }

      if (!daiRate) {
        daiRate = await getRate(networks[0])
        setDaiRate(daiRate)
      }
      if (!hopDaiRate) {
        hopDaiRate = await getRate(networks[1])
        setHopDaiRate(hopDaiRate)
      }

      if (fromNetwork.slug === 'kovan') {
        setFromRate(daiRate)
        setToRate(hopDaiRate)
        setExchangeRate((1 * hopDaiRate) / daiRate)
      } else {
        setFromRate(hopDaiRate)
        setToRate(daiRate)
        setExchangeRate((1 * daiRate) / hopDaiRate)
      }
      setFetchingRate(false)
    }

    update()
  }, [fromNetwork, toNetwork])

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

  const checkWalletNetwork = () => {
    if (fromNetwork) {
      setRequiredNetworkId(fromNetwork?.networkId)
    }
    return connectedNetworkId === fromNetwork?.networkId
  }

  // Control toTokenAmount when fromTokenAmount was edited last
  useEffect(() => {
    if (!toRate) return
    if (!fromRate) return
    if (!isFromLastChanged) return
    const toAmount = ((Number(fromTokenAmount) * toRate) / fromRate).toFixed(2)
    setToTokenAmount(toAmount)
  }, [isFromLastChanged, toRate, fromRate, fromTokenAmount, setToTokenAmount])

  // Control fromTokenAmount when toTokenAmount was edited last
  useEffect(() => {
    if (!toRate) return
    if (!fromRate) return
    if (isFromLastChanged) return
    const fromAmount = ((Number(toTokenAmount) * fromRate) / toRate).toFixed(2)
    setFromTokenAmount(fromAmount)
  }, [isFromLastChanged, toRate, fromRate, toTokenAmount, setFromTokenAmount])

  const approve = async (amount: string) => {
    const signer = user?.signer()

    if (!signer) {
      throw new Error('Wallet not connected')
    }

    if (!fromNetwork) {
      throw new Error('No fromNetwork selected')
    }

    const tokenContract = selectedToken
      .contractForNetwork(fromNetwork)
      .connect(signer)

    let tx: any
    if (fromNetwork.isLayer1) {
      const approved = await tokenContract.allowance(
        await signer?.getAddress(),
        l1Bridge?.address
      )
      const parsedAmount = parseUnits(amount, selectedToken.decimals || 18)
      if (approved.lt(parsedAmount)) {
        tx = txConfirm?.show({
          kind: 'approval',
          inputProps: {
            amount: 'ALL',
            token: selectedToken
          },
          onConfirm: async () => {
            return tokenContract.approve(l1Bridge?.address, UINT256)
          }
        })
      }
    } else {
      const approved = await tokenContract.allowance(
        await signer?.getAddress(),
        arbitrumUniswapRouter?.address
      )
      const parsedAmount = parseUnits(amount, selectedToken.decimals || 18)
      if (approved.lt(parsedAmount)) {
        tx = txConfirm?.show({
          kind: 'approval',
          inputProps: {
            amount: 'ALL',
            token: selectedToken
          },
          onConfirm: async () => {
            // ToDo: Get uniswap contract based on from network
            return tokenContract.approve(
              arbitrumUniswapRouter?.address,
              UINT256
            )
          }
        })
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
      } else if (!fromNetwork.isLayer1) {
        await sendl2ToL1()
      } else {
        console.log('ToDo: L2 to L2 transfers')
      }
    } catch (err) {
      alert(err.message)
      console.error(err)
    }
    setSending(false)
  }

  const sendl1ToL2 = async () => {
    const signer = provider?.getSigner()
    if (!l1Bridge || !signer) {
      throw new Error('Cannot send: l1Bridge or signer does not exist.')
    }

    const arbitrumNetwork = networks[1]
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
        //const deadline = (Date.now() / 1000 + 5 * 60) | 0
        return l1Bridge.sendToL2AndAttemptSwap(
          arbitrumNetwork.key(),
          await signer.getAddress(),
          parseEther(fromTokenAmount),
          '0'
          //deadline
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

  const sendl2ToL1 = async () => {
    const signer = provider?.getSigner()
    if (!arbitrumBridge || !signer) {
      throw new Error('Cannot send: l1Bridge or signer does not exist.')
    }

    alert('not implemented')
    // ToDo: Hook up to swapAndSendToMainnet
    // const arbitrumNetwork = networks[1]
    // await arbitrumBridge.swapAndSendToMainnet(
    // )
  }

  const validFormFields = !!(fromTokenAmount && toTokenAmount && exchangeRate)

  let buttonText = 'Send'
  if (!walletConnected) {
    buttonText = 'Connect wallet'
  } else if (!fromNetwork) {
    buttonText = 'Select from network'
  } else if (!toNetwork) {
    buttonText = 'Select to network'
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
        label={isFromLastChanged ? 'From' : 'From (estimated)'}
        onChange={event => {
          if (!event.target.value) {
            setFromTokenAmount('')
            setToTokenAmount('')
            return
          }

          setFromTokenAmount(event.target.value)
          setIsFromLastChanged(true)

          if (toRate && fromRate) {
            const fromAmount = Number(event.target.value)
            const toAmount = ((fromAmount * toRate) / fromRate).toFixed(2)
            setToTokenAmount(toAmount)
          }
        }}
        selectedNetwork={fromNetwork}
        networkOptions={networks}
        onNetworkChange={network => {
          setFromNetwork(network)
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
        label={isFromLastChanged ? 'To (estimated)' : 'To'}
        onChange={event => {
          if (!event.target.value) {
            setToTokenAmount('')
            setFromTokenAmount('')
            return
          }

          setToTokenAmount(event.target.value)
          setIsFromLastChanged(false)

          if (toRate && fromRate) {
            const toAmount = Number(event.target.value)
            const fromAmount = ((toAmount * fromRate) / toRate).toFixed(2)
            setFromTokenAmount(fromAmount)
          }
        }}
        selectedNetwork={toNetwork}
        networkOptions={networks}
        onNetworkChange={network => {
          setToNetwork(network)
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
        <Typography variant="subtitle2" color="textSecondary">
          {fetchingRate ? (
            <CircularProgress size={12} />
          ) : exchangeRate === 0 ? (
            '-'
          ) : (
            exchangeRate.toFixed(2)
          )}
        </Typography>
      </Box>
      <SendButton sending={sending} disabled={!validFormFields} onClick={send}>
        {buttonText}
      </SendButton>
    </Box>
  )
}

export default Send
