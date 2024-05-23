import Address from '#models/Address.js'
import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import MetaMaskLogo from '#assets/logos/metamask.svg'
import WalletConnectLogo from '#assets/logos/walletconnect.svg'
import GnosisSafeLogo from '#assets/logos/gnosissafe.svg'
import CoinbaseWalletLogo from '#assets/logos/coinbasewallet.svg'
import logger from '#logger/index.js'
import { providers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { NetworkSlug, getChains } from '@hop-protocol/sdk'
import { isGoerli, isMainnet, reactAppNetwork, walletConnectProjectId } from '#config/index.js'
import { capitalize } from '#utils/capitalize.js'
import { Web3ReactHooks, initializeConnector } from '@web3-react/core'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { MetaMask } from '@web3-react/metamask'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import type { Connector } from '@web3-react/types'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { formatError } from '#utils/format.js'

type ChainInfo = {
  chainId: number
  isL1: boolean
  token: string
  name: string
  rpcUrl: string
  explorerUrls: string[]
}

type WalletOption = {
  id: string
  name: string
  icon: string
}

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

function getWeb3Chains(): ChainInfo[] {
  const chains = getChains(reactAppNetwork as NetworkSlug)
  const items: ChainInfo[] = []

  for (const chain of chains) {
    const chainId = Number(chain.chainId)
    const token = chain.nativeTokenSymbol
    const explorerUrls = chain.explorerUrls
    const isL1 = chain.isL1
    let rpcUrl = chain.publicRpcUrl
    let name = `${chain.name}`
    if (!isMainnet) {
      name = `${name} ${capitalize(reactAppNetwork)}`
    }

    // Note: This are overrides for when adding network to wallet
    if (chain.slug === 'linea') {
      if (isGoerli) {
        rpcUrl = 'https://rpc.goerli.linea.build'
      } else if (isMainnet) {
        rpcUrl = 'https://rpc.linea.build'
      }
    }

    items.push({
      chainId,
      isL1,
      token,
      name,
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
        url: getWeb3Chains().filter((chain) => chain.isL1).map((chain) => chain.rpcUrl)[0],
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
        chains: getWeb3Chains().filter((chain) => chain.isL1).map((chain) => chain.chainId),
        optionalChains: getWeb3Chains().filter((chain) => !chain.isL1).map((chain) => chain.chainId),
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

const connectorMap = {
  metamask: metaMask,
  walletconnect: walletConnectV2,
  coinbasewallet: coinbaseWallet,
  gnosissafe: gnosisSafe
}

const walletOptions = [
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

export type Props = {
  provider: providers.Web3Provider | undefined
  address: Address | undefined
  connectedNetworkId: number | undefined
  requestWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  walletConnected: boolean
  walletName: string
  walletIcon: string
  checkConnectedNetworkId: (chainId: number) => Promise<boolean>
  walletOptions: WalletOption[]
  web3ModalActive: boolean
  setWeb3ModalActive: (active: boolean) => void
  setWeb3ModalChoice: (choice: string) => void
  web3ModalChoice: string
  walletChoiceLoading: boolean
  error: string
}

const Web3Context = createContext<Props | undefined>(undefined)

const Web3ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<providers.Web3Provider | undefined>()
  const [walletName, setWalletName] = useState<string>('')
  const [walletIcon, setWalletIcon] = useState<string>('')
  const [address, setAddress] = useState<Address | undefined>()
  const [web3ModalActive, setWeb3ModalActive] = useState<boolean>(false)
  const [web3ModalChoice, setWeb3ModalChoice] = useState<string>('')
  const [walletChoiceLoading, setWalletChoiceLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { account, chainId: connectedNetworkId, connector } = useWeb3React()

  useEffect(() => {
    const update = async () => {
      if (connector) {
        await connector.connectEagerly()
      }
    }
    update().catch(logger.error)
  }, [connector])

  useEffect(() => {
    const update = async () => {
      try {
        const connectorProvider: any = connector.provider // This is the raw injected provider so type has to be "any" since it's not a Web3Provider
        if (connectorProvider) {
          const ethersProvider = new providers.Web3Provider(connectorProvider, 'any')
          if (connectorProvider.enable && !connectorProvider.isMetaMask) {
            // Note: This is needed for WalletConnect and some wallets, so call enable() if available
            await connectorProvider.enable()
          } else {
            // Note: This attempts to connect to first available account, needed by some wallets.
            // This method may not be supported by all wallets.
            try {
              await ethersProvider.send('eth_requestAccounts', [])
            } catch (error) {
              logger.error(error)
            }
          }
          setProvider(ethersProvider)
        } else {
          setProvider(undefined)
        }
      } catch(err) {
        logger.error(err)
        setProvider(undefined)
      }
    }
    update().catch(logger.error)
  }, [account, connector])

  useEffect(() => {
      try {
        if (account) {
          setAddress(Address.from(account))
        } else {
          setAddress(undefined)
        }
      } catch(err) {
        logger.error(err)
        setAddress(undefined)
      }
  }, [account])

  useEffect(() => {
    if (connector) {
      setWalletName(getName(connector))
      setWalletIcon(getIcon(connector))
    } else {
      setWalletName('')
      setWalletIcon('')
    }
  }, [connector])

  useEffect(() => {
    const update = async () => {
      try {
        await disconnectWallet()
        setError('')
        if (web3ModalChoice) {
          const connectorToUse = connectorMap[web3ModalChoice]
          if (!connectorToUse) {
            throw new Error(`connector not found "${web3ModalChoice}"`)
          }
          setWalletChoiceLoading(true)
          await connectorToUse.activate()
        }
        setWeb3ModalActive(false)
      } catch (err) {
        setError(formatError(err.message))
        logger.error('web3 react activate error:', err)
      }
      setWalletChoiceLoading(false)
    }

    update().catch(logger.error)
  }, [web3ModalChoice])

  async function requestWallet() {
    await disconnectWallet()
    setError('')
    setWeb3ModalActive(true)
  }

  async function disconnectWallet() {
    try {
      localStorage.clear()
      await connector.resetState()
    } catch (error) {
      logger.error(error)
    }
  }

  const checkConnectedNetworkId = async (wantChainId?: number): Promise<boolean> => {
    if (!(wantChainId && provider)) return false
    const haveChainId = (await provider.getNetwork())?.chainId
    logger.debug(`checkConnectedNetworkId want: ${wantChainId}, have: ${haveChainId}`)

    try {
      // Note: Some mobile wallets don't support wallet_switchEthereumChain or wallet_addEthereumChain.
      // Note: Trust Wallet hangs indefinteily on wallet_switchEthereumChain, see issues on discord.
      // Therefore if provider is already connected to correct network,
      // then there's no need to attempt to call network switcher.
      if (haveChainId === wantChainId) {
        return true
      }

      try {
        // Example: using rpc directly:
        // const hexChainId = `0x${Number(wantChainId).toString(16)}`
        // await provider.send('wallet_switchEthereumChain', [{ chainId: hexChainId }])

        await connector.activate(wantChainId)
      } catch (err) {
        // Note: This error code should be standard across wallets.
        // Source: https://docs.metamask.io/wallet/reference/wallet_switchethereumchain/
        const chainNotAddedErrorCode = 4902

        // this attempts to add chain if it can't switch to it
        if (err.code === chainNotAddedErrorCode) {
          const chainInfo = getWeb3Chains().find(chain => chain.chainId === wantChainId)
          if (!chainInfo) {
            throw new Error(`chain info not found for chainId ${wantChainId}`)
          }

          const addChainInfo = {
            chainId: wantChainId, // Note: use hexChainId instead for direct rpc call
            chainName: chainInfo.name,
            nativeCurrency: {
              name: chainInfo.token,
              symbol: chainInfo.token,
              decimals: 18
            },
            rpcUrls: [chainInfo.rpcUrl],
            blockExplorerUrls: chainInfo.explorerUrls
          }

          // Example: using rpc directly:
          // await provider.send('wallet_addEthereumChain', [addChainInfo])

          await connector.activate(addChainInfo)
        } else {
          throw err
        }
      }
    } catch (err) {
      logger.error('checkConnectedNetworkId error:', err)
      throw err
    }

    // Note: This is after network switch, recheck if provider is connected to correct network.
    const haveChainIdPostCheck = (await provider.getNetwork()).chainId
    if (haveChainIdPostCheck === wantChainId) {
      return true
    }

    return false
  }

  const walletConnected = !!address

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
        walletOptions,
        web3ModalActive,
        setWeb3ModalActive,
        setWeb3ModalChoice,
        web3ModalChoice,
        walletChoiceLoading,
        error
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
