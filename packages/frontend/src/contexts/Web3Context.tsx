import Address from 'src/models/Address'
import Onboard from '@web3-onboard/core'
import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import logger from 'src/logger'
import walletConnectModule from '@web3-onboard/walletconnect'
import { blocknativeDappid, isGoerli, isMainnet, reactAppNetwork } from 'src/config'
import { capitalize } from 'src/utils/capitalize'
import { chainIdToHex } from 'src/utils/chainIdToHex'
import { chains as chainMetadata } from '@hop-protocol/core/metadata/chains'
import { ethers } from 'ethers'
import { l1Network } from 'src/config/networks'
import { networkSlugToId } from 'src/utils'
import { networks } from '@hop-protocol/core/networks'
import { useThemeMode } from 'src/theme/ThemeProvider'

export type Props = {
  onboard: any
  provider: ethers.providers.Web3Provider | undefined
  address: Address | undefined
  connectedNetworkId: number | undefined
  requestWallet: () => void
  disconnectWallet: () => void
  walletConnected: boolean
  walletName: string
  walletIcon: string
  checkConnectedNetworkId: (networkId: number) => Promise<boolean>
}

class NetworkSwitchError extends Error {}

function getOnboardChains(): any {
  const chains = (networks as any)[reactAppNetwork]
  const onboardChains :any[] = []

  for (const chainSlug in chains) {
    const chainObj = chains[chainSlug]
    const id = chainIdToHex(chainObj.networkId)
    const token = chainMetadata?.[chainSlug]?.nativeTokenSymbol
    const label = `${chainObj.name} ${capitalize(reactAppNetwork)}`
    let rpcUrl = chainObj.publicRpcUrl

    // overrides
    if (chainSlug === 'linea') {
      if (isGoerli) {
        rpcUrl = 'https://rpc.goerli.linea.build'
      }
      if (isMainnet) {
        rpcUrl = 'https://rpc.linea.build'
      }
    }

    onboardChains.push({
        id,
        token,
        label,
        rpcUrl
    })
  }

  return onboardChains
}

const injected = injectedModule()
const coinbaseWallet = coinbaseWalletModule({ darkMode: false })

// https://github.com/blocknative/web3-onboard/pull/1834
const gnosis = gnosisModule({
  whitelistedDomains: [
    /^https:\/\/gnosis-safe\.io$/,
    /^https:\/\/app\.safe\.global$/,
    /^https:\/\/safe\.global$/,
    /^https:\/\/wallet\.ambire\.com$/
  ]
})
const walletConnect = walletConnectModule({
  version: 2, // NOTE: version v1 will be sunset but MetaMask currently only supports v1
  projectId: '651b16cdb6b0f490f68e0c4c5f5c35ce',
  optionalChains: getOnboardChains().map((chain: any) => Number(chain.id)) as number[]
})

const Web3Context = createContext<Props | undefined>(undefined)

