import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
import SendIcon from '@material-ui/icons/Send'
import Network from 'src/models/Network'
import AmountSelectorCard from 'src/pages/Convert/AmountSelectorCard'
import Button from 'src/components/buttons/Button'
import { useConvert } from 'src/pages/Convert/ConvertContext'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '4.2rem'
  },
  switchDirectionButton: {
    padding: 0,
    minWidth: 0,
    margin: '1.0rem'
  },
  downArrow: {
    margin: '0.8rem',
    height: '2.4rem',
    width: '2.4rem'
  },
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem'
  }
}))

const Convert: FC = () => {
  const styles = useStyles()
  const {
    selectedToken,
    sourceNetwork,
    setSourceNetwork,
    sourceNetworks,
    destNetwork,
    setDestNetwork,
    destNetworks,
    token0Amount,
    setToken0Amount,
    token1Amount,
    convertTokens,
    validFormFields
  } = useConvert()

  const handleToken0AmountChange = (event: any) => {
    const value = event.target.value
    if (!value) {
      setToken0Amount('')
      return
    }

    setToken0Amount(value)
  }

  const handleToken1AmountChange = (event: any) => {}

  const handleSubmit = () => {
    convertTokens()
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Convert
        </Typography>
      </Box>
      <AmountSelectorCard
        value={token0Amount as string}
        token={selectedToken}
        label={'From'}
        onChange={handleToken0AmountChange}
        selectedNetwork={sourceNetwork}
        networkOptions={sourceNetworks}
        onNetworkChange={(network: Network | undefined) => {
          if (network) {
            setSourceNetwork(network)
          }
        }}
      />
      <div className={styles.switchDirectionButton}>
        <ArrowDownIcon color="primary" className={styles.downArrow} />
      </div>
      <AmountSelectorCard
        value={token1Amount as string}
        token={selectedToken}
        label={'To'}
        onChange={handleToken1AmountChange}
        selectedNetwork={destNetwork}
        networkOptions={destNetworks}
        onNetworkChange={(network: Network | undefined) => {
          if (network) {
            setDestNetwork(network)
          }
        }}
      />
      <Button
        className={styles.sendButton}
        startIcon={<SendIcon />}
        onClick={handleSubmit}
        disabled={!validFormFields}
        large
        highlighted
      >
        Convert
      </Button>
    </Box>
  )
}

export default Convert
