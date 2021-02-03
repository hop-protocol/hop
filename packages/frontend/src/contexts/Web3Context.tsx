import React, {
  FC,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState
} from 'react'
import Onboard from 'bnc-onboard'
import { ethers, Contract } from 'ethers'
import Address from 'src/models/Address'
import { getNetworkSpecificMetamaskImage } from 'src/utils'
import {
  l1RpcUrl,
  l1NetworkId,
  infuraKey,
  arbitrumNetworkId,
  optimismNetworkId,
  blocknativeDappid,
  fortmaticApiKey,
  portisDappId,
  arbitrumRpcUrl,
  optimismRpcUrl
} from 'src/config'

import MetamaskAccountsSettingsHighlight from 'src/assets/onboard/metamask-accounts-settings-highlight.png'
import MetamaskSettingsHighlight from 'src/assets/onboard/metamask-settings-highlight.png'
import MetamaskAddNetworkHighlight from 'src/assets/onboard/metamask-add-network-highlight.png'
import MetamaskNewArbitrumNetworkHighlight from 'src/assets/onboard/metamask-new-arbitrum-network-highlight.png'
import MetamaskArbitrumNetworkHighlight from 'src/assets/onboard/metamask-arbitrum-network-highlight.png'
import logger from 'src/logger'

type Props = {
  onboard: any
  provider: ethers.providers.Web3Provider | undefined
  address: Address | undefined
  requiredNetworkId: string
  setRequiredNetworkId: (networkId: string) => void
  connectedNetworkId: string
  validConnectedNetworkId: boolean
  requestWallet: () => void
  disconnectWallet: () => void
  walletConnected: boolean
  walletName: string
  checkConnectedNetworkId: (networkId: number) => Promise<boolean>
  getWriteContract: (contract: Contract | undefined) => Promise<Contract | undefined>
}

const initialState = {
  onboard: undefined,
  provider: undefined,
  address: undefined,
  requiredNetworkId: '',
  connectedNetworkId: '',
  validConnectedNetworkId: false,
  setRequiredNetworkId: (networkId: string) => {},
  requestWallet: () => {},
  disconnectWallet: () => {},
  walletConnected: false,
  walletName: '',
  checkConnectedNetworkId: async (networkId: number): Promise<boolean> => false,
  getWriteContract: async (contract: Contract | undefined): Promise<Contract | undefined> =>
    undefined
}

const Web3Context = createContext<Props>(initialState)

const Web3ContextProvider: FC = ({ children }) => {
  //logger.debug('Web3ContextProvider render')
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >()
  const [requiredNetworkId, setRequiredNetworkId] = useState<string>('')
  const [connectedNetworkId, setConnectedNetworkId] = useState<string>('')
  const [validConnectedNetworkId, setValidConnectedNetworkId] = useState<
    boolean
  >(false)
  const [walletName, setWalletName] = useState<string>('')
  const [address, setAddress] = useState<Address | undefined>()
  const onboard = useMemo(() => {
    const cacheKey = 'selectedWallet'
    const rpcUrl = l1RpcUrl
    const walletOptions = [
      { walletName: 'metamask', preferred: true },
      {
        walletName: 'walletConnect',
        infuraKey,
        preferred: true
      },
      { walletName: 'ledger', rpcUrl, preferred: true },
      {
        walletName: 'trezor',
        appUrl: 'hop.exchange',
        email: 'contact@hop.exchange',
        rpcUrl,
        preferred: true
      },
      { walletName: 'dapper' },
      { walletName: 'fortmatic', apiKey: fortmaticApiKey },
      { walletName: 'portis', apiKey: portisDappId, label: 'Portis' },
      { walletName: 'torus' },
      { walletName: 'coinbase' },
      { walletName: 'trust', rpcUrl },
      { walletName: 'authereum' },
      { walletName: 'opera' },
      { walletName: 'operaTouch' },
      { walletName: 'status' },
      { walletName: 'imToken', rpcUrl }
    ]

    const networkCheck = async (state: any): Promise<any> => {
      const networkNames: any = {
        '1': 'Mainnet',
        '3': 'Ropsten',
        '4': 'Rinkeby',
        '5': 'Goerli',
        '42': 'Kovan',
        [arbitrumNetworkId]: 'Arbitrum',
        [optimismNetworkId]: 'Optimism'
      }
      const walletName = state.wallet.name
      const gotNetworkId = state.network.toString()
      const wantNetworkId = state.appNetworkId.toString()
      if (gotNetworkId === wantNetworkId) {
        return null
      }

      const gotNetworkName = networkNames[gotNetworkId] || 'local'
      const wantNetworkName = networkNames[wantNetworkId] || 'local'
      let wantRpcUrl = ''
      if (wantNetworkId === arbitrumNetworkId) {
        wantRpcUrl = arbitrumRpcUrl
      }
      if (wantNetworkId === optimismNetworkId) {
        wantRpcUrl = optimismRpcUrl
      }

      let html = ''
      if (walletName === 'MetaMask') {
        let stepImages: string[] = []
        if (
          wantNetworkId === arbitrumNetworkId ||
          wantNetworkId === optimismNetworkId
        ) {
          stepImages = [
            MetamaskAccountsSettingsHighlight,
            MetamaskSettingsHighlight,
            MetamaskAddNetworkHighlight,
            MetamaskNewArbitrumNetworkHighlight,
            MetamaskArbitrumNetworkHighlight
          ]
        } else if (
          ['Mainnet', 'Ropsten', 'Rinkeby', 'Goerli', 'Kovan'].includes(
            wantNetworkName
          )
        ) {
          const metamaskImage = getNetworkSpecificMetamaskImage(wantNetworkName)
          stepImages = [metamaskImage]
        } else {
          stepImages = [MetamaskAccountsSettingsHighlight]
        }

        html = `
        <div style="font-size: 1.4rem;">
          <p>Instructions on how to change to the <strong>${wantNetworkName}</strong> network in <strong>${walletName}</strong>:</p>
        </div>
        <div style="overflow: auto; max-height: 500px; width: 100%; text-align: center;">
          ${stepImages.map((imageUrl: string) => {
            return `
                <div style="margin-bottom: 2rem">
                  <img
                    style="width: 200px"
                    src="${imageUrl}" alt="" />
                </div>
              `
          })}
        </div>
        `
      }

      return {
        eventCode: 'network',
        heading: 'You Must Change Networks',
        description: `
        <p>We've detected that you need to switch your wallet's network from ${gotNetworkName} to the <strong>${wantNetworkName}</strong> network to continue.</p>
        <p>Requirements:</p>
        <p>
        Network ID: <strong>${wantNetworkId}</strong>
        ${wantRpcUrl ? `<br />RPC URL: <strong>${wantRpcUrl}</strong>` : ''}
      </p>
  `,
        icon: `
          <svg height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="m13.375 28c-1.86075 0-3.375-1.51425-3.375-3.375s1.51425-3.375 3.375-3.375 3.375 1.51425 3.375 3.375-1.51425 3.375-3.375 3.375zm0-4.5c-.619875 0-1.125.504-1.125 1.125s.505125 1.125 1.125 1.125 1.125-.504 1.125-1.125-.505125-1.125-1.125-1.125zm0-6.75c-1.86075 0-3.375-1.51425-3.375-3.375s1.51425-3.375 3.375-3.375 3.375 1.51425 3.375 3.375-1.51425 3.375-3.375 3.375zm0-4.5c-.619875 0-1.125.505125-1.125 1.125s.505125 1.125 1.125 1.125 1.125-.505125 1.125-1.125-.505125-1.125-1.125-1.125zm11.25 4.5c-1.86075 0-3.375-1.51425-3.375-3.375s1.51425-3.375 3.375-3.375 3.375 1.51425 3.375 3.375-1.51425 3.375-3.375 3.375zm0-4.5c-.621 0-1.125.505125-1.125 1.125s.504 1.125 1.125 1.125 1.125-.505125 1.125-1.125-.504-1.125-1.125-1.125zm-11.25 10.117125h-.014625c-.615375-.007875-1.110375-.50175-1.110375-1.117125 0-1.35675.898875-3.375 3.375-3.375h6.75c.50625-.0135 1.125-.219375 1.125-1.125v-1.125c0-.621.502875-1.125 1.125-1.125s1.125.504 1.125 1.125v1.125c0 2.476125-2.01825 3.375-3.375 3.375h-6.75c-.905625 0-1.1115.61875-1.125 1.1385-.01575.610875-.51525 1.103625-1.125 1.103625zm0 1.132875c-.621 0-1.125-.502875-1.125-1.125v-6.75c0-.621.504-1.125 1.125-1.125s1.125.504 1.125 1.125v6.75c0 .622125-.504 1.125-1.125 1.125z" fill="currentColor" transform="translate(-10 -10)"></path>
            </svg>
        `,
        html
      }
    }

    const instance = Onboard({
      dappId: blocknativeDappid,
      networkId: Number(l1NetworkId),
      walletSelect: {
        wallets: walletOptions
      },
      walletCheck: [
        { checkName: 'derivationPath' },
        { checkName: 'accounts' },
        { checkName: 'connect' },
        //{ checkName: 'network' },
        networkCheck,
        { checkName: 'balance' }
      ],
      subscriptions: {
        address: async (address: string) => {
          logger.debug('wallet address:', address)
          if (address) {
            setAddress(Address.from(address))
          }
        },
        wallet: async (wallet: any) => {
          try {
            logger.debug('wallet name:', wallet.name)
            const { name, provider } = wallet
            if (provider) {
              localStorage.setItem(cacheKey, name)
              const ethersProvider = new ethers.providers.Web3Provider(
                provider,
                'any'
              )
              setProvider(ethersProvider)
              setWalletName(name)
              if (provider.enable) {
                await provider.enable()
              }
            } else {
              setWalletName('')
              setProvider(undefined)
              setAddress(undefined)
            }
          } catch (err) {
            logger.error(err)
          }
        },
        network: (connectedNetworkId: number) => {
          if (connectedNetworkId) {
            setConnectedNetworkId(connectedNetworkId.toString())
          } else {
            setConnectedNetworkId('')
          }
        }
      }
    })

    const cachedWallet = window.localStorage.getItem(cacheKey)
    if (cachedWallet) {
      instance.walletSelect(cachedWallet)
    }

    return instance
  }, [setProvider, setConnectedNetworkId])

  useEffect(() => {
    if (requiredNetworkId) {
      onboard.config({ networkId: Number(requiredNetworkId) })
      if (onboard.getState().address) {
        onboard.walletCheck()
      }
    }
  }, [onboard, requiredNetworkId, connectedNetworkId])

  useEffect(() => {
    if (onboard.getState().address) {
      setValidConnectedNetworkId(connectedNetworkId === requiredNetworkId)
    } else {
      setValidConnectedNetworkId(false)
    }
  }, [onboard, connectedNetworkId, requiredNetworkId])

  const requestWallet = () => {
    const _requestWallet = async () => {
      try {
        await onboard.walletSelect()
      } catch (err) {
        logger.error(err)
      }
    }

    _requestWallet()
  }

  const disconnectWallet = () => {
    ;(async () => {
      try {
        await onboard.walletReset()
      } catch (err) {
        logger.error(err)
      }
    })()
  }

  const walletConnected = !!address

  const checkConnectedNetworkId = async (networkId: number): Promise<boolean> => {
    console.log('checkConnectedNetworkId')
    const signerNetworkId = (await provider?.getNetwork())?.chainId
    if (networkId != signerNetworkId) {
      onboard.config({ networkId })
      if (onboard.getState().address) {
        onboard.walletCheck()
      }
      return false
    }

    return true
  }

  const getWriteContract = async (
    contract?: Contract
  ): Promise<Contract | undefined> => {
    if (!contract) return
    const signerNetworkId = (await provider?.getNetwork())?.chainId
    const contractNetworkId = (await contract.provider.getNetwork()).chainId
    if (signerNetworkId != contractNetworkId) {
      onboard.config({ networkId: Number(contractNetworkId) })
      if (onboard.getState().address) {
        onboard.walletCheck()
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
        walletConnected,
        requiredNetworkId,
        setRequiredNetworkId,
        connectedNetworkId,
        validConnectedNetworkId,
        requestWallet,
        disconnectWallet,
        walletName,
        checkConnectedNetworkId,
        getWriteContract
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3Context: () => Props = () => useContext(Web3Context)

export default Web3ContextProvider
