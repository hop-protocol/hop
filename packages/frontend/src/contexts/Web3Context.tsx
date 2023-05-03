import React, {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react'
import { ethers, BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import Address from 'src/models/Address'
import { goerli as goerliNetworks, mainnet as mainnetNetworks } from '@hop-protocol/core/networks'
import { networkIdToSlug, networkSlugToId, getRpcUrl, getBaseExplorerUrl, getRpcUrlOrThrow } from 'src/utils'
import { blocknativeDappid, reactAppNetwork, enabledChains } from 'src/config'
import { l1Network } from 'src/config/networks'
import './onboardStyles.css'
import logger from 'src/logger'
// import { WalletCheckInit, WalletSelectModuleOptions } from 'bnc-onboard/dist/src/interfaces'
// import mmLogo from 'src/assets/logos/metamask.png'
import { loadState, saveState } from 'src/utils/localStorage'
import { ChainId, ChainSlug } from '@hop-protocol/sdk'
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import walletConnectModule from '@web3-onboard/walletconnect'
import gnosisModule from '@web3-onboard/gnosis'

const injected = injectedModule()

// TODO: modularize
type Props = {
  onboard: any
  provider: ethers.providers.Web3Provider | undefined
  address: Address | undefined
  balance?: BigNumber
  connectedNetworkId: number | undefined
  validConnectedNetworkId: boolean
  requestWallet: () => void
  disconnectWallet: () => void
  walletConnected: boolean
  walletName: string
  checkConnectedNetworkId: (networkId: number) => Promise<boolean>
}

class NetworkSwitchError extends Error {}

// TODO: modularize
const networkNames: any = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  42161: 'Arbitrum',
  421613: 'Arbitrum (Goerli)',
  421611: 'Arbitrum (Rinkeby)',
  42170: 'Nova',
  10: 'Optimism',
  69: 'Optimism (Kovan)',
  420: 'Optimism (Goerli)',
  77: 'Gnosis (Testnet)',
  100: 'Gnosis',
  80001: 'Polygon (Mumbai)',
  137: 'Polygon',
  59140: 'Linea (Goerli)',
  84531: 'Base (Goerli)',
  534354: 'Scroll zkEVM (Goerli)'
}

const getWalletConnectRpcUrls = (): Record<string, string> => {
  if (reactAppNetwork === 'goerli') {
    return {
      5: getRpcUrl(ChainSlug.Ethereum),
      421613: getRpcUrl(ChainSlug.Arbitrum),
      420: getRpcUrl(ChainSlug.Optimism),
      80001: getRpcUrl(ChainSlug.Polygon),
      59140: getRpcUrl(ChainSlug.Linea),
      534354: getRpcUrl(ChainSlug.ScrollZk),
      84531: getRpcUrl(ChainSlug.Base)
    }
  } else {
    return {
      1: getRpcUrl(ChainSlug.Ethereum),
      // 42: getRpcUrl(ChainSlug.Ethereum), // kovan
      42161: getRpcUrl(ChainSlug.Arbitrum),
      // 421611: getRpcUrl(ChainSlug.Arbitrum), // arbitrum rinkeby
      42170: getRpcUrl(ChainSlug.Nova),
      // 200: getRpcUrl(ChainSlug.Arbitrum), // arbitrum on xdai
      10: getRpcUrl(ChainSlug.Optimism),
      // 69: getRpcUrl(ChainSlug.Optimism), // optimism kovan
      100: getRpcUrl(ChainSlug.Gnosis),
      137: getRpcUrl(ChainSlug.Polygon),
    }
  }
}

const wcV2InitOptions: any = {
  version: 2,
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: 'abc123...'
}

const walletConnect = walletConnectModule(wcV2InitOptions)
const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: false })
const gnosis = gnosisModule()

const Web3Context = createContext<Props | undefined>(undefined)

/*
// TODO: modularize
const walletSelectOptions = (networkId: number): WalletSelectModuleOptions => {
  return {
    heading: 'Connect Wallet',
    description: '',
    // agreement: {
    //   version: '0.0.1'
    //   termsUrl: '', // optional
    //   privacyUrl: '', // optional
    // },
    wallets: [
      // preferred: shown at the top of the selection screen
      // label: override name
      // svg: string that overrides the icon
      // iconSrc: alternative to svg string (url source)
      // display: { desktop: true, mobile: true }
      { walletName: 'metamask', preferred: true, iconSrc: mmLogo },
      {
        walletName: 'walletConnect',
        label: 'Wallet Connect',
        preferred: true,
        rpc: getWalletConnectRpcUrls(),
      },
      {
        walletName: 'gnosis',
        preferred: true,
      },
      {
        walletName: 'walletLink',
        preferred: true,
        rpcUrl: getRpcUrl(ChainSlug.Ethereum),
        appName: 'Hop',
      },
      {
        walletName: 'coinbase',
        preferred: true,
        rpcUrl: getRpcUrl(ChainSlug.Ethereum),
        appName: 'Hop',
      },
    ],
  }
}
*/

