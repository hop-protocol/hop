import React, { FC, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import HeaderRoutes from 'src/components/header/HeaderRoutes'
import TxPill from 'src/components/header/TxPill'
import HopLogoFullColor from 'src/assets/logos/hop-logo-full-color.svg'
import { isMainnet } from 'src/config'
import Settings from 'src/pages/Send/Settings'
import WalletWarning from './WalletWarning'
import { toTokenDisplay, networkIdToName, networkIdNativeTokenSymbol, networkIdToSlug } from 'src/utils'
import { findNetworkBySlug } from 'src/utils/networks'
import Network from 'src/models/Network'
import logger from 'src/logger'
import {
  useInterval
} from 'src/hooks'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '10.0rem',
    padding: '0 4.2rem',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      paddingTop: '2rem',
      marginBottom: '4rem',
    },
  },
  title: {
    position: 'relative',
  },
  hopLogo: {
    marginTop: '-1.0rem',
    width: '19.1rem',
  },
  label: {
    fontSize: '1rem',
    position: 'absolute',
    bottom: '-0.2rem',
    right: '0',
    opacity: '0.2',
  },
  balancePill: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: '3rem',
    marginRight: '1rem',
    padding: '0.4rem 2rem',
    boxShadow: 'rgba(255, 255, 255, 0.5) -3px -3px 6px inset, rgba(174, 174, 192, 0.16) 3px 3px 6px inset',
    color: theme.palette.text.secondary
  },
  balance: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    whiteSpace: 'nowrap'
  },
  network: {
    fontSize: '1.4rem',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  image: {
    marginRight: '0.5rem',
    width: '16px'
  }
}))

const Header: FC = () => {
  const styles = useStyles()
  const { address, requestWallet, provider, connectedNetworkId } = useWeb3Context()
  const { l1Network, networks } = useApp()
  const [displayBalance, setDisplayBalance] = useState<string>('')
  const [connectedNetwork, setConnectedNetwork] = useState<Network | undefined>()

  const updateDisplayBalance = async () => {
    try {
      if (!(address && provider && connectedNetworkId)) {
        setDisplayBalance('')
        return
      }
      const balance = await provider.getBalance(address.address)
      const formattedBalance = toTokenDisplay(balance, 18)
      const tokenSymbol = networkIdNativeTokenSymbol(connectedNetworkId)
      const _displayBalance = `${formattedBalance} ${tokenSymbol}`
      const network = findNetworkBySlug(networks, networkIdToSlug(connectedNetworkId))
      setDisplayBalance(_displayBalance)
      setConnectedNetwork(network)
    } catch (err) {
      logger.error(err)
      setDisplayBalance('')
    }
  }

  useEffect(() => {
    updateDisplayBalance().catch(logger.error)
  }, [address, provider, connectedNetworkId])

  useInterval(() => {
    updateDisplayBalance().catch(logger.error)
  }, 5 * 1000)

  const showBalance = !!displayBalance && !!connectedNetwork

  return (
    <>
      <Box className={styles.root} display="flex" alignItems="center">
        <Box display="flex" flexDirection="row" flex={1} justifyContent="flex-start">
          <Link to="/">
            <h1 className={styles.title}>
              <img className={styles.hopLogo} src={HopLogoFullColor} alt="Hop" />
              {!isMainnet ? <span className={styles.label}>{l1Network?.name}</span> : null}
            </h1>
          </Link>
        </Box>
        <Box display="flex" flexDirection="row" flex={1} justifyContent="center">
          <HeaderRoutes />
        </Box>
        <Box display="flex" flexDirection="row" flex={1} justifyContent="flex-end">
          <Settings />
          {showBalance &&
            <div className={styles.balancePill}>
              <div className={styles.balance}>{displayBalance}</div>
              <div className={styles.network}>
                <img className={styles.image} alt="" src={connectedNetwork?.imageUrl} />
                {connectedNetwork?.name}
              </div>
            </div>
          }
          {address ? (
            <TxPill />
          ) : (
            <Button highlighted onClick={requestWallet}>
              Connect a Wallet
            </Button>
          )}
        </Box>
      </Box>
      <WalletWarning />
    </>
  )
}

export default Header
