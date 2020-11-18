import React, { FC, useState, useMemo, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import MuiButton from '@material-ui/core/Button'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import SendIcon from '@material-ui/icons/Send'
import RaisedSelect from '../../components/selects/RaisedSelect'
import AmountSelectorCard from '../../components/AmountSelectorCard'
import Button from '../../components/buttons/Button'

import { BigNumber, utils as ethersUtils } from 'ethers'
import Token from '../../models/Token'
import TokenAmount from '../../models/TokenAmount'
import Network from '../../models/Network'

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

  let tokenOptions = useMemo<Token[]>(() => [
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
        arbitrum: ethersUtils.parseEther('0.998125000000000000'),
        optimism: ethersUtils.parseEther('0.977777000000000000')
      }
    })
  ], [])
  const [selectedToken, setSelectedToken] = useState<Token>(tokenOptions[0])
  const fromNetwork: Network = useMemo(() => new Network('kovan'), [])
  const toNetwork: Network = useMemo(() => new Network('arbitrum'), [])
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
  const [toTokenAmount, setToTokenAmount] = useState<string>('')
  const exchangeRate = useMemo(() => ethersUtils.formatEther(ethersUtils.parseEther('1')
    .mul(selectedToken.rateForNetwork(toNetwork))
    .div(selectedToken.rateForNetwork(fromNetwork))), [toNetwork, fromNetwork])

  const handleTokenOptionSelect = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value
    const newSelectedToken = tokenOptions.find(token => token.symbol === tokenSymbol)
    if (newSelectedToken) {
      setSelectedToken(newSelectedToken)
    }
  }

  const handleSwitchDirection = () => {
    console.log('ToDo')
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
        onChange={ event => {
          if (!event.target.value) {
            setFromTokenAmount('')
            setToTokenAmount('')
            return
          }

          try {
            const fromAmount = ethersUtils.parseEther(event.target.value)
            const toAmount = fromAmount
              .mul(selectedToken.rateForNetwork(toNetwork))
              .div(selectedToken.rateForNetwork(fromNetwork))
            setFromTokenAmount(event.target.value)
            setToTokenAmount(ethersUtils.formatEther(toAmount))
          } catch (e) {}
        }}
      />
      <MuiButton className={styles.switchDirectionButton} onClick={handleSwitchDirection}>
        <ArrowDownIcon color="primary" className={styles.downArrow}/>
      </MuiButton>
      <AmountSelectorCard
        value={toTokenAmount}
        balance={'0.0'}
        onChange={ event => {
          setToTokenAmount(event.target.value)
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
        large
        highlighted
      >
        Send
      </Button>
    </Box>
  )
}

export default Send