function getOnboardChains(): any {
  if (reactAppNetwork === 'goerli') {
    return [
      {
        id: '0x5',
        token: 'ETH',
        label: 'Ethereum Goerli',
        rpcUrl: (goerliNetworks as any).ethereum.publicRpcUrl
      },
      {
        id: '0x66eed',
        token: 'ETH',
        label: 'Arbitrum Goerli',
        rpcUrl: (goerliNetworks as any).arbitrum.publicRpcUrl
      },
      {
        id: '0x1a4',
        token: 'ETH',
        label: 'Optimism Goerli',
        rpcUrl: (goerliNetworks as any).optimism.publicRpcUrl
      },
      {
        id: '0x13881',
        token: 'MATIC',
        label: 'Polygon Mumbai',
        rpcUrl: (goerliNetworks as any).polygon.publicRpcUrl
      },
      {
        id: '0x118',
        token: 'ETH',
        label: 'zkSync Goerli',
        rpcUrl: (goerliNetworks as any).zksync.publicRpcUrl
      },
      {
        id: '0xe704',
        token: 'ETH',
        label: 'Linea Goerli',
        rpcUrl: (goerliNetworks as any).linea.publicRpcUrl
      },
      {
        id: '0x82752',
        token: 'ETH',
        label: 'Scroll zkEVM',
        rpcUrl: (goerliNetworks as any).scrollzk.publicRpcUrl
      }
    ]
  } else {
    return [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl: (mainnetNetworks as any).ethereum.publicRpcUrl
      },
      {
        id: '0xa4b1',
        token: 'ETH',
        label: 'Arbitrum One',
        rpcUrl: (mainnetNetworks as any).arbitrum.publicRpcUrl
      },
      {
        id: '0xa',
        token: 'ETH',
        label: 'Optimism Mainnet',
        rpcUrl: (mainnetNetworks as any).optimism.publicRpcUrl
      },
      {
        id: '0x64',
        token: 'XDAI',
        label: 'Gnosis Chain',
        rpcUrl: (mainnetNetworks as any).gnosis.publicRpcUrl
      },
      {
        id: '0x89',
        token: 'MATIC',
        label: 'Polygon Mainnet',
        rpcUrl: (mainnetNetworks as any).polygon.publicRpcUrl
      },
      {
        id: '0xa4ba',
        token: 'ETH',
        label: 'Nova Mainnet',
        rpcUrl: (mainnetNetworks as any).nova.publicRpcUrl
      }
    ]
  }
}

