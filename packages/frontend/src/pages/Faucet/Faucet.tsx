import React, { FC, ChangeEvent, SyntheticEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Alert from 'src/components/alert/Alert'
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
    claimTokens,
    isClaiming,
    error,
    setError
  } = useFaucet()

  const handleDaiMint = () => {
    mintToken()
  }

  const handleKethFaucetClick = (event: SyntheticEvent) => {
    event.preventDefault()
    window.open('https://faucet.kovan.network/', '_blank')
  }

  const handlexDaiFaucetClick = (event: SyntheticEvent) => {
    event.preventDefault()
    window.open('https://blockscout.com/poa/sokol/faucet', '_blank')
  }

  const handleDaiClaim = () => {
    claimTokens()
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
          Mint {mintAmount} Kovan DAI
        </Typography>
        <Alert
          className={styles.alert}
          severity="error"
          onClose={() => setError(null)}
          text={error}
        />
        <Button
          className={styles.button}
          onClick={handleDaiMint}
          large
          highlighted
          loading={isMinting}
        >
          Mint DAI
        </Button>
      </Box>
      <Box display="flex" alignItems="center" className={styles.box}>
        <Typography variant="body1" className={styles.text}>
          Get Kovan ETH
        </Typography>
        <Button
          className={styles.button}
          onClick={handleKethFaucetClick}
          large
          highlighted
        >
          Get kETH ↗
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
      {/*
      <Box display="flex" alignItems="center" className={styles.box}>
        <Typography variant="body1" className={styles.text}>
          Claim Sokol DAI
        </Typography>
        <Button
          className={styles.button}
          onClick={handleDaiClaim}
          large
          highlighted
          loading={isClaiming}
        >
          Claim Sokol DAI
        </Button>
      </Box>
			*/}
    </Box>
  )
}

export default Pools
