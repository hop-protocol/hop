import React, {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react'
import Onboard from 'bnc-onboard'
import { ethers, BigNumber } from 'ethers'
import Address from 'src/models/Address'
import { networkIdToSlug, networkSlugToId, getRpcUrl, getBaseExplorerUrl, getRpcUrlOrThrow } from 'src/utils'
import { blocknativeDappid, reactAppNetwork, enabledChains } from 'src/config'
import { l1Network } from 'src/config/networks'
import './onboardStyles.css'
import logger from 'src/logger'
import { WalletCheckInit, WalletSelectModuleOptions } from 'bnc-onboard/dist/src/interfaces'
import mmLogo from 'src/assets/logos/metamask.png'
import { loadState, saveState } from 'src/utils/localStorage'
import { ChainId, ChainSlug } from '@hop-protocol/sdk'

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

// TODO: modularize
const networkNames: any = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  42161: 'Arbitrum',
  421611: 'Arbitrum',
  42170: 'Nova',
  10: 'Optimism',
  69: 'Optimism',
  420: 'Optimism',
  77: 'Gnosis',
  100: 'Gnosis',
  80001: 'Polygon',
  137: 'Polygon',
}

const getWalletConnectRpcUrls = (): Record<string, string> => {
  if (reactAppNetwork === 'goerli') {
    return {
      5: getRpcUrl(ChainSlug.Ethereum),
      421613: getRpcUrl(ChainSlug.Arbitrum),
      420: getRpcUrl(ChainSlug.Optimism),
      80001: getRpcUrl(ChainSlug.Polygon),
      59140: getRpcUrl(ChainSlug.ConsenSysZk),
      534354: getRpcUrl(ChainSlug.ScrollZk)
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

const Web3Context = createContext<Props | undefined>(undefined)

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

// TODO: modularize
const walletChecks: WalletCheckInit[] = [
  { checkName: 'derivationPath' },
  { checkName: 'accounts' },
  { checkName: 'connect' },
  { checkName: 'network' },
  { checkName: 'balance' },
]

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

  // walletSelect()
  // Displays the wallet select modal:
  // const walletSelected = await onboard.walletSelect()
  // returns a Promise that:
  // resolves with true if the user selected a wallet
  // resolves with false if the user exited from the wallet select modal

  // walletCheck()
  // Once a wallet is selected, you will want to make sure that the user's wallet is prepared and ready to transact by calling the walletCheck function:
  // const readyToTransact = await onboard.walletCheck()
  // returns a Promise that:
  // resolves with true if user is ready to transact
  // resolves with false if user exited before completing all wallet checks

  // walletReset()
  // You may want to reset all of Onboard's internal wallet state and also disconnect from any active SDK instances when a user logs out of your app. You can call the walletReset function to do this easily.
  // user wants to log out of session and the wallet state needs to be reset...
  // onboard.walletReset()
  // this method is synchronous and returns undefined

  // getState()
  // This function will give you the current state of the user:
  // const currentState = onboard.getState()
  // console.log(currentState)
  // {
  //    address: string
  //    network: number
  //    balance: string
  //    wallet: Wallet
  //    mobileDevice: boolean
  //    appNetworkId: number
  // }

  // You can update some configuration parameters by passing a config object in to the config function:
  // onboard.config({ darkMode: true, networkId: 4 })

  const cacheKey = 'selectedWallet'
  const onboard = useMemo(() => {
    const instance = Onboard({
      dappId: blocknativeDappid,
      networkId: onboardNetworkId,
      // darkMode: isDarkMode,
      // blockPollingInterval: 4000,
      hideBranding: true,
      // Callback functions that get called whenever the corresponding value changes
      subscriptions: {
        address: (address: string) => {
          logger.debug('wallet address:', address)
          if (address) {
            setAddress(Address.from(address))
          }
        },
        // ens: (ens: any) => {
        //   const { name, avatar, getText, contentHash } = ens
        //   console.log(`ens:`, ens)
        // },
        network: (connectedNetworkId: number) => {
          if (connectedNetworkId) {
            setConnectedNetworkId(connectedNetworkId)
          } else {
            setConnectedNetworkId(undefined)
          }
        },
        balance: bal => {
          if (bal) {
            setBalance(BigNumber.from(bal))
          }
        },
        wallet: async (wallet: any) => {
          try {
            const { provider, name, instance, type, connect, dashboard, icons } = wallet
            // provider - The JavaScript provider for interacting with the wallet
            // name - The wallet display name
            // instance - If the wallet type is 'sdk' then this is the initialized wallet instance
            // type - The wallet type 'hardware' | 'injected' | 'sdk'
            // connect - The function that initiates the wallet connection logic
            // dashboard - Some SDK wallets allow for opening to wallet dashboard
            // icons - [object] Image strings for the wallet icon { svg, src, srcset }

            logger.debug('wallet name:', wallet.name)
            if (provider) {
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
        },
      },
      // Defines how the wallet select screen will render
      walletSelect: walletSelectOptions(onboardNetworkId),
      // Used to check if the user is ready to transact
      walletCheck: walletChecks,
    })

    return instance
  }, [setProvider, setConnectedNetworkId, onboardNetworkId])

  useEffect(() => {
    if (onboard) {
      const cachedWallet = loadState(cacheKey)
      if (cachedWallet != null) {
        onboard.walletSelect(cachedWallet)
      }
    }
  }, [onboard])

  // TODO: cleanup
  const requestWallet = () => {
    const _requestWallet = async () => {
      try {
        localStorage.clear()
        await onboard.walletReset()
        await onboard.walletSelect()
      } catch (err) {
        logger.error(err)
      }
    }

    _requestWallet()
  }

  // TODO: cleanup
  const disconnectWallet = () => {
    try {
      localStorage.clear()
      onboard.walletReset()
    } catch (error) {
      logger.error(error)
    }
  }

  // TODO: cleanup
  const walletConnected = !!address

  // TODO: cleanup
  const checkConnectedNetworkId = async (networkId?: number, recheck: boolean = true): Promise<boolean> => {
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

      const state = onboard.getState()
      if (state.address) {
        onboard.config({ networkId })
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
          let nativeCurrency: any

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
            rpcUrls: [getRpcUrlOrThrow(networkIdToSlug(networkId.toString()))],
            blockExplorerUrls: [getBaseExplorerUrl(networkIdToSlug(networkId.toString()))],
            nativeCurrency,
          }

          await provider?.send('wallet_addEthereumChain', [rpcObj])
        }
      }
    } catch (err) {
      logger.error('checkConnectedNetworkId error:', err)
    }

    // after network switch, recheck if provider is connected to correct network.
    const net = await provider.getNetwork()
    if (net.chainId === networkId) {
      return true
    }

    await onboard.walletCheck()
    if (recheck) {
      return checkConnectedNetworkId(networkId, false)
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
