import React, {
  FC,
  useState,
} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import AmountSelectorCard from 'src/pages/Send/AmountSelectorCard'
import { utils as ethersUtils } from 'ethers'
import SendIcon from '@material-ui/icons/Send'
import Button from 'src/components/buttons/Button'
import { useApp } from 'src/contexts/AppContext'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '4.2rem'
  },
  plusDivider: {
    textAlign: 'center',
    width: '100%',
    height: '2.4rem',
    margin: '2.2rem',
    fontSize: '2rem',
    opacity: '0.5',
  },
  pricesBox: {
    width: '51.6rem',
    marginTop: '4.2rem'
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  pricesCard: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem',
  }
}))

const Pools: FC = () => {
  const styles = useStyles()
  const { tokens: tokenOptions, networks: networkOptions } = useApp()
  const [selectedTokenA, setSelectedTokenA] = useState<Token>(tokenOptions[0])
  const [selectedTokenB, setSelectedTokenB] = useState<Token>(tokenOptions[0])
  const [tokenANetwork, setTokenANetwork] = useState<Network>()
  const [tokenBNetwork, setTokenBNetwork] = useState<Network>()
  const [tokenAAmount, setTokenAAmount] = useState<string>('')
  const [tokenBAmount, setTokenBAmount] = useState<string>('')
  const [isFromLastChanged, setIsFromLastChanged] = useState<boolean>(false)

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Add Liquidity
        </Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <AmountSelectorCard
          label='Input'
          token={selectedTokenA}
          value={tokenAAmount}
          onChange={ event => {
            if (!event.target.value) {
              setTokenAAmount('')
              setTokenBAmount('')
              return
            }

            setTokenAAmount(event.target.value)
            setIsFromLastChanged(true)

            try {
              const tokenAAmount = ethersUtils.parseEther(event.target.value)
              const tokenBAmount = tokenAAmount
                .mul(selectedTokenB.rateForNetwork(tokenBNetwork))
                .div(selectedTokenA.rateForNetwork(tokenANetwork))
              setTokenBAmount(ethersUtils.formatEther(tokenBAmount))
            } catch (e) {}
          }}
          selectedNetwork={tokenANetwork}
          networkOptions={networkOptions}
          onNetworkChange={ network => {
            setTokenANetwork(network)
          }}
        />
      </Box>
      <Box display="flex" alignItems="center">
        <div className={styles.plusDivider}>+</div>
      </Box>
      <Box display="flex" alignItems="center">
        <AmountSelectorCard
          label='Input'
          token={selectedTokenB}
          value={tokenBAmount}
          onChange={ event => {
            if (!event.target.value) {
              setTokenAAmount('')
              setTokenBAmount('')
              return
            }

            setTokenBAmount(event.target.value)
            setIsFromLastChanged(true)

            try {
              const tokenBAmount = ethersUtils.parseEther(event.target.value)
              const tokenAAmount = tokenBAmount
                .mul(selectedTokenA.rateForNetwork(tokenANetwork))
                .div(selectedTokenB.rateForNetwork(tokenBNetwork))
              setTokenAAmount(ethersUtils.formatEther(tokenAAmount))
            } catch (e) {}
          }}
          selectedNetwork={tokenBNetwork}
          networkOptions={networkOptions}
          onNetworkChange={ network => {
            setTokenBNetwork(network)
          }}
        />
      </Box>
      <Box alignItems="center" className={styles.pricesBox}>
        <Card className={styles.pricesCard}>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography variant="subtitle1" color="textSecondary">
              0
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {selectedTokenB.symbol} per {selectedTokenA.symbol}
            </Typography>
          </Box>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography variant="subtitle1" color="textSecondary">
              0
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
               {selectedTokenA.symbol} per {selectedTokenB.symbol}
            </Typography>
          </Box>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography variant="subtitle1" color="textSecondary">
              0%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Share of pool
            </Typography>
          </Box>
        </Card>
      </Box>
      <Button
        className={styles.sendButton}
        startIcon={<SendIcon />}
        large
        highlighted
        disabled
      >
        Approve
      </Button>
    </Box>
  )
}

export default Pools