const Web3ContextProvider: FC = ({ children }) => {
  // logger.debug('Web3ContextProvider render')
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>()
  const [connectedNetworkId, setConnectedNetworkId] = useState<number|undefined>()
  const [validConnectedNetworkId] = useState<boolean>(false)
  const [walletName, setWalletName] = useState<string>('')
  const [address, setAddress] = useState<Address | undefined>()
  const [balance, setBalance] = useState<BigNumber>()
  const [onboardNetworkId] = useState<number>(() => {
    try {
      const parsedHash = new URLSearchParams(
        window.location.hash.substring(1)
      )

      const slug = parsedHash.get("sourceNetwork")
      if (slug) {
        const networkId = networkSlugToId(slug)
        if (networkId) {
          return networkId
        }
      }
    } catch (err) {
      console.error(err)
    }
    return l1Network.networkId
  })
  // const { isDarkMode } = useThemeMode()

  const cacheKey = 'selectedWallet'

  const onboard = useMemo(() => {
    const instance = Onboard({
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
      wallets: [injected, walletConnect, gnosis, coinbaseWalletSdk],
      chains: getOnboardChains(),
      appMetadata: {
        name: 'Hop',
        icon: 'https://assets.hop.exchange/logos/hop.svg',
        description: 'Hop Protocol',
      },
      apiKey: blocknativeDappid,
      disableFontDownload: true,
      connect: {
        showSidebar: false,
        disableClose: false,
        autoConnectLastWallet: true,
        autoConnectAllPreviousWallet: false,
      },
      /*
      dappId: blocknativeDappid,
      networkId: onboardNetworkId,
      // darkMode: isDarkMode,
      // blockPollingInterval: 4000,
      hideBranding: true,
      */
    })

    return instance
  }, [setProvider, setConnectedNetworkId, onboardNetworkId])

  useEffect(() => {
    const state = onboard.state.select()
    const { unsubscribe } = state.subscribe((update) => {
      console.log('state update: ', update)
      const [wallet]  = update.wallets
      handleWalletChange(wallet)
    })
    return () => {
      unsubscribe()
    }
  }, [onboard])

  async function handleWalletChange(wallet: any) {
    try {
      logger.debug(wallet)

      const address = wallet?.accounts?.[0]?.address
      if (address) {
        setAddress(Address.from(address))
      } else {
        setAddress(undefined)
      }

      const bal = wallet?.accounts?.[0]?.balance?.[getOnboardChains().find((x: any) => x.id === wallet?.chains?.[0]?.id)?.token]
      console.log(bal)
      if (bal) {
        setBalance(parseEther(bal))
      } else {
        setBalance(BigNumber.from(0))
      }

      const connectedNetworkId = Number(wallet?.chains?.[0]?.id)
      if (connectedNetworkId) {
        setConnectedNetworkId(connectedNetworkId)
      } else {
        setConnectedNetworkId(undefined)
      }

      if (wallet?.provider) {
        const { name, provider } = wallet
        saveState(cacheKey, name)
        const ethersProvider = new ethers.providers.Web3Provider(provider, 'any')
        if (provider.enable && !provider.isMetaMask) {
          // needed for WalletConnect and some wallets
          await provider.enable()
        } else {
          // note: this method may not be supported by all wallets
          try {
            await ethersProvider.send('eth_requestAccounts', [])
          } catch (error) {
            console.error(error)
          }
        }
        setProvider(ethersProvider)
        setWalletName(name)
      } else {
        setWalletName('')
        setProvider(undefined)
        setAddress(undefined)
      }
    } catch (err) {
      logger.error(err)
      setProvider(undefined)
      setAddress(undefined)
    }
  }

  useEffect(() => {
    const update = async () => {
      try {
        if (onboard) {
          const cachedWallet = loadState(cacheKey)
          if (cachedWallet != null) {
            await onboard.connectWallet(cachedWallet)
          }
        }
      } catch (err: any) {
        console.error(err)
      }
    }
    update()
  }, [onboard])

  // TODO: cleanup
  const requestWallet = () => {
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

    update()
  }

  // TODO: cleanup
  const disconnectWallet = () => {
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

    update()
  }

  // TODO: cleanup
  const walletConnected = !!address

  // TODO: cleanup
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

      let rpcUrl = getRpcUrlOrThrow(networkIdToSlug(networkId.toString()))
      const lineaChainId = 59140
      if (Number(networkId) === lineaChainId) {
        rpcUrl = 'https://rpc.goerli.linea.build'
      }

      const state = onboard.state.get()
      logger.debug('state', state)
      const _address = state.wallets?.[0].accounts?.[0]?.address
      if (_address) {
        onboard.setChain({ chainId: networkId })
        const wantNetworkName = networkNames[networkId] || 'local'
        const isL1 = ['Mainnet', 'Ropsten', 'Rinkeby', 'Goerli', 'Kovan'].includes(
          wantNetworkName
        )

        if (isL1) {
          await provider?.send('wallet_switchEthereumChain', [
            {
              chainId: `0x${Number(networkId).toString(16)}`,
            },
          ])
        } else {
          let nativeCurrency: any = {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          }

          if (networkId === ChainId.Gnosis) {
            nativeCurrency = {
              name: 'xDAI',
              symbol: 'XDAI',
              decimals: 18,
            }
          } else if (networkId === ChainId.Polygon) {
            nativeCurrency = {
              name: 'Matic',
              symbol: 'MATIC',
              decimals: 18,
            }
          }

          const rpcObj = {
            chainId: `0x${Number(networkId).toString(16)}`,
            chainName: networkNames[networkId],
            rpcUrls: [rpcUrl],
            blockExplorerUrls: [getBaseExplorerUrl(networkIdToSlug(networkId.toString()))],
            nativeCurrency,
          }

          await provider?.send('wallet_addEthereumChain', [rpcObj])
        }
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

  return (
    <Web3Context.Provider
      value={{
        onboard,
        provider,
        address,
        balance,
        walletConnected,
        connectedNetworkId,
        validConnectedNetworkId,
        requestWallet,
        disconnectWallet,
        walletName,
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
