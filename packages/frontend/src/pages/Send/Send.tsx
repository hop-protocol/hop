import React, { FC, useState, useMemo, useEffect, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import MuiButton from '@material-ui/core/Button'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import AmountSelectorCard from 'src/pages/Send/AmountSelectorCard'
import SendButton from 'src/pages/Send/SendButton'
import TxConfirm from 'src/components/txConfirm/TxConfirm'
import useTxConfirm from 'src/contexts/AppContext/useTxConfirm'
import { parseEther, formatEther, parseUnits } from 'ethers/lib/utils'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'

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

  const { user, tokens, networks, contracts } = useApp()
  const { l1Bridge, arbitrumBridge, arbitrumUniswapRouter } = contracts

  const {
    provider,
    setRequiredNetworkId,
    validConnectedNetworkId,
    walletConnected
  } = useWeb3Context()

  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0])
  const [fromNetwork, setFromNetwork] = useState<Network>()
  const [toNetwork, setToNetwork] = useState<Network>()
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const [isFromLastChanged, setIsFromLastChanged] = useState<boolean>(true)
  const { txConfirm, showTxConfirm } = useTxConfirm()
  const [sending, setSending] = useState<boolean>(false)
  const exchangeRate = useMemo(() => {
    if (!fromNetwork || !toNetwork) {
      return '-'
    }

    let rate
    try {
      rate = formatEther(
        parseEther('1')
          .mul(selectedToken.rateForNetwork(toNetwork))
          .div(selectedToken.rateForNetwork(fromNetwork))
      )
    } catch (err) {}

    return rate || '-'
  }, [toNetwork, fromNetwork, selectedToken])

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
    if (fromNetwork) {
      setRequiredNetworkId(fromNetwork?.networkId)
    }
  }, [fromNetwork, setRequiredNetworkId])

  // Control toTokenAmount when fromTokenAmount was edited last
  useEffect(() => {
    if (isFromLastChanged) {
      try {
        const toAmount = parseEther(fromTokenAmount)
          .mul(selectedToken.rateForNetwork(toNetwork))
          .div(selectedToken.rateForNetwork(fromNetwork))
        setToTokenAmount(formatEther(toAmount))
      } catch (err) {}
    }
  }, [
    isFromLastChanged,
    fromNetwork,
    toNetwork,
    selectedToken,
    fromTokenAmount,
    setToTokenAmount
  ])

  // Control fromTokenAmount when toTokenAmount was edited last
  useEffect(() => {
    if (!isFromLastChanged) {
      try {
        const fromAmount = parseEther(toTokenAmount)
          .mul(selectedToken.rateForNetwork(fromNetwork))
          .div(selectedToken.rateForNetwork(toNetwork))
        setFromTokenAmount(formatEther(fromAmount))
      } catch (err) {}
    }
  }, [
    isFromLastChanged,
    fromNetwork,
    toNetwork,
    selectedToken,
    toTokenAmount,
    setFromTokenAmount
  ])

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

    if (fromNetwork.isLayer1) {
      const approved = await tokenContract.allowance(
        await signer?.getAddress(),
        l1Bridge?.address
      )
      const parsedAmount = parseUnits(amount, selectedToken.decimals || 18)
      if (approved.lt(parsedAmount)) {
        return showTxConfirm({
          kind: 'approval',
          inputProps: {
            amount: 'ALL',
            token: selectedToken
          },
          onConfirm: async () => {
            return tokenContract.approve(
              l1Bridge?.address,
              '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            )
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
        return showTxConfirm({
          kind: 'approval',
          inputProps: {
            amount: 'ALL',
            token: selectedToken
          },
          onConfirm: async () => {
            // ToDo: Get uniswap contract based on from network
            return tokenContract.approve(
              arbitrumUniswapRouter?.address,
              '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            )
          }
        })
      }
    }
  }

  const send = async () => {
    try {
      if (!fromNetwork || !toNetwork) {
        throw new Error('A network is undefined')
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

    return showTxConfirm({
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
        return l1Bridge.sendToL2AndAttemptSwap(
          arbitrumNetwork.key(),
          await signer.getAddress(),
          parseEther(fromTokenAmount),
          '0'
        )
      }
    })
  }

  const sendl2ToL1 = async () => {
    const signer = provider?.getSigner()
    if (!arbitrumBridge || !signer) {
      throw new Error('Cannot send: l1Bridge or signer does not exist.')
    }

    // ToDo: Hook up to swapAndSendToMainnet
    // const arbitrumNetwork = networks[1]
    // await arbitrumBridge.swapAndSendToMainnet(
    // )
  }

  const validFormFields = !!(
    validConnectedNetworkId &&
    fromTokenAmount &&
    toTokenAmount
  )

  let buttonText = 'Send'
  if (!walletConnected) {
    buttonText = 'Connect wallet'
  } else if (!fromNetwork) {
    buttonText = 'Select from network'
  } else if (!toNetwork) {
    buttonText = 'Select to network'
  } else if (!validConnectedNetworkId) {
    buttonText = 'Change network'
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

          try {
            const fromAmount = parseEther(event.target.value)
            const toAmount = fromAmount
              .mul(selectedToken.rateForNetwork(toNetwork))
              .div(selectedToken.rateForNetwork(fromNetwork))
            setToTokenAmount(formatEther(toAmount))
          } catch (e) {}
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

          try {
            const toAmount = parseEther(event.target.value)
            const fromAmount = toAmount
              .mul(selectedToken.rateForNetwork(fromNetwork))
              .div(selectedToken.rateForNetwork(toNetwork))
            setFromTokenAmount(formatEther(fromAmount))
          } catch (e) {}
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
          {exchangeRate}
        </Typography>
      </Box>
      <SendButton sending={sending} disabled={!validFormFields} onClick={send}>
        {buttonText}
      </SendButton>
      <TxConfirm {...txConfirm} />
    </Box>
  )
}

export default Send
