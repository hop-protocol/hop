import Address from 'src/models/Address'
import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo
} from 'react'
import MetaMaskLogo from 'src/assets/logos/metamask.svg'
import WalletConnectLogo from 'src/assets/logos/walletconnect.svg'
import GnosisSafeLogo from 'src/assets/logos/gnosissafe.svg'
import CoinbaseWalletLogo from 'src/assets/logos/coinbasewallet.svg'
import logger from 'src/logger'
import { providers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { NetworkSlug, getChains } from '@hop-protocol/sdk'
import { isGoerli, isMainnet, reactAppNetwork, walletConnectProjectId } from 'src/config'
import { capitalize } from 'src/utils/capitalize'
import { Web3ReactHooks, initializeConnector } from '@web3-react/core'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { MetaMask } from '@web3-react/metamask'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import type { Connector } from '@web3-react/types'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask'
  if (connector instanceof WalletConnectV2) return 'WalletConnect V2'
  if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet'
  if (connector instanceof GnosisSafe) return 'Gnosis Safe'
  return 'Unknown'
}

function getIcon(connector: Connector) {
  if (connector instanceof MetaMask) return MetaMaskLogo
  if (connector instanceof WalletConnectV2) return WalletConnectLogo
  if (connector instanceof CoinbaseWallet) return CoinbaseWalletLogo
  if (connector instanceof GnosisSafe) return GnosisSafeLogo
  return ''
}

function getWeb3Chains(): any[] {
  const chains = getChains(reactAppNetwork as NetworkSlug)
  const items:any[] = []

  for (const chain of chains) {
    const id = Number(chain.chainId)
    const token = chain.nativeTokenSymbol
    let label = `${chain.name}`
    if (!isMainnet) {
      label = `${label} ${capitalize(reactAppNetwork)}`
    }
    const explorerUrls = chain.explorerUrls
    let rpcUrl = chain.publicRpcUrl
    const isEthereum = chain.slug === 'ethereum'

    // overrides
    if (chain.slug === 'linea') {
      if (isGoerli) {
        rpcUrl = 'https://rpc.goerli.linea.build'
      }
      if (isMainnet) {
        rpcUrl = 'https://rpc.linea.build'
      }
    }

    items.push({
        id,
        isEthereum,
        token,
        label,
        rpcUrl,
        explorerUrls
    })
  }

  return items
}

const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }))
const [gnosisSafe, gnosisSafeHooks] = initializeConnector<GnosisSafe>((actions) => new GnosisSafe({
  actions,
  options: {
    allowedDomains: [
      /^https:\/\/gnosis-safe\.io$/,
      /^https:\/\/app\.safe\.global$/,
      /^https:\/\/safe\.global$/,
      /^https:\/\/wallet\.ambire\.com$/
    ]
  }
}))

const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: getWeb3Chains().filter((chain: any) => chain.isEthereum).map((chain: any) => chain.rpcUrl)[0],
        appName: 'Hop Protocol',
      },
    })
)

const [walletConnectV2, walletConnectV2Hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: walletConnectProjectId,
        chains: getWeb3Chains().filter((chain: any) => chain.isEthereum).map((chain: any) => chain.id),
        optionalChains: getWeb3Chains().filter((chain: any) => !chain.isEthereum).map((chain: any) => chain.id),
        showQrModal: true,
      },
    })
)

export const connectors: [MetaMask | WalletConnectV2 | CoinbaseWallet | GnosisSafe, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [gnosisSafe, gnosisSafeHooks]
]

const connectorChoices = {
  metamask: metaMask,
  walletconnect: walletConnectV2,
  coinbasewallet: coinbaseWallet,
  gnosissafe: gnosisSafe
}

type WalletOption = {
  id: string
  name: string
  icon: string
}

export type Props = {
  provider: providers.Web3Provider | undefined
  address: Address | undefined
  connectedNetworkId: number | undefined
  requestWallet: () => void
  disconnectWallet: () => void
  walletConnected: boolean
  walletName: string
  walletIcon: string
  checkConnectedNetworkId: (networkId: number) => Promise<boolean>
  web3ModalActive: boolean
  setWeb3ModalActive: (active: boolean) => void
  setWeb3ModalChoice: (choice: string) => void
  error: string
  walletOptions: WalletOption[]
}

const Web3Context = createContext<Props | undefined>(undefined)

