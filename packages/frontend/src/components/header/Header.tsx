import React, { FC, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import HeaderRoutes from 'src/components/header/HeaderRoutes'
import TxPill from 'src/components/header/TxPill'
import HopLogoBlack from 'src/assets/logos/hop-logo-black.svg'
import HopLogoWhite from 'src/assets/logos/hop-logo-white.svg'
import { isMainnet } from 'src/config'
import Settings from 'src/components/header/Settings'
import WalletWarning from './WalletWarning'
import {
  toTokenDisplay,
  networkIdNativeTokenSymbol,
  networkIdToSlug,
  findNetworkBySlug,
} from 'src/utils'
import Network from 'src/models/Network'
import logger from 'src/logger'
import { useInterval } from 'react-use'
import ConnectWalletButton from './ConnectWalletButton'
import { isDarkMode } from 'src/theme/theme'
import IconButton from '@material-ui/core/IconButton'
import SunIcon from 'src/assets/sun-icon.svg'
import MoonIcon from 'src/assets/moon-icon.svg'
import { Flex, Icon } from '../ui'
import { useThemeMode } from 'src/theme/ThemeProvider'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '8rem',
    padding: '0 4.2rem',
    [theme.breakpoints.down('sm')]: {
      minHeight: '7rem',
      padding: '0 2rem',
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      paddingTop: '2rem',
      marginBottom: '4rem',
    },
    transition: 'all 0.15s ease-out',
  },
  hopLogo: {
    display: 'flex',
    alignItems: 'center',
    width: '8.2rem',
    [theme.breakpoints.down('sm')]: {
      width: '7rem',
    },
  },
  label: {
    fontSize: '1rem',
    position: 'absolute',
    bottom: '-0.2rem',
    right: '0',
    opacity: '0.2',
  },
  walletPill: {
    margin: '0rem 1rem',
  },
  balancePill: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: '3rem',
    margin: '0rem 1rem',
    padding: '1rem 2rem',
    boxShadow: isDarkMode(theme)
      ? theme.boxShadow.inner
      : `rgba(255, 255, 255, 0.5) -3px -3px 6px inset, rgba(174, 174, 192, 0.16) 3px 3px 6px inset`,
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    transition: 'all 0.15s ease-out',
  },
  balance: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },
  },
  image: {
    marginRight: '0.5rem',
    width: '16px',
    [theme.breakpoints.down('sm')]: {
      width: '12px',
    },
  },
}))

const Header: FC = () => {
  const styles = useStyles()
  const { address, provider, connectedNetworkId } = useWeb3Context()
  const { l1Network, networks, theme } = useApp()
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
    if (address && provider && connectedNetworkId) {
      updateDisplayBalance()
    }
  }, [address, provider, connectedNetworkId])

  useInterval(updateDisplayBalance, 5000)

  const { toggleMode, mode } = useThemeMode()
  const showBalance = !!displayBalance && !!connectedNetwork
  const ThemeModeIcon: any = isDarkMode(mode) ? SunIcon : MoonIcon

  return (
    <>
      <Box className={styles.root} display="flex" alignItems="center">
        <Box display="flex" flexDirection="row" flex={1} justifyContent="flex-start">
          <Link to="/">
            <img
              className={styles.hopLogo}
              src={theme?.palette.type === 'dark' ? HopLogoWhite : HopLogoBlack}
              alt="Hop"
            />
            {!isMainnet ? <span className={styles.label}>{l1Network?.name}</span> : null}
          </Link>
        </Box>

        <Box display="flex" flexDirection="row" flex={1} justifyContent="center" alignSelf="center">
          <HeaderRoutes />
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          flex={1}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Flex alignCenter p={[1, 1]} mx={[2, 0]}>
            <IconButton onClick={toggleMode}>
              <Icon src={ThemeModeIcon} width={20} alt="Change theme" />
            </IconButton>
          </Flex>

          <Settings />

          {showBalance && (
            <div className={styles.balancePill} title={connectedNetwork?.name}>
              <div className={styles.balance}>
                <img className={styles.image} alt="" src={connectedNetwork?.imageUrl} />
                {displayBalance}
              </div>
            </div>
          )}

          <div className={styles.walletPill}>
            {address ? <TxPill /> : <ConnectWalletButton mode={theme?.palette.type} />}
          </div>
        </Box>
      </Box>
      <WalletWarning />
    </>
  )
}

export default Header