const Web3ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // logger.debug('Web3ContextProvider render')
  const { isDarkMode } = useThemeMode()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>()
  const [connectedNetworkId, setConnectedNetworkId] = useState<number|undefined>()
  const [walletName, setWalletName] = useState<string>('')
  const [walletIcon, setWalletIcon] = useState<string>('')
  const [address, setAddress] = useState<Address | undefined>()
  const [onboardNetworkId] = useState<number>(() => {
    try {
      const parsedHash = new URLSearchParams(
        window.location.hash.substring(1)
      )

      const slug = parsedHash.get('sourceNetwork')
      if (slug) {
        const networkId = networkSlugToId(slug)
        if (networkId) {
          return networkId
        }
      }
    } catch (err) {
      logger.error(err)
    }
    return l1Network.networkId
  })

  const customTheme = {
    '--w3o-background-color': isDarkMode ? '#272332' : '#fdf7f9',
    '--w3o-foreground-color': isDarkMode ? '#1f1e23' : '#ffffff',
    '--w3o-text-color': isDarkMode ? '#e3ddf1' : '#4a4a4a',
    '--w3o-border-color': 'transparent',
    '--w3o-border-radius': '2px'
  }

  const onboard = useMemo(() => {
    const instance = Onboard({
      theme: customTheme,
      appMetadata: {
        name: 'Hop',
        icon: 'https://assets.hop.exchange/logos/hop.svg',
        description: 'Hop Protocol',
      },
      apiKey: blocknativeDappid,
      wallets: [injected, walletConnect, gnosis, coinbaseWallet],
      chains: getOnboardChains(),
      disableFontDownload: true,
      connect: {
        showSidebar: false,
        disableClose: false,
        autoConnectLastWallet: true,
        autoConnectAllPreviousWallet: false,
      },
      accountCenter: {
        desktop: {
          enabled: false,
        },
        mobile: {
          enabled: false,
        }
      },
      notify: {
        enabled: false
      },
    })

    return instance
  }, [onboardNetworkId, isDarkMode])

  async function handleWalletChange(wallet: any) {
    try {
      logger.debug('handleWalletChange')
      // logger.debug('handleWalletChange wallet', wallet)

      const _address = wallet?.accounts?.[0]?.address
      if (_address) {
        setAddress(Address.from(_address))
      } else {
        setAddress(undefined)
      }

      const connectedNetworkId = Number(wallet?.chains?.[0]?.id)
      if (connectedNetworkId) {
        setConnectedNetworkId(connectedNetworkId)
      } else {
        setConnectedNetworkId(undefined)
      }

      if (wallet?.provider) {
        const { icon, label, provider } = wallet
        const ethersProvider = new ethers.providers.Web3Provider(provider, 'any')
        if (provider.enable && !provider.isMetaMask) {
          // needed for WalletConnect and some wallets
          await provider.enable()
        } else {
          // note: this method may not be supported by all wallets
          try {
            await ethersProvider.send('eth_requestAccounts', [])
          } catch (error) {
            logger.error(error)
          }
        }
        setProvider(ethersProvider)
        setWalletName(label)

        try {
          const svg = new Blob([icon], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(svg)
          setWalletIcon(url)
        } catch (err: any) {
          setWalletIcon('')
        }
      } else {
        setWalletName('')
        setWalletIcon('')
        setProvider(undefined)
        setAddress(undefined)
      }
    } catch (err) {
      logger.error(err)
      setProvider(undefined)
      setAddress(undefined)
    }
  }

  function requestWallet() {
    const update = async () => {
      try {
        localStorage.clear()
        const [primaryWallet] = onboard.state.get().wallets
        if (primaryWallet) {
          await onboard.disconnectWallet({ label: primaryWallet.label })
        }
        await onboard.connectWallet()
      } catch (err) {
        logger.error(err)
      }
    }

    update().catch(logger.error)
  }

  function disconnectWallet() {
    const update = async () => {
      try {
        localStorage.clear()
        const [primaryWallet] = onboard.state.get().wallets
        if (primaryWallet) {
          await onboard.disconnectWallet({ label: primaryWallet.label })
        }
      } catch (error) {
        logger.error(error)
      }
    }

    update().catch(logger.error)
  }

  useEffect(() => {
    const state = onboard.state.select('wallets')
    let lastUpdate = ''
    const { unsubscribe } = state.subscribe((update) => {
      let shouldUpdate = true
      const _walletName = update?.[0]?.label
      if (_walletName === 'WalletConnect') {
        const str = JSON.stringify({ account: update?.[0]?.accounts, chains: update?.[0]?.chains })
        shouldUpdate = lastUpdate !== str
        if (shouldUpdate) {
          lastUpdate = str
        }
      }
      if (shouldUpdate) {
        // logger.debug('onboard state update: ', update)
        const [wallet] = update
        handleWalletChange(wallet)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [onboard])

  const checkConnectedNetworkId = async (networkId?: number): Promise<boolean> => {
    if (!(networkId && provider)) return false

    const signerNetworkId = (await provider.getNetwork())?.chainId
    logger.debug('checkConnectedNetworkId', networkId, signerNetworkId)

    try {
      // NOTE: some mobile wallets don't support wallet_switchEthereumChain or wallet_addEthereumChain.
      // NOTE: Trust Wallet hangs indefinteily on wallet_switchEthereumChain, see issues on discord.
      // Therefore if provider is already connected to correct network,
      // then there's no need to attempt to call network switcher.
      if (signerNetworkId === networkId) {
        return true
      }

      const wallets = onboard.state.get().wallets
      logger.debug('onboard wallets', wallets)
      const _address = wallets?.[0].accounts?.[0]?.address
      if (_address) {
        await onboard.setChain({ chainId: networkId })
      }
    } catch (err: any) {
      logger.error('checkConnectedNetworkId error:', err)
      if (err instanceof NetworkSwitchError) {
        throw err
      }
    }

    // after network switch, recheck if provider is connected to correct network.
    const net = await provider.getNetwork()
    if (net.chainId === networkId) {
      return true
    }

    return false
  }

  const walletConnected = !!address

  return (
    <Web3Context.Provider
      value={{
        onboard,
        provider,
        address,
        walletConnected,
        connectedNetworkId,
        requestWallet,
        disconnectWallet,
        walletName,
        walletIcon,
        checkConnectedNetworkId,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3Context() {
  const ctx = useContext(Web3Context)
  if (ctx === undefined) {
    throw new Error('useApp must be used within Web3Provider')
  }
  return ctx
}

export default Web3ContextProvider
