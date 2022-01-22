import React, { FC, ChangeEvent, SyntheticEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import { useApp } from 'src/contexts/AppContext'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import Alert from 'src/components/alert/Alert'
import { useFaucet } from 'src/pages/Faucet/FaucetContext'
import Button from 'src/components/buttons/Button'
import { findMatchingBridge } from 'src/utils'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem',
  },
  box: {
    marginBottom: '2rem',
    flexDirection: 'column',
  },
  text: {
    fontSize: '2rem',
    marginRight: '1rem',
  },
  selectBox: {
    marginBottom: '2rem',
  },
  button: {},
  alert: {
    marginTop: '2rem',
    marginBottom: '1.2rem',
  },
}))

const Faucet: FC = () => {
  const styles = useStyles()
  const { bridges, selectedBridge, setSelectedBridge } = useApp()
  const { mintToken, mintAmount, isMinting, error, setError, tokens, selectedNetwork } = useFaucet()

  const handleMint = () => {
    mintToken()
  }

  const handleTokenChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const bridge = findMatchingBridge(bridges, tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  const handleKethFaucetClick = (event: SyntheticEvent) => {
    event.preventDefault()
    window.open('https://gitter.im/kovan-testnet/faucet', '_blank')
  }

  const handleGnosisFaucetClick = (event: SyntheticEvent) => {
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
        <Box display="flex" alignItems="center" flexDirection="row" className={styles.selectBox}>
          <Typography variant="body1" className={styles.text}>
            Mint {mintAmount} {selectedNetwork?.name}
          </Typography>
          <RaisedSelect value={selectedBridge?.getTokenSymbol()} onChange={handleTokenChange}>
            {tokens.map(token => (
              <MenuItem value={token.symbol} key={token.symbol}>
                {token.symbol}
              </MenuItem>
            ))}
          </RaisedSelect>
        </Box>
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
          Mint {selectedBridge?.getTokenSymbol()}
        </Button>
      </Box>
      <Box display="flex" alignItems="center" className={styles.box}>
        <Typography variant="body1" className={styles.text}>
          Get {selectedNetwork?.name} ETH
        </Typography>
        <Button className={styles.button} onClick={handleKethFaucetClick} large highlighted>
          Get {selectedNetwork?.name} ETH ↗
        </Button>
      </Box>
      <Box display="flex" alignItems="center" className={styles.box}>
        <Typography variant="body1" className={styles.text}>
          Get xDAI Sokol ETH (SPOA)
        </Typography>
        <Button className={styles.button} onClick={handleGnosisFaucetClick} large highlighted>
          Get Gnosis ETH ↗
        </Button>
      </Box>
    </Box>
  )
}

export default Faucet
