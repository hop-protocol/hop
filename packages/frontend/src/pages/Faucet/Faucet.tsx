import React, { FC, ChangeEvent, SyntheticEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import MenuItem from '@material-ui/core/MenuItem'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Alert from 'src/components/alert/Alert'
import Token from 'src/models/Token'
import { useFaucet } from 'src/pages/Faucet/FaucetContext'
import Button from 'src/components/buttons/Button'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem'
  },
  box: {
    marginBottom: '2rem',
    flexDirection: 'column'
  },
  text: {
    display: 'block',
    marginBottom: '1rem',
    fontSize: '2rem'
  },
  button: {},
  alert: {
    marginTop: '2rem',
    marginBottom: '1.2rem'
  }
}))

const Pools: FC = () => {
  const styles = useStyles()
  let {
    mintToken,
    mintAmount,
    isMinting,
    error,
    setError,
    tokens,
    selectedToken,
    setSelectedToken,
    selectedNetwork
  } = useFaucet()

  const handleMint = () => {
    mintToken()
  }

  const handleTokenChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const token = tokens.find((token: Token) => token.symbol === tokenSymbol)
    if (token) {
      setSelectedToken(token)
    }
  }

  const handleKethFaucetClick = (event: SyntheticEvent) => {
    event.preventDefault()
    window.open('https://gitter.im/kovan-testnet/faucet', '_blank')
  }

  const handlexDaiFaucetClick = (event: SyntheticEvent) => {
    event.preventDefault()
    window.open('https://blockscout.com/poa/sokol/faucet', '_blank')
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Faucet
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" className={styles.box}>
        <Typography variant="body1" className={styles.text}>
          Mint {mintAmount} {selectedNetwork?.name}
          <RaisedSelect
            value={selectedToken?.symbol}
            onChange={handleTokenChange}
          >
            {tokens.map(token => (
              <MenuItem value={token.symbol} key={token.symbol}>
                {token.symbol}
              </MenuItem>
            ))}
          </RaisedSelect>
        </Typography>
        <Alert
          className={styles.alert}
          severity="error"
          onClose={() => setError(null)}
          text={error}
        />
        <Button
          className={styles.button}
          onClick={handleMint}
          large
          highlighted
          loading={isMinting}
        >
          Mint {selectedToken?.symbol}
        </Button>
      </Box>
      <Box display="flex" alignItems="center" className={styles.box}>
        <Typography variant="body1" className={styles.text}>
          Get {selectedNetwork?.name} ETH
        </Typography>
        <Button
          className={styles.button}
          onClick={handleKethFaucetClick}
          large
          highlighted
        >
          Get {selectedNetwork?.name} ETH ↗
        </Button>
      </Box>
      <Box display="flex" alignItems="center" className={styles.box}>
        <Typography variant="body1" className={styles.text}>
          Get xDAI Sokol ETH (SPOA)
        </Typography>
        <Button
          className={styles.button}
          onClick={handlexDaiFaucetClick}
          large
          highlighted
        >
          Get xDai ETH ↗
        </Button>
      </Box>
    </Box>
  )
}

export default Pools