const Web3ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // logger.debug('Web3ContextProvider render')
  const [provider, setProvider] = useState<providers.Web3Provider | undefined>()
  // const [connectedNetworkId, setConnectedNetworkId] = useState<number|undefined>()
  const [walletName, setWalletName] = useState<string>('')
  const [walletIcon, setWalletIcon] = useState<string>('')
  const [address, setAddress] = useState<Address | undefined>()
  const [web3ModalActive, setWeb3ModalActive] = useState<boolean>(false)
  const [web3ModalChoice, setWeb3ModalChoice] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { account, chainId: connectedNetworkId, connector, isActivating, isActive, provider: web3ReactProvider } = useWeb3React()

  useEffect(() => {
    const update = async () => {
      if (connector) {
        await connector.connectEagerly()
      }
    }

    update().catch(console.error)
  }, [connector])

  useEffect(() => {
      try {
        if (account) {
          setAddress(Address.from(account))
        } else {
          setAddress(undefined)
        }
      } catch(err) {
        console.error(err)
      }
  }, [account])

  useEffect(() => {
    const update = async () => {
      try {
        const web3ReactProvider: any = connector.provider
        if (web3ReactProvider) {
          const ethersProvider = new providers.Web3Provider(web3ReactProvider, 'any')
          if (web3ReactProvider.enable && !web3ReactProvider.isMetaMask) {
            // needed for WalletConnect and some wallets
            await web3ReactProvider.enable()
          } else {
            // note: this method may not be supported by all wallets
            try {
              await ethersProvider.send('eth_requestAccounts', [])
            } catch (error) {
              logger.error(error)
            }
          }
          setProvider(ethersProvider)
          setWalletName(getName(connector))

          try {
            setWalletIcon(getIcon(connector))
          } catch (err: any) {
            setWalletIcon('')
          }

        } else {
          setWalletName('')
          setWalletIcon('')
          setProvider(undefined)
          setAddress(undefined)
        }
      } catch(err) {
        console.error(err)
        setProvider(undefined)
        setAddress(undefined)
      }
    }

    update().catch(console.error)
  }, [account, connector])

  function requestWallet() {
    setWeb3ModalActive(true)
  }

  useEffect(() => {
    const update = async () => {
      try {
        localStorage.clear()
        disconnectWallet()
        setError('')
        if (web3ModalChoice) {
          const connectorToUse = connectorChoices[web3ModalChoice]
          if (!connectorToUse) {
            throw new Error(`connect not found "${web3ModalChoice}"`)
          }
          await connectorToUse.activate()
        }
        setWeb3ModalActive(false)
      } catch (err) {
        setError(err.message)
        logger.error('web3 react activate error:', err)
      }
    }

    update().catch(logger.error)
  }, [web3ModalChoice])

  function disconnectWallet() {
    const update = async () => {
      try {
        localStorage.clear()
        await connector.resetState()
      } catch (error) {
        logger.error(error)
      }
    }

    update().catch(logger.error)
  }

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

      try {
          // const hexChainId = `0x${Number(networkId).toString(16)}`
          // using rpc:
          // await provider.send('wallet_switchEthereumChain', [{ chainId: hexChainId }])

          // https://docs.uniswap.org/sdk/web3-react/guides/switch-chains
          await connector.activate(networkId)
      } catch (err) {
        // attempt to add chain if can't switch to it
        if (err.code === 4902) {
          const chainInfo = getWeb3Chains().find(chain => Number(chain.id) === Number(networkId))
          if (!chainInfo) {
            throw new Error(`chain info not found for networkId ${networkId}`)
          }

          const addChainInfo = {
            chainId: networkId, // note: use hexChainId for rpc call
            chainName: chainInfo.label,
            nativeCurrency: {
              name: chainInfo.token,
              symbol: chainInfo.token,
              decimals: 18
            },
            rpcUrls: [chainInfo.rpcUrl],
            blockExplorerUrls: chainInfo.explorerUrls
          }

          // using rpc:
          // await provider.send('wallet_addEthereumChain', [addChainInfo])

          // https://docs.uniswap.org/sdk/web3-react/guides/switch-chains
          await connector.activate(addChainInfo)
        } else {
          throw err
        }
      }
    } catch (err: any) {
      logger.error('checkConnectedNetworkId error:', err)
      throw err
    }

    // after network switch, recheck if provider is connected to correct network.
    const postCheckSignerNetworkId = await provider.getNetwork()
    if (postCheckSignerNetworkId.chainId === networkId) {
      return true
    }

    return false
  }

  const walletConnected = !!address

  const walletOptions = useMemo(() => {
    return [
      {
        id: 'metamask',
        name: 'MetaMask',
        icon: MetaMaskLogo
      },
      {
        id: 'walletconnect',
        name: 'WalletConnect',
        icon: WalletConnectLogo
      },
      {
        id: 'coinbasewallet',
        name: 'Coinbase Wallet',
        icon: CoinbaseWalletLogo
      },
      {
        id: 'gnosissafe',
        name: 'Gnosis Safe',
        icon: GnosisSafeLogo
      }
    ]
  }, [])

  return (
    <Web3Context.Provider
      value={{
        provider,
        address,
        walletConnected,
        connectedNetworkId,
        requestWallet,
        disconnectWallet,
        walletName,
        walletIcon,
        checkConnectedNetworkId,
        web3ModalActive,
        setWeb3ModalActive,
        setWeb3ModalChoice,
        error,
        walletOptions
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
