import React, { FC, createContext, useContext, useMemo, useState, useEffect } from 'react'
import Onboard from 'bnc-onboard'
import { ethers, Contract, BigNumber } from 'ethers'
import Address from 'src/models/Address'
import { networkIdToSlug, getRpcUrl, getBaseExplorerUrl } from 'src/utils'
import { Chain, L1_NETWORK } from 'src/utils/constants'
import { networks, blocknativeDappid } from 'src/config'
import './onboardStyles.css'

import MetamaskAccountsSettingsHighlight from 'src/assets/onboard/metamask-accounts-settings-highlight.png'
import MetamaskSettingsHighlight from 'src/assets/onboard/metamask-settings-highlight.png'
import MetamaskAddNetworkHighlight from 'src/assets/onboard/metamask-add-network-highlight.png'
import MetamaskNewCustomNetworkHighlight from 'src/assets/onboard/metamask-new-custom-network-highlight.png'
import MetamaskCustomNetworkHighlight from 'src/assets/onboard/metamask-custom-network-highlight.png'
import logger from 'src/logger'
import { WalletCheckInit, WalletSelectModuleOptions } from 'bnc-onboard/dist/src/interfaces'
import mmLogo from 'src/assets/logos/metamask.png'
import { loadState, saveState } from 'src/utils/localStorage'

// TODO: modularize
type Props = {
  onboard: any
  provider: ethers.providers.Web3Provider | undefined
  address: Address | undefined
  balance?: BigNumber
  connectedNetworkId: string
  validConnectedNetworkId: boolean
  requestWallet: () => void
  disconnectWallet: () => void
  walletConnected: boolean
  walletName: string
  checkConnectedNetworkId: (networkId: number) => Promise<boolean>
  getWriteContract: (contract: Contract | undefined) => Promise<Contract | undefined>
}

// TODO: modularize
const initialState = {
  onboard: undefined,
  provider: undefined,
  address: undefined,
  connectedNetworkId: '',
  validConnectedNetworkId: false,
  setRequiredNetworkId: (networkId: string) => {},
  requestWallet: () => {},
  disconnectWallet: () => {},
  walletConnected: false,
  walletName: '',
  checkConnectedNetworkId: async (networkId: number): Promise<boolean> => false,
  getWriteContract: async (contract: Contract | undefined): Promise<Contract | undefined> =>
    undefined,
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
  10: 'Optimism',
  69: 'Optimism',
  420: 'Optimism',
  77: 'Gnosis',
  100: 'Gnosis',
  80001: 'Polygon',
  137: 'Polygon',
}

const Web3Context = createContext<Props>(initialState)

// TODO: modularize
const walletSelectOptions: WalletSelectModuleOptions = {
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
      rpc: {
        1: getRpcUrl(Chain.Ethereum),
        42: getRpcUrl(Chain.Ethereum),
        42161: getRpcUrl(Chain.Arbitrum),
        421611: getRpcUrl(Chain.Arbitrum),
        200: getRpcUrl(Chain.Arbitrum),
        10: getRpcUrl(Chain.Optimism),
        69: getRpcUrl(Chain.Optimism),
        420: getRpcUrl(Chain.Optimism),
        100: getRpcUrl(Chain.Gnosis),
        137: getRpcUrl(Chain.Polygon),
        80001: getRpcUrl(Chain.Polygon),
      },
    },
    { walletName: 'walletLink', preferred: true, rpcUrl: getRpcUrl(L1_NETWORK), appName: 'Hop' },
  ],
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
  const [connectedNetworkId, setConnectedNetworkId] = useState<string>('')
  const [validConnectedNetworkId] = useState<boolean>(false)
  const [walletName, setWalletName] = useState<string>('')
  const [address, setAddress] = useState<Address | undefined>()
  const [balance, setBalance] = useState<BigNumber>()
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
      networkId: Number(networks[L1_NETWORK].networkId),
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
            setConnectedNetworkId(connectedNetworkId.toString())
          } else {
            setConnectedNetworkId('')
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
                await ethersProvider.send('eth_requestAccounts', [])
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
      walletSelect: walletSelectOptions,
      // Used to check if the user is ready to transact
      walletCheck: walletChecks,
    })

    return instance
  }, [setProvider, setConnectedNetworkId])

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
  const checkConnectedNetworkId = async (networkId: number): Promise<boolean> => {
    const signerNetworkId = (await provider?.getNetwork())?.chainId
    logger.debug('checkConnectedNetworkId', networkId, signerNetworkId)
    if (networkId.toString() !== signerNetworkId?.toString()) {
      onboard.config({ networkId })
      if (onboard.getState().address) {
        let nativeCurrency: any
        if (networkIdToSlug(networkId) === 'gnosis') {
          nativeCurrency = {
            name: 'xDAI',
            symbol: 'XDAI',
            decimals: 18,
          }
        } else if (networkIdToSlug(networkId) === 'polygon') {
          nativeCurrency = {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18,
          }
        }

        try {
          if (provider && networkId) {
            const wantNetworkName = networkNames[networkId] || 'local'
            const isL1 = ['Mainnet', 'Ropsten', 'Rinkeby', 'Goerli', 'Kovan'].includes(
              wantNetworkName
            )
            const rpcObj = {
              chainId: `0x${Number(networkId).toString(16)}`,
              chainName: networkNames[networkId.toString()],
              rpcUrls: [getRpcUrl(networkIdToSlug(networkId.toString()))],
              blockExplorerUrls: [getBaseExplorerUrl(networkIdToSlug(networkId.toString()))],
              nativeCurrency,
            }
            if (isL1) {
              await provider?.send('wallet_switchEthereumChain', [
                {
                  chainId: `0x${Number(networkId).toString(16)}`,
                },
              ])
            } else {
              await provider?.send('wallet_addEthereumChain', [rpcObj])
            }
          }

          return true
        } catch (err) {
          logger.error(err)
        }

        await onboard.walletCheck()
      }
      return false
    }

    return true
  }

  // TODO: cleanup
  const getWriteContract = async (contract?: Contract): Promise<Contract | undefined> => {
    if (!contract) return
    const signerNetworkId = (await provider?.getNetwork())?.chainId
    const contractNetworkId = (await contract.provider.getNetwork()).chainId
    if (signerNetworkId?.toString() !== contractNetworkId.toString()) {
      onboard.config({ networkId: Number(contractNetworkId) })
      if (onboard.getState().address) {
        await onboard.walletCheck()
      }

      return
    }

    if (!provider) {
      throw new Error('Provider is undefined')
    }

    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Provider has no signer')
    }

    return contract.connect(signer)
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
        getWriteContract,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

// TODO: cleanup
export const useWeb3Context: () => Props = () => useContext(Web3Context)

export default Web3ContextProvider
