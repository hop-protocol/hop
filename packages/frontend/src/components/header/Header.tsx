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
import { isMainnet, showBannerMessage } from 'src/config'
import { l1Network } from 'src/config/networks'
import Settings from 'src/components/header/Settings'
import WalletWarning from './WalletWarning'
import {
  toTokenDisplay,
  networkIdNativeTokenSymbol,
  networkIdToSlug,
  findNetworkBySlug,
  fixedDecimals,
} from 'src/utils'
import Network from 'src/models/Network'
import logger from 'src/logger'
import { useInterval } from 'react-use'
import ConnectWalletButton from './ConnectWalletButton'
import IconButton from '@material-ui/core/IconButton'
import SunIcon from 'src/assets/sun-icon.svg'
import MoonIcon from 'src/assets/moon-icon.svg'
import { Flex, Icon } from '../ui'
import { useThemeMode } from 'src/theme/ThemeProvider'
import Banner from 'src/components/Banner'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '80px',
    padding: '0 42px',
    [theme.breakpoints.down('sm')]: {
      minHeight: '70px',
      padding: '0 20px',
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      paddingTop: '20px',
      marginBottom: '40px',
    },
    transition: 'all 0.15s ease-out',
  },
  hopLogo: {
    display: 'flex',
    alignItems: 'center',
    width: '82px',
    [theme.breakpoints.down('sm')]: {
      width: '70px',
    },
  },
  label: {
    fontSize: '10px',
    position: 'absolute',
    bottom: '-10px',
    right: '0',
    opacity: '0.2',
  },
  walletPill: {
    margin: '0px 10px',
  },
  balancePill: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '16px',
    marginLeft: '10px',
    padding: '12px 20px',
    boxShadow: ({ isDarkMode }: any) =>
      isDarkMode
        ? theme.boxShadow.inner
        : `rgba(255, 255, 255, 0.5) -3px -3px 6px inset, rgba(174, 174, 192, 0.16) 3px 3px 6px inset`,
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
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
    fontSize: '16px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
    },
  },
  image: {
    marginRight: '6px',
    width: '16px',
    [theme.breakpoints.down('sm')]: {
      width: '12px',
    },
  },
}))

const Header: FC = () => {
  const { toggleMode, isDarkMode } = useThemeMode()
  const styles = useStyles({ isDarkMode })
  const { address, provider, connectedNetworkId } = useWeb3Context()
  const { theme } = useApp()
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
      const _displayBalance = `${fixedDecimals(formattedBalance, 3)} ${tokenSymbol}`
      const network = findNetworkBySlug(networkIdToSlug(connectedNetworkId))
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

  const showBalance = !!displayBalance && !!connectedNetwork
  const ThemeModeIcon: any = isDarkMode ? SunIcon : MoonIcon

  return (
    <>
      {showBannerMessage && (
        <Banner>{showBannerMessage}</Banner>
      )}
      <Box className={styles.root} display="flex" flexDirection="row" alignItems="center">
        <Box display="flex" flexDirection="row" justifyContent="flex-start" flex={1}>
          <Link to="/" style={{ position: 'relative' }}>
            <img
              className={styles.hopLogo}
              src={isDarkMode ? HopLogoWhite : HopLogoBlack}
              alt="Hop"
            />
            {!isMainnet && <span className={styles.label}>{l1Network.name}</span>}
          </Link>
        </Box>

        <Box display="flex" flexDirection="row" justifyContent="center" alignSelf="center" flex={1} width="100%" flexWrap="wrap">
          <HeaderRoutes />
        </Box>

        <Box
          display="flex"
          flex={1}
          flexDirection="row"
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
            <Flex
              justifyCenter
              alignCenter
              borderRadius={'16px'}
              mx={1}
              p={'12px 20px'}
              boxShadow={
                isDarkMode && theme
                  ? theme.boxShadow.inner
                  : `rgba(255, 255, 255, 0.5) -3px -3px 6px inset, rgba(174, 174, 192, 0.16) 3px 3px 6px inset`
              }
              color="text.secondary"
              fontSize={['8px', '10px']}
              display={['none', 'flex']}
            >
              <div className={styles.balance}>
                <img className={styles.image} alt="" src={connectedNetwork?.imageUrl} />
                {displayBalance}
              </div>
            </Flex>
          )}

          <Flex alignCenter justifyCenter mx={1} fontSize={['8px', '10px']}>
            {address ? <TxPill /> : <ConnectWalletButton mode={theme?.palette.type} />}
          </Flex>
        </Box>
      </Box>
      <WalletWarning />
    </>
  )
}

export default Header
