import Box from '@mui/material/Box'
import HopLogoBlack from '#assets/logos/hop-logo-black.svg'
import HopLogoWhite from '#assets/logos/hop-logo-white.svg'
import IconButton from '@mui/material/IconButton'
import MoonIcon from '#assets/moon-icon.svg'
import Network from '#models/Network.js'
import React, { FC, useState, useEffect } from 'react'
import SunIcon from '#assets/sun-icon.svg'
import logger from '#logger/index.js'
import { Banner } from '#components/Banner/index.js'
import { ConnectWalletButton } from '#components/Header/ConnectWalletButton.js'
import { HeaderRoutes } from '#components/Header/HeaderRoutes.js'
import { Icon } from '#components/ui/Icon.js'
import { Link } from 'react-router-dom'
import { NetworkSelector } from '#components/NetworkSelector/NetworkSelector.js'
import { Settings } from '#components/Header/Settings.js'
import { TxPill } from '#components/Header/TxPill.js'
import { WalletWarning } from '#components/Header/WalletWarning.js'
import {
findNetworkBySlug,
fixedDecimals,
networkIdNativeTokenSymbol,
networkIdToSlug,
toTokenDisplay,
} from '#utils/index.js'
import { isMainnet, reactAppNetwork, showBannerMessage } from '#config/index.js'
import { makeStyles } from '@mui/styles'
import { useApp } from '#contexts/AppContext/index.js'
import { useQuery } from 'react-query'
import { useThemeMode } from '#theme/ThemeProvider.js'
import { useWeb3Context } from '#contexts/Web3Context.js'

const useStyles = makeStyles(theme => ({
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
    }
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
    bottom: '-1rem',
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
    borderRadius: '3rem',
    marginLeft: '1rem',
    padding: '1.2rem 2rem',
    boxShadow: ({ isDarkMode }: any) =>
      isDarkMode
        ? theme?.boxShadow?.inner
        : `rgba(255, 255, 255, 0.5) -3px -3px 6px inset, rgba(174, 174, 192, 0.16) 3px 3px 6px inset`,
    color: theme?.palette.text.secondary,
    [theme?.breakpoints.down('sm')]: {
      fontSize: '.8rem',
    },
    [theme?.breakpoints.down('xs')]: {
      display: 'none',
    },
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

export const Header: FC = () => {
  const { toggleMode, isDarkMode } = useThemeMode()
  const styles = useStyles({ isDarkMode })
  const { address, provider, connectedNetworkId, checkConnectedNetworkId, walletName } = useWeb3Context()
  const { theme } = useApp()
  const [displayBalance, setDisplayBalance] = useState<string>('')
  const [connectedNetwork, setConnectedNetwork] = useState<Network | undefined>()

  async function updateBalance() {
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
      logger.error('Header update balance error:', err)
      setDisplayBalance('')
    }
  }

  useEffect(() => {
    updateBalance().catch(logger.error)
  }, [address, provider, connectedNetworkId, walletName])

  useQuery(
    [
      `header:displayBalance:${address}:${connectedNetworkId}:${walletName}`,
      address,
      connectedNetworkId,
      walletName
    ],
    async () => {
      return updateBalance()
    },
    {
      enabled: !!address && !!connectedNetworkId && !!provider,
      refetchInterval: 60 * 1000
    }
  )

  const showBalance = !!displayBalance && !!connectedNetwork
  const ThemeModeIcon: any = isDarkMode ? SunIcon : MoonIcon
  const showNetworkSelector = false

  async function handleNetworkSelect (network: any) {
    try {
      if (network) {
        await checkConnectedNetworkId(network?.chainId)
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <>
      {showBannerMessage && (
        <Banner>{showBannerMessage}</Banner>
      )}
      <Box className={styles.root} display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start">
        <Box display="flex" flexDirection="row" flex={1}>
          <Link to="/" style={{ position: 'relative' }}>
            <img
              className={styles.hopLogo}
              src={isDarkMode ? HopLogoWhite : HopLogoBlack}
              alt="Hop"
            />
            {!isMainnet && <span className={styles.label}>{reactAppNetwork}</span>}
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
          <Box display="flex" alignItems="center" p={1} mx={2}>
            <IconButton onClick={toggleMode}>
              <Icon src={ThemeModeIcon} width={20} alt="Change theme" />
            </IconButton>
          </Box>

          <Settings />

          {showBalance && (
            <Box
              className={styles.balancePill}
              justifyContent="center"
              alignItems="center"
              borderRadius={'3rem'}
              mx={1}
              p={'1.2rem 2rem'}
              title={`Your Balance on ${connectedNetwork?.name}`}
              boxShadow={
                isDarkMode && theme
                  ? theme.boxShadow.inner
                  : `rgba(255, 255, 255, 0.5) -3px -3px 6px inset, rgba(174, 174, 192, 0.16) 3px 3px 6px inset`
              }
              color="text.secondary"
              fontSize={['.8rem', '1rem']}
            >
              <div className={styles.balance}>
                <img className={styles.image} alt="" src={connectedNetwork?.imageUrl} />
                {displayBalance}
              </div>
            </Box>
          )}

          {showNetworkSelector && !!address && (
            <NetworkSelector
              setNetwork={handleNetworkSelect}
              network={connectedNetwork}
            />
          )}

          <Box display="flex" alignItems="center" justifyContent="center" mx={1} fontSize={['.8rem', '1rem']}>
            {address ? <TxPill /> : <ConnectWalletButton mode={theme?.palette?.mode} />}
          </Box>
        </Box>
      </Box>
      <WalletWarning />
    </>
  )
}
