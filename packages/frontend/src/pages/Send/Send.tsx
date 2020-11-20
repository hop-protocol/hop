import React, {
  FC,
  useState,
  useMemo,
  useEffect,
  ChangeEvent
} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import MuiButton from '@material-ui/core/Button'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import SendIcon from '@material-ui/icons/Send'
import RaisedSelect from '../../components/selects/RaisedSelect'
import AmountSelectorCard from './AmountSelectorCard'
import Button from '../../components/buttons/Button'

import { utils as ethersUtils } from 'ethers'
import Token from '../../models/Token'
import Network from '../../models/Network'
import { useWeb3Context } from '../../contexts/web3Context'
import { useContracts } from '../../contexts/contracts'

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
  },
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem'
  }
}))

const Send: FC = () => {
  const styles = useStyles()

  const networkOptions = useMemo<Network[]>(() => [
    new Network('kovan'),
    new Network('optimism'),
    new Network('arbitrum')
  ], [])

  const tokenOptions = useMemo<Token[]>(() => [
    new Token({
      symbol: 'ETH',
      tokenName: 'Ether',
      addresses: {},
      rates: {
        kovan: ethersUtils.parseEther('1'),
        arbitrum: ethersUtils.parseEther('0.998125000000000000'),
        optimism: ethersUtils.parseEther('0.977777000000000000')
      }
    }),
    new Token({
      symbol: 'DAI',
      tokenName: 'DAI Stablecoin',
      addresses: {},
      rates: {
        kovan: ethersUtils.parseEther('1'),
        arbitrum: ethersUtils.parseEther('0.958125000000000000'),
        optimism: ethersUtils.parseEther('0.967777000000000000')
      }
    })
  ], [])
  const [selectedToken, setSelectedToken] = useState<Token>(tokenOptions[0])
  const [fromNetwork, setFromNetwork] = useState<Network>()
  const [toNetwork, setToNetwork] = useState<Network>()
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const [isFromLastChanged, setIsFromLastChanged] = useState<boolean>(false)
  const exchangeRate = useMemo(() => {
    if (!fromNetwork || !toNetwork) {
      return '-'
    }

    let rate
    try {
      rate = ethersUtils.formatEther(ethersUtils.parseEther('1')
        .mul(selectedToken.rateForNetwork(toNetwork))
        .div(selectedToken.rateForNetwork(fromNetwork)))
    } catch (err) {
    }

    return rate || '-'
  }, [toNetwork, fromNetwork, selectedToken])
  const { provider } = useWeb3Context()
  const { l1_dai, l1_bridge } = useContracts()

  const handleTokenOptionSelect = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value
    const newSelectedToken = tokenOptions.find(token => token.symbol === tokenSymbol)
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

  // Control toTokenAmount when fromTokenAmount was edited last
  useEffect(() => {
    if (isFromLastChanged) {
      try {
        const toAmount = ethersUtils.parseEther(fromTokenAmount)
          .mul(selectedToken.rateForNetwork(toNetwork))
          .div(selectedToken.rateForNetwork(fromNetwork))
        setToTokenAmount(ethersUtils.formatEther(toAmount))
      } catch (err) {}
    }
  }, [isFromLastChanged, fromNetwork, toNetwork, selectedToken, fromTokenAmount, setToTokenAmount])

  // Control fromTokenAmount when toTokenAmount was edited last
  useEffect(() => {
    if (!isFromLastChanged) {
      try {
        const fromAmount = ethersUtils.parseEther(toTokenAmount)
          .mul(selectedToken.rateForNetwork(fromNetwork))
          .div(selectedToken.rateForNetwork(toNetwork))
        setFromTokenAmount(ethersUtils.formatEther(fromAmount))
      } catch (err) {}
    }
  }, [isFromLastChanged, fromNetwork, toNetwork, selectedToken, toTokenAmount, setFromTokenAmount])

  const approve = async () => {
    await l1_dai?.approve('0xc9898e162b6a43dc665b033f1ef6b2bc7b0157b4', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
  }

  const send = async () => {
    const signer = provider?.getSigner()
    if (!l1_bridge || !signer) {
      throw new Error('Cannot send: l1_bridge or signer does not exist.')
    }

    const arbitrumNetwork = new Network('arbitrum')
    // await l1_bridge.sendToL2(arbitrumNetwork.key(), await signer.getAddress(), fromTokenAmount)
    await l1_bridge.sendToL2AndAttemptSwap(
      arbitrumNetwork.key(),
      await signer.getAddress(),
      fromTokenAmount,
      '0'
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box display="flex" alignItems="center" className={styles.sendSelect}>
        <Typography variant="h4" className={styles.sendLabel}>
          Send
        </Typography>
        <RaisedSelect value={selectedToken.symbol} onChange={handleTokenOptionSelect}>
          {tokenOptions.map( token =>
            <MenuItem value={token.symbol} key={token.symbol}>
              {token.symbol}
            </MenuItem>
          )}
        </RaisedSelect>
      </Box>
      <AmountSelectorCard
        value={fromTokenAmount}
        balance={'0.0'}
        token={selectedToken}
        onChange={ event => {
          if (!event.target.value) {
            setFromTokenAmount('')
            setToTokenAmount('')
            return
          }

          setFromTokenAmount(event.target.value)
          setIsFromLastChanged(true)

          try {
            const fromAmount = ethersUtils.parseEther(event.target.value)
            const toAmount = fromAmount
              .mul(selectedToken.rateForNetwork(toNetwork))
              .div(selectedToken.rateForNetwork(fromNetwork))
            setToTokenAmount(ethersUtils.formatEther(toAmount))
          } catch (e) {}
        }}
        selectedNetwork={fromNetwork}
        networkOptions={networkOptions}
        onNetworkChange={ network => {
          setFromNetwork(network)
        }}
      />
      <MuiButton className={styles.switchDirectionButton} onClick={handleSwitchDirection}>
        <ArrowDownIcon color="primary" className={styles.downArrow}/>
      </MuiButton>
      <AmountSelectorCard
        value={toTokenAmount}
        balance={'0.0'}
        token={selectedToken}
        onChange={ event => {
          if (!event.target.value) {
            setToTokenAmount('')
            setFromTokenAmount('')
            return
          }

          setToTokenAmount(event.target.value)
          setIsFromLastChanged(false)

          try {
            const toAmount = ethersUtils.parseEther(event.target.value)
            const fromAmount = toAmount
              .mul(selectedToken.rateForNetwork(fromNetwork))
              .div(selectedToken.rateForNetwork(toNetwork))
            setFromTokenAmount(ethersUtils.formatEther(fromAmount))
          } catch (e) {}
        }}
        selectedNetwork={toNetwork}
        networkOptions={networkOptions}
        onNetworkChange={ network => {
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
      <Button
        className={styles.sendButton}
        startIcon={<SendIcon />}
        onClick={approve}
        large
        highlighted
      >
        Approve
      </Button>
      <Button
        className={styles.sendButton}
        startIcon={<SendIcon />}
        onClick={send}
        large
        highlighted
      >
        Send
      </Button>
    </Box>
  )
}

export default Send