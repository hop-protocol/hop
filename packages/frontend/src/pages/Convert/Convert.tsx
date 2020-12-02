import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import AmountSelectorCard from 'src/pages/Send/AmountSelectorCard'
import SendIcon from '@material-ui/icons/Send'
import Button from 'src/components/buttons/Button'
import { useApp } from 'src/contexts/AppContext'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '4.2rem'
  },
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem'
  }
}))

const Convert: FC = () => {
  const styles = useStyles()
  let { networks, tokens } = useApp()
  networks = networks.filter((network: Network) =>
    ['arbitrum', 'optimism'].includes(network.slug)
  )

  const [selectedToken] = useState<Token>(tokens[0])
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>(
    networks[0]
  )
  const [tokenAmount, setTokenAmount] = useState<string>('')

  const handleSubmit = () => {
    alert('not implemented')
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Convert
        </Typography>
      </Box>
      <AmountSelectorCard
        value={tokenAmount}
        token={selectedToken}
        label={'Amount'}
        onChange={event => {
          if (!event.target.value) {
            setTokenAmount('')
            return
          }

          setTokenAmount(event.target.value)
        }}
        selectedNetwork={selectedNetwork}
        networkOptions={networks}
        onNetworkChange={(network: Network | undefined) => {
          setSelectedNetwork(network)
        }}
      />
      <Button
        className={styles.sendButton}
        startIcon={<SendIcon />}
        onClick={handleSubmit}
        large
        highlighted
      >
        Convert
      </Button>
    </Box>
  )
}

export default Convert